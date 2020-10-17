import React, { useState, useCallback, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import Topbar from './Topbar';
import {
  Box,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Image,
  Grid,
  Text,
  Editable,
  EditablePreview,
  EditableInput,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  ModalFooter,
  Alert,
  AlertIcon,
  Tag,
  Heading,
  Flex,
  Button,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from '@chakra-ui/core';
import Store from './Store';
import PropTypes from 'prop-types';
import Listing from './Listing';
import { gql, useQuery, useSubscription, useMutation } from '@apollo/client';
import { useDropzone } from 'react-dropzone';

const GET_STORES = gql`
  query {
    my_stores: store_admin_current {
      id
    }
    stores: store {
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
      listing {
        id
        name
        price
        sold
      }
    }
  }
`;

const CREATE_LISTING = gql`
  mutation($name: String!, $price: Int!, $store_id: Int!) {
    insert_listing(
      objects: { name: $name, price: $price, store_id: $store_id }
    ) {
      returning {
        id
      }
    }
  }
`;

function Listings({ listings }) {
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
        listings.map((value) => <Listing {...value} />)
      ) : (
        <Alert p={5} status="warning">
          <AlertIcon />
          This store is empty.
        </Alert>
      )}
    </Flex>
  );
}

const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

function ImageDropzone({ setIsUploading }) {
  const [files, setFiles] = useState([]);
  const onDrop = useCallback(
    async (acceptedFiles) => {
      const acceptedFilesAsBase64 = await Promise.all(
        acceptedFiles.map(async (file) => await toBase64(file))
      );
      setFiles([...files, ...acceptedFilesAsBase64]);
      setIsUploading(true);
    },
    [files]
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  useEffect(
    () =>
      (async () => {
        console.log('upload');
      })(),
    []
  );

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <Box cursor="pointer" borderRadius={8}>
        {files.length ? (
          <Box
            display="flex"
            direction="row"
            overflow="auto"
            minHeight={200}
            borderRadius={8}
          >
            {files.map((img) => (
              <Image width="auto" height={200} src={img} />
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
            {isDragActive
              ? "Gimmie Images! I'm Hungry 🤤"
              : '📁 Upload or Drop Images'}
          </Box>
        )}
      </Box>
    </div>
  );
}

ImageDropzone.propTypes = {
  setIsUploading: PropTypes.func,
};

export default function ViewListings() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { id } = useParams();

  const [name, setName] = useState('New Listing');
  const [price, setPrice] = useState(10);
  const [isUploading, setIsUploading] = useState(false);

  const { data: storesData } = useQuery(GET_STORES);
  const { data: storeData } = useSubscription(GET_STORE, { variables: { id } });
  const [addListing] = useMutation(CREATE_LISTING);

  const [store] = storeData?.store || [{ listing: [] }];
  const stores = storesData?.stores || [];
  const myStores = storesData?.my_stores || [];

  const history = useHistory();

  const isAdmin = myStores.some((myStore) => myStore.id === store.id);

  const handleStoreClick = (id) => {
    history.push(`/store/${id}`);
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
      <Flex w="100%" p={5} overflow="hidden" justifyContent="space-between">
        <Flex flex={1} mr={5} direction="column">
          <Heading>{store.name}</Heading>
          <Flex>
            <Tag color="blue">STORE</Tag>
          </Flex>
          <Tabs w="100%" overflow="hidden">
            <TabList>
              <Tab>Listings</Tab>
              <Tab>Discussion</Tab>
            </TabList>

            <TabPanels mt={5}>
              <TabPanel>
                <Flex mb={5} justifyContent="flex-end">
                  {isAdmin && (
                    <Button
                      onClick={onOpen}
                      variantColor="green"
                      leftIcon="plus-square"
                    >
                      New
                    </Button>
                  )}
                </Flex>
                <Listings listings={store.listing} />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Flex>
        <Flex direction="column">
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
                <Store onClick={() => handleStoreClick(store.id)} {...store} />
              </Flex>
            ))}
          </Flex>
        </Flex>
      </Flex>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Listing</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Grid gap={1} templateColumns="2fr 3fr">
              <Text as="b">Name</Text>
              <Editable onSubmit={setName} defaultValue="New Listing">
                <EditablePreview />
                <EditableInput />
              </Editable>
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
              <Text as="b">Images</Text>
            </Grid>
            <ImageDropzone setIsUploading={setIsUploading} />
            <ModalFooter>
              <Button
                onClick={() => {
                  onClose();
                  addListing({
                    variables: { name, price, store_id: store.id },
                  });
                }}
                isDisabled={isUploading}
                variantColor="green"
                leftIcon="plus-square"
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
