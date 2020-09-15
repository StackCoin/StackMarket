import React, { useState, useEffect } from 'react';
import { gql, useSubscription, useMutation } from '@apollo/client';
import { useHistory } from 'react-router-dom';
import Topbar from './Topbar';
import Store from './Store';
import Listing from './Listing';
import {
  Alert,
  AlertIcon,
  useDisclosure,
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
} from '@chakra-ui/core';

const GET_DASHBOARD = gql`
  query {
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
  }, [editStore, storeOpened]);

  return (
    <>
      <Flex pb={3} pr={3} pl={3} justifyContent="flex-end" wrap="wrap">
        <Button
          onClick={() => {
            onOpen();
            setStoreOpened({ name: 'New Store' });
          }}
          variantColor="green"
          leftIcon="plus-square"
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
                <Editable
                  onSubmit={(name) =>
                    setStoreOpened({ ...storeOpened, name: name })
                  }
                  defaultValue={storeOpened.name}
                >
                  <EditablePreview />
                  <EditableInput />
                </Editable>
                {/*<Text as="b">Vendors</Text>
              <Text></Text>*/}
                <ModalFooter>
                  {isCurrentStoreNew ? (
                    <Button
                      onClick={() => {
                        onClose();
                        addStore({ variables: { name: storeOpened.name } });
                      }}
                      variantColor="green"
                      leftIcon="plus-square"
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
                      variantColor="red"
                      leftIcon="delete"
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

function Listings({ stores }) {
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
          listing.map((value) => <Listing {...value} />)
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
  const { data, error } = useSubscription(GET_DASHBOARD);
  const stores = data?.store_admin_current || [];

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
            <Listings stores={stores} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>
  );
}
