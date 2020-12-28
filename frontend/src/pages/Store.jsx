import { gql, useMutation, useQuery, useSubscription } from '@apollo/client';
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  Image,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tag,
  Text,
  Textarea,
  useDisclosure,
  useToast,
  useMediaQuery,
} from '@chakra-ui/react';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useHistory, useParams } from 'react-router-dom';
import Listing from '../components/Listing';
import Store from '../components/Store';
import Topbar from '../components/Topbar';
import upload from '../utils/s3util';
import { PlusSquareIcon, DeleteIcon } from '@chakra-ui/icons';
import StackLoading from '../components/StackLoading';

const GET_STORES = gql`
  query {
    my_stores: store_admin_current {
      id
    }
    stores: store(limit: 5, order_by: { created_at: asc }) {
      id
      name
      vendor {
        user {
          full_name
        }
      }
      listing_aggregate {
        aggregate {
          count
        }
      }
    }
  }
`;

const GET_STORE = gql`
  subscription($id: Int!) {
    store(where: { id: { _eq: $id } }) {
      id
      admin
      created_at
      name
      listing(order_by: { created_at: desc }) {
        id
        name
        price
        description
        sold
      }
    }
  }
`;

const CREATE_LISTING = gql`
  mutation(
    $name: String!
    $price: Int!
    $store_id: Int!
    $description: String!
    $resources: [listing_resource_insert_input!]! = {}
  ) {
    insert_listing(
      objects: {
        name: $name
        price: $price
        store_id: $store_id
        description: $description
        resources: { data: $resources }
      }
    ) {
      returning {
        id
      }
    }
  }
`;

function Listings({ listings, onClick }) {
  return (
    <Flex
      pb={3}
      pl={3}
      style={{ gap: '1rem' }}
      overflowX="hidden"
      overflowY="auto"
      justifyContent="space-around"
      wrap="wrap"
    >
      {listings.length ? (
        listings.map((value) => (
          <Listing {...value} onClick={() => onClick(value.id)} />
        ))
      ) : (
        <Alert p={5} status="warning">
          <AlertIcon />
          This store is empty.
        </Alert>
      )}
    </Flex>
  );
}

function ImageDropzone({
  isUploading,
  setIsUploading,
  completedFiles,
  setCompletedFiles,
}) {
  const [files, setFiles] = useState([]);
  const toast = useToast();
  const onDrop = useCallback(
    async (acceptedFiles) => {
      setFiles([...files, ...acceptedFiles]);
      setIsUploading(true);
    },
    [files]
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  useEffect(() => {
    if (isUploading && files.length) {
      (async () => {
        let newCompletedFiles = completedFiles;
        await Promise.all(
          files.map(async (file) => {
            try {
              const { specialName, uploading } = await upload({
                method: 'PUT',
                body: file,
              });
              const { ok, statusText } = await uploading;
              if (!ok) {
                throw new Error(statusText);
              }
              newCompletedFiles = [...newCompletedFiles, { specialName, file }];
            } catch ({ message }) {
              toast({
                title: "Couldn't upload file",
                description: `${message}`,
                status: 'error',
                isClosable: true,
                duration: 9000,
              });
            }
          })
        );
        setFiles([]);
        setCompletedFiles(newCompletedFiles);
        setIsUploading(false);
      })();
    }
  }, [isUploading, files, completedFiles]);

  const DropzoneMessage = ({ isDragActive, isUploading }) => {
    if (isDragActive) {
      return "Gimmie Images! I'm Hungry 🤤";
    } else if (isUploading) {
      return 'Uploading...';
    } else {
      return '📁 Upload or Drop Images';
    }
  };

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <Box cursor="pointer" borderRadius={8}>
        {completedFiles.length ? (
          <Box
            display="flex"
            direction="row"
            overflow="auto"
            minHeight={200}
            borderRadius={8}
          >
            {completedFiles.map(({ specialName }, index) => (
              <>
                <Image
                  key={index}
                  width="auto"
                  height={200}
                  src={`${window.__env__.REACT_APP_UPLOADS_URL}/${specialName}`}
                />
                <IconButton
                  onClick={(event) => {
                    // We're in a modal, I'm allowed to be lazy
                    event.stopPropagation();
                    setCompletedFiles(
                      completedFiles.filter(
                        ({ specialName: completedSpecialName }) =>
                          completedSpecialName != specialName
                      )
                    );
                  }}
                  aria-label="Delete Image"
                  icon={<DeleteIcon />}
                  size="sm"
                  colorScheme="red"
                  top={0}
                  right={8}
                />
              </>
            ))}
          </Box>
        ) : (
          <Box
            display="flex"
            bg="blue.400"
            color="white"
            direction="row"
            justifyContent="center"
            alignItems="center"
            minHeight={200}
            borderRadius={8}
          >
            <DropzoneMessage
              isDragActive={isDragActive}
              isUploading={isUploading}
            />
          </Box>
        )}
      </Box>
    </div>
  );
}

