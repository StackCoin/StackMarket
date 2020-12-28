import { gql, useMutation, useQuery } from '@apollo/client';
import {
  Button,
  Flex,
  Heading,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tag,
  Text,
  useMediaQuery,
} from '@chakra-ui/react';
import React from 'react';
import ImageGallery from 'react-image-gallery';
import { Link, useHistory, useParams } from 'react-router-dom';
import '../../node_modules/react-image-gallery/styles/css/image-gallery.css';
import Topbar from '../components/Topbar';
import StackLoading from '../components/StackLoading';

const GET_LISTING = gql`
  query($id: Int!) {
    my_stores: store_admin_current {
      id
    }
    listings: listing(where: { id: { _eq: $id } }) {
      id
      name
      description
      price
      sold
      store {
        id
        name
        admin
      }
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

const DELETE_LISTING = gql`
  mutation($id: Int!) {
    delete_listing(where: { id: { _eq: $id } }) {
      returning {
        id
        name
      }
    }
  }
`;

export default () => {
  const [isLargerThan1280] = useMediaQuery('(min-width: 1280px)');

  const history = useHistory();
  const { id } = useParams();

  const [deleteListing] = useMutation(DELETE_LISTING);
  const { data, loading } = useQuery(GET_LISTING, {
    variables: {
      id,
    },
  });

  if (loading) {
    return <StackLoading />;
  }

  const isAdmin = data.my_stores.some(
    (myStore) => myStore.id === data.listings[0].store.id
  );

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
        overflow="auto"
        justifyContent="space-between"
      >
        <Flex
          flex={1}
          mr={5}
          overflowX="hidden"
          overflowY="auto"
          style={{ gap: '0.5rem' }}
          direction="column"
        >
          <Heading>{data.listings[0].name}</Heading>
          <Flex style={{ gap: '0.5rem' }}>
            <Tag colorScheme="blue">LISTING</Tag>
            <Tag colorScheme="yellow">{data.listings[0].price} STK</Tag>
            <Text
              whiteSpace="nowrap"
              minWidth={0}
              flex={1}
              pt={1}
              fontSize="md"
            >
              Sold By:&nbsp;
              <Link to={`/store/${data.listings[0].store.id}`}>
                {data.listings[0].store.name}
              </Link>
            </Text>
            {isAdmin && (
              <Button
                size="sm"
                colorScheme="red"
                marginLeft="auto"
                onClick={() => {
                  history.goBack();
                  deleteListing({ variables: { id: data.listings[0].id } });
                }}
              >
                Delete
              </Button>
            )}
          </Flex>
          <Tabs w="100%">
            <TabList>
              <Tab>Details</Tab>
              <Tab>Discussion</Tab>
            </TabList>

            <TabPanels mt={5}>
              <TabPanel>
                {data.listings[0].resources.length !== 0 && (
                  <Flex direction="column" style={{ gap: '2rem' }}>
                    <ImageGallery
                      items={data.listings[0].resources.map(
                        ({
                          resource: {
                            image: { id: imageId },
                          },
                        }) => ({
                          original: `${window.__env__.REACT_APP_UPLOADS_URL}/${imageId}`,
                        })
                      )}
                    />
                    <Text fontSize="xl">Description</Text>
                    {data.listings[0].description.trim().length == 0 ? (
                      <Text
                        as="i"
                        fontSize="sm"
                        whiteSpace="pre-line"
                        wordBreak="break-word"
                        overflow="auto"
                      >
                        No Description Provided...
                      </Text>
                    ) : (
                      <Text
                        whiteSpace="pre-line"
                        wordBreak="break-word"
                        overflow="auto"
                      >
                        {data.listings[0].description}
                      </Text>
                    )}
                  </Flex>
                )}
              </TabPanel>
              <TabPanel>
                <Flex mb={5} justifyContent="flex-end">
                  Infdev
                </Flex>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Flex>
        {isLargerThan1280 && (
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
        )}
      </Flex>
    </Flex>
  );
};
