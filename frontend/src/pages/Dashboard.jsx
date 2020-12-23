import React, { useState, useEffect } from 'react';
import { gql, useSubscription, useMutation } from '@apollo/client';
import { useHistory } from 'react-router-dom';
import Topbar from '../components/Topbar';
import Store from '../components/Store';
import Listing from '../components/Listing';
import {
  Alert,
  AlertIcon,
  useDisclosure,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Editable,
  EditablePreview,
  EditableInput,
  Button,
  Grid,
  Text,
  Flex,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from '@chakra-ui/react';
import { PlusSquareIcon, DeleteIcon } from '@chakra-ui/icons';
import StackLoading from '../components/StackLoading';

const GET_DASHBOARD = gql`
  subscription {
    store_admin_current {
      id
      name
      listing_aggregate {
        aggregate {
          count
        }
      }
      vendor {
        user {
          id
          full_name
          created_at
        }
      }
      listing {
        name
        id
        price
        sold
      }
    }
  }
`;

const CREATE_STORE = gql`
  mutation($name: String!) {
    insert_store(objects: { name: $name }) {
      returning {
        id
      }
    }
  }
`;

const EDIT_STORE = gql`
  mutation($id: Int!, $name: String!) {
    update_store(where: { id: { _eq: $id } }, _set: { name: $name }) {
      returning {
        id
        name
      }
    }
  }
`;

const DELETE_STORE = gql`
  mutation($id: Int!) {
    delete_store(where: { id: { _eq: $id } }) {
      returning {
        id
        name
      }
    }
  }
`;

function Stores({ stores }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [addStore] = useMutation(CREATE_STORE);
  const [deleteStore] = useMutation(DELETE_STORE);
  const [editStore] = useMutation(EDIT_STORE);
  const [storeOpened, setStoreOpened] = useState();

  const history = useHistory();

  const isCurrentStoreNew = !stores.find(
    (store) => store.id === storeOpened?.id
  );

  useEffect(() => {
    if (storeOpened) {
      if (!isCurrentStoreNew) {
        editStore({
          variables: { id: storeOpened.id, name: storeOpened.name },
        });
      }
    }
  }, [editStore, isCurrentStoreNew, storeOpened]);

  return (
    <>
      <Flex pb={3} pr={3} pl={3} justifyContent="flex-end" wrap="wrap">
        <Button
          onClick={() => {
            onOpen();
            setStoreOpened({ name: 'New Store' });
          }}
          colorScheme="green"
          leftIcon={<PlusSquareIcon />}
        >
          New
        </Button>
      </Flex>
      {stores.length ? (
        <Flex style={{ gap: '1rem' }} justifyContent="center" wrap="wrap">
          {stores.map((store) => (
            <Store
              key={store.id}
              {...store}
              onEditClick={() => {
                onOpen();
                setStoreOpened(store);
              }}
              onClick={() => history.push(`/store/${store.id}`)}
            />
          ))}
        </Flex>
      ) : (
        <Flex
          pb={3}
          pr={3}
          pl={3}
          style={{ gap: '1rem' }}
          justifyContent="space-around"
          wrap="wrap"
        >
          <Alert p={5} status="warning">
            <AlertIcon />
            You don't own any stores.
          </Alert>
        </Flex>
      )}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Store</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {storeOpened && (
              <Grid templateColumns="2fr 3fr">
                <Text as="b">Name</Text>
                <Input
                  onChange={(event) =>
                    setStoreOpened({ ...storeOpened, name: event.target.value })
                  }
                  defaultValue={storeOpened.name}
                />
                {/*<Text as="b">Vendors</Text>
              <Text></Text>*/}
                <ModalFooter>
                  {isCurrentStoreNew ? (
                    <Button
                      onClick={() => {
                        onClose();
                        addStore({ variables: { name: storeOpened.name } });
                      }}
                      colorScheme="green"
                      leftIcon={<PlusSquareIcon />}
                    >
                      Submit
                    </Button>
                  ) : (
                    <Button
                      onClick={() => {
                        onClose();
                        deleteStore({ variables: { id: storeOpened.id } });
                      }}
                      size="sm"
                      colorScheme="red"
                      leftIcon={<DeleteIcon />}
                    >
                      Delete Store
                    </Button>
                  )}
                </ModalFooter>
              </Grid>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

function Listings({ stores, onClick }) {
  return (
    <Flex
      pb={3}
      pr={3}
      pl={3}
      style={{ gap: '1rem' }}
      justifyContent="space-around"
      wrap="wrap"
    >
      {stores.find((store) => store.listing.length) ? (
        stores.map(({ listing }) =>
          listing.map((value) => (
            <Listing {...value} onClick={() => onClick(value.id)} />
          ))
        )
      ) : (
        <Alert p={5} status="warning">
          <AlertIcon />
          There aren't any listings in any of your stores.
        </Alert>
      )}
    </Flex>
  );
}

export default function Dashboard() {
  const { data, loading } = useSubscription(GET_DASHBOARD);
  const stores = data?.store_admin_current || [];

  const history = useHistory();

  const handleListingClick = (id) => {
    history.push(`/listing/${id}`);
  };

  if (loading) {
    return <StackLoading />;
  }

  return (
    <Flex
      w="100%"
      direction="column"
      justifyContent="space-around"
      alignItems="center"
    >
      <Topbar />
      <Tabs w="100%">
        <TabList>
          <Tab>My Stores</Tab>
          <Tab>My Listings</Tab>
        </TabList>

        <TabPanels mt={5}>
          <TabPanel>
            <Stores stores={stores} />
          </TabPanel>
          <TabPanel>
            <Listings stores={stores} onClick={handleListingClick} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>
  );
}
