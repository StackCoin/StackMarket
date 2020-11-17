import React from 'react';
import { gql, useQuery } from '@apollo/client';
import { useParams, useHistory } from 'react-router-dom';
import {
  Flex,
  Heading,
  Tag,
  Tabs,
  Tab,
  TabList,
  TabPanels,
  TabPanel,
} from '@chakra-ui/core';
import Topbar from '../components/Topbar';

const GET_LISTING = gql`
  query($id: Int!) {
    listing(where: { id: { _eq: $id } }) {
      id
      name
      price
      sold
      store_id
      sold_at
    }
  }
`;

export default () => {
  const { id } = useParams();
  const { data } = useQuery(GET_LISTING, {
    variables: {
      id,
    },
  });
  const {
    listing: [listing],
  } = data || {
    listing: [{ name: '' }],
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
          <Heading>{listing.name}</Heading>
          <Flex>
            <Tag variantColor="blue">Listing</Tag>
            <Tag variantColor="yellow">{listing.price}</Tag>
          </Flex>
          <Tabs w="100%" overflow="hidden">
            <TabList>
              <Tab>Listings</Tab>
              <Tab>Discussion</Tab>
            </TabList>

            <TabPanels mt={5}>
              <TabPanel>
                <Flex mb={5} justifyContent="flex-end"></Flex>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Flex>
        <Flex direction="column">
          <Heading as="h2" size="sm">
            Other Listings
          </Heading>
          <Flex
            direction="column"
            width="25rem"
            overflowY="auto"
            overflowX="hidden"
          ></Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};
