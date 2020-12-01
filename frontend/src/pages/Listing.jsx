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
import ImageGallery from 'react-image-gallery';
import '../../node_modules/react-image-gallery/styles/css/image-gallery.css';

const GET_LISTING = gql`
  query($id: Int!) {
    listing(where: { id: { _eq: $id } }) {
      id
      name
      price
      sold
      store_id
      sold_at
      resources {
        resource {
          image {
            id
          }
        }
      }
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
    listing: [{ name: '', resources: [] }],
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
            <Tag variantColor="blue" mr={2}>
              Listing
            </Tag>
            <Tag variantColor="yellow">{listing.price} STK</Tag>
          </Flex>
          <Tabs w="100%" overflow="hidden">
            <TabList>
              <Tab>Details</Tab>
              <Tab>Discussion</Tab>
            </TabList>

            <TabPanels mt={5}>
              <TabPanel>
                {listing.resources.length !== 0 && (
                  <ImageGallery
                    items={listing.resources.map(
                      ({
                        resource: {
                          image: { id: imageId },
                        },
                      }) => ({
                        original: `${process.env.REACT_APP_UPLOADS_URL}/${imageId}`,
                      })
                    )}
                  />
                )}
              </TabPanel>
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
