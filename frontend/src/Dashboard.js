import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { gql, useQuery } from '@apollo/client';
import UserDisplay from './UserDisplay';
import Topbar from './Topbar';
import Store from './Store';
import Listing from './Listing';
import { Flex, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/core';

const GET_DASHBOARD = gql`
  query {
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
        vendors {
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

export default function Dashboard() {
  const { user, isLoading } = useAuth0();
  const { loading, error, data } = useQuery(GET_DASHBOARD);
  const {
    vendor_current: [{ store: stores, listing: listings }],
  } = data || { vendor_current: [{ store: [], listing: [] }] };
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
          <Tab>Stores</Tab>
          <Tab>Listings</Tab>
        </TabList>

        <TabPanels mt={5}>
          <TabPanel>
            <Flex justifyContent="space-around" wrap="wrap">
              {stores.map((store) => (
                <Store {...store} />
              ))}
            </Flex>
          </TabPanel>
          <TabPanel>
            <Flex justifyContent="space-around" wrap="wrap">
              {listings.map((listing) => (
                <Listing {...listing} />
              ))}
            </Flex>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>
  );
}
