import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { gql, useSubscription, useMutation } from '@apollo/client';
import { useHistory } from 'react-router-dom';
import UserDisplay from './UserDisplay';
import Topbar from './Topbar';
import Store from './Store';
import Listing from './Listing';
import {
  Stack,
  Avatar,
  AvatarBadge,
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
  subscription {
    vendor_current {
      listing {
        name
        id
        price
        sold
      }
      store {
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
      }
    }
  }
`;

const CREATE_STORE = gql`
  mutation($name: String!) {
    insert_store(objects: { vendor: { data: {} }, name: $name }) {
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

export default function Dashboard() {
  const { user, isLoading } = useAuth0();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { loading, error, data } = useSubscription(GET_DASHBOARD);
  const [addStore, { data: store }] = useMutation(CREATE_STORE);
  const [deleteStore] = useMutation(DELETE_STORE);
  const [editStore] = useMutation(EDIT_STORE);
  const [currentStore, setCurrentStore] = useState();
  const vendors = data?.vendor_current || [];

  const history = useHistory();

  useEffect(() => {
    if (currentStore)
      editStore({
        variables: { id: currentStore.id, name: currentStore.name },
      });
  }, [editStore, currentStore]);

  console.log(vendors);

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
            <Flex
              pb={3}
              pr={3}
              pl={3}
              justifyContent="flex-end"
              wrap="wrap"
            >
              <Button
                onClick={() => addStore({ variables: { name: 'Hello World' } })}
                variantColor="green"
                leftIcon="plus-square"
              >
                Create Store
              </Button>
            </Flex>
            <Flex style={{ gap: '1rem' }} justifyContent="center" wrap="wrap">
              {vendors.map(({ store }) => (
                <Store
                  {...store}
                  onClick={() => {
                    onOpen();
                    setCurrentStore(store);
                  }}
                />
              ))}
            </Flex>
          </TabPanel>
          <TabPanel>
            <Flex
              pb={3}
              pr={3}
              pl={3}
              justifyContent="flex-end"
              wrap="wrap"
            >
              <Button
                onClick={() => addStore({ variables: { name: 'Hello World' } })}
                variantColor="green"
                leftIcon="plus-square"
              >
                Create Store
              </Button>
            </Flex>
            <Flex
              pb={3}
              pr={3}
              pl={3}
              style={{ gap: '1rem' }}
              justifyContent="space-around"
              wrap="wrap"
            >
              {vendors.map(({ listing }) =>
                listing.map((value) => <Listing {...value} />)
              )}
            </Flex>
          </TabPanel>
        </TabPanels>
      </Tabs>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Store</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {currentStore && (
              <Grid templateColumns="2fr 3fr">
                <Text as="b">Name</Text>
                <Editable
                  onSubmit={(name) =>
                    setCurrentStore({ ...currentStore, name })
                  }
                  defaultValue={currentStore.name}
                >
                  <EditablePreview />
                  <EditableInput />
                </Editable>
                <Text as="b">Vendors</Text>
                <Text></Text>
                <ModalFooter>
                  <Button
                    onClick={() => {
                      onClose();
                      deleteStore({ variables: { id: currentStore.id } });
                    }}
                    size="sm"
                    variantColor="red"
                    leftIcon="delete"
                  >
                    Delete Store
                  </Button>
                </ModalFooter>
              </Grid>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Flex>
  );
}