ImageDropzone.propTypes = {
  setIsUploading: PropTypes.func,
};

export default function StoreView() {
  const [isLargerThan1000] = useMediaQuery('(min-width: 1000px)');

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { id } = useParams();

  const [name, setName] = useState('New Listing');
  const [price, setPrice] = useState(10);
  const [description, setDescription] = useState('');
  const [completedFiles, setCompletedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const { data: storesData, loading: storesLoading } = useQuery(GET_STORES);
  const { data: storeData, loading: storeLoading } = useSubscription(
    GET_STORE,
    { variables: { id } }
  );
  const [addListing] = useMutation(CREATE_LISTING);

  const [store] = storeData?.store || [{ listing: [] }];
  const stores = storesData?.stores || [];
  const myStores = storesData?.my_stores || [];

  const history = useHistory();

  const isAdmin = myStores.some((myStore) => myStore.id === store.id);

  if (storesLoading || storeLoading) {
    return <StackLoading />;
  }

  const handleStoreClick = (id) => {
    history.push(`/store/${id}`);
  };

  const handleListingClick = (id) => {
    history.push(`/listing/${id}`);
  };

  return (
    <Flex
      w="100%"
      h="100vh"
      overflow="hidden"
      direction="column"
      justifyContent="space-around"
      alignItems="center"
    >
      <Topbar />
      <Flex
        w="100%"
        flex={1}
        p={5}
        overflow="hidden"
        justifyContent="space-between"
      >
        <Flex flex={1} mr={5} direction="column">
          <Heading>{store.name}</Heading>
          <Flex>
            <Tag color="blue">STORE</Tag>
          </Flex>
          <Tabs
            w="100%"
            overflow="hidden"
            display="flex"
            flexDirection="column"
          >
            <TabList>
              <Tab>Listings</Tab>
              <Tab>Discussion</Tab>
            </TabList>

            <TabPanels
              overflow="hidden"
              display="flex"
              flexDirection="column"
              mt={5}
            >
              <TabPanel overflow="hidden" display="flex" flexDirection="column">
                <Flex mb={5} justifyContent="flex-end">
                  {isAdmin && (
                    <Button
                      onClick={onOpen}
                      colorScheme="green"
                      leftIcon={<PlusSquareIcon />}
                    >
                      New
                    </Button>
                  )}
                </Flex>
                <Listings
                  listings={store.listing}
                  onClick={handleListingClick}
                />
              </TabPanel>
              <TabPanel>Infdev</TabPanel>
            </TabPanels>
          </Tabs>
        </Flex>
        {isLargerThan1000 && (
          <Flex overflow="hidden" direction="column">
            <Heading as="h2" size="sm">
              Other Stores
            </Heading>
            <Flex
              direction="column"
              width="25rem"
              overflowY="auto"
              overflowX="hidden"
            >
              {stores.map((store) => (
                <Flex mb={4} key={store.id}>
                  <Store
                    onClick={() => handleStoreClick(store.id)}
                    {...store}
                  />
                </Flex>
              ))}
            </Flex>
          </Flex>
        )}
      </Flex>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Listing</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Grid gap={1} templateColumns="2fr 3fr">
              <Text as="b">Name</Text>
              <Input
                onChange={(event) => setName(event.target.value)}
                defaultValue="New Listing"
              />
              <Text as="b">Price (STK)</Text>
              <NumberInput
                onSubmit={setPrice}
                size="sm"
                defaultValue={10}
                min={10}
                step={10}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </Grid>
            <Text as="b">Description</Text>
            <Textarea
              my={2}
              placeholder="Type A Description ..."
              onChange={(event) => setDescription(event.target.value)}
            />
            <Text as="b">Images</Text>
            <ImageDropzone
              isUploading={isUploading}
              setIsUploading={setIsUploading}
              completedFiles={completedFiles}
              setCompletedFiles={setCompletedFiles}
            />
            <ModalFooter>
              <Button
                onClick={() => {
                  onClose();
                  addListing({
                    variables: {
                      name,
                      price,
                      description,
                      store_id: store.id,
                      resources: completedFiles.map(({ specialName }) => ({
                        resource: {
                          data: {
                            image: {
                              data: {
                                id: specialName,
                              },
                            },
                          },
                        },
                      })),
                    },
                  });
                  setCompletedFiles([]);
                }}
                isDisabled={isUploading}
                colorScheme="green"
                leftIcon={<PlusSquareIcon />}
              >
                Submit
              </Button>
            </ModalFooter>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Flex>
  );
}
