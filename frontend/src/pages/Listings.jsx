import { gql, useQuery } from '@apollo/client';
import { CheckIcon, SearchIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  ControlBox,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  IconButton,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  Tag,
  Text,
  useDisclosure,
  VisuallyHidden,
} from '@chakra-ui/react';
import React, { useRef, useState } from 'react';
import { FaFilter } from 'react-icons/fa';
import { useHistory } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import Topbar from '../components/Topbar';
import StackLoading from '../components/StackLoading';

const GET_LISTINGS = gql`
  query GetListings(
    $name: String!
    $sold: Boolean!
    $limit: Int
    $offset: Int
  ) {
    listing_aggregate {
      aggregate {
        count
      }
    }
    listing(
      where: { name: { _ilike: $name }, sold: { _eq: $sold } }
      order_by: { created_at: desc }
      limit: $limit
      offset: $offset
    ) {
      id
      name
      price
      sold
      created_at
      resources {
        resource {
          image {
            id
          }
        }
      }
      store {
        id
        name
      }
    }
  }
`;

const Listing = ({ onClick, id, resources, store, name, price, sold }) => {
  return (
    <Flex
      direction="column"
      w="100%"
      p={3}
      minH={200}
      borderWidth="1px"
      rounded="md"
      overflow="hidden"
      cursor="pointer"
      onClick={(ev) => onClick(ev, id)}
    >
      <Flex w="100%">
        <Flex w="100%" justifyContent="space-between" alignItems="center">
          <Text fontWeight="800">{name}</Text>
          <Flex height="100%" alignItems="center">
            <Tag colorScheme="yellow" mr={3}>
              {price} STK
            </Tag>
            <Tag colorScheme="cyan">{sold ? 'Sold' : 'For Sale'}</Tag>
          </Flex>
        </Flex>
      </Flex>
      <Flex pt={2} pb={2} w="100%" overflowX="auto" flex={1}>
        {resources.map(({ resource: { image: { id: imageId } } }) => (
          <Image
            key={imageId}
            src={`${process.env.REACT_APP_UPLOADS_URL}/${imageId}`}
            height={100}
            alt="Listing Image"
          />
        ))}
      </Flex>
      <Flex>Sold By:&nbsp;{store.name}</Flex>
    </Flex>
  );
};

export default function ViewListings() {
  const [search, setSearch] = useState('');
  const [showSold, setShowSold] = useState(false);
  const [limit, setLimit] = useState(5);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const filterRef = useRef();
  const { data, fetchMore } = useQuery(GET_LISTINGS, {
    variables: {
      name: `%${search}%`,
      sold: showSold,
      limit: limit,
      offset: 0,
    },
  });
  const { listing: listings } = data || { listing: [] };

  const history = useHistory();

  const handleListingClick = (id) => {
    history.push(`/listing/${id}`);
  };

  return (
    <Flex
      w="100%"
      direction="column"
      justifyContent="space-around"
      alignItems="center"
      overflow="hidden"
      h="100vh"
    >
      <Topbar />
      <Flex
        p={1}
        w="100%"
        maxW={800}
        direction="column"
        overflow="hidden"
        flex={1}
      >
        <InputGroup pb={4}>
          <InputLeftElement children={<SearchIcon color="gray.300" />} />
          <Input
            type="text"
            onChange={(value) => setSearch(value.target.value)}
            mr={3}
            placeholder="Search"
          />
          <IconButton
            ref={filterRef}
            onClick={onOpen}
            colorScheme="teal"
            aria-label="Filters"
            icon={<FaFilter />}
          />
          <Drawer
            isOpen={isOpen}
            placement="right"
            onClose={onClose}
            finalFocusRef={filterRef}
          >
            <DrawerOverlay />
            <DrawerContent>
              <DrawerCloseButton />
              <DrawerHeader>What're you looking for?</DrawerHeader>

              <DrawerBody>
                <label>
                  <VisuallyHidden
                    as="input"
                    onChange={(event) => setShowSold(event.target.checked)}
                    type="checkbox"
                  />
                  <ControlBox
                    borderWidth="1px"
                    size="24px"
                    rounded="sm"
                    _checked={{
                      bg: 'green.500',
                      color: 'white',
                      borderColor: 'green.500',
                    }}
                    _focus={{ borderColor: 'green.600', boxShadow: 'outline' }}
                  >
                    <CheckIcon size="16px" />
                  </ControlBox>
                  <Box
                    as="span"
                    ml={2}
                    verticalAlign="center"
                    userSelect="none"
                  >
                    Show Sold
                  </Box>
                </label>
              </DrawerBody>

              <DrawerFooter>
                <Button variant="outline" mr={3} onClick={onClose}>
                  Cancel
                </Button>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </InputGroup>
        <Flex id="listings" overflow="auto">
          <InfiniteScroll
            dataLength={listings.length}
            next={() => {
              fetchMore({
                variables: { offset: listings.length, limit: 5 },
              }).then((fetchMoreResult) => {
                setLimit(limit + fetchMoreResult.data.listing.length);
              });
            }}
            hasMore={listings.length < data?.listing_aggregate.aggregate.count}
            loader={<StackLoading height="100px" />}
            scrollableTarget="listings"
          >
            {listings.map((listing) => (
              <Flex key={listing.id} mb={5}>
                <Listing
                  {...listing}
                  onClick={(_, id) => handleListingClick(id)}
                />
              </Flex>
            ))}
          </InfiniteScroll>
        </Flex>
      </Flex>
    </Flex>
  );
}
