import React, { useState, useRef } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { FaFilter } from 'react-icons/fa';
import {
  VisuallyHidden,
  ControlBox,
  Box,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Button,
  Grid,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Tag,
  Image,
  InputGroup,
  InputLeftElement,
  Icon,
  Input,
  Link,
  Flex,
  Text,
  IconButton,
} from '@chakra-ui/core';
import Topbar from '../components/Topbar';
import { gql, useQuery } from '@apollo/client';

const GET_LISTING = gql`
  query($id: Int!) {
    listing(where: { id: { _eq: $id } }) {
      id
      name
      price
      sold
      created_at
    }
  }
`;

const GET_LISTINGS = gql`
  query GetListings($name: String!, $sold: Boolean!) {
    listing(
      where: { name: { _ilike: $name }, sold: { _eq: $sold } }
      order_by: { created_at: desc }
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
            <Tag variantColor="yellow" mr={3}>
              {price} STK
            </Tag>
            <Tag variantColor="cyan">{sold ? 'Sold' : 'For Sale'}</Tag>
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
      <Flex>
        Sold By:&nbsp;
        <Link color="teal.500" href="#">
          {store.name}
        </Link>
      </Flex>
    </Flex>
  );
};

const ListingView = ({ id, onReturnToListings }) => {
  const { data } = useQuery(GET_LISTING, { variables: { id } });
  const {
    listing: [listing],
  } = data || { listing: [] };

  const onCloseCallback = () => {
    onReturnToListings();
  };

  return (
    <Modal isOpen={id} onClose={onCloseCallback}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Listing</ModalHeader>
        <ModalCloseButton />
        {listing && (
          <ModalBody>
            <Grid templateColumns="2fr 3fr">
              <Text as="b">Name</Text>
              <Text>{listing.name}</Text>
              <Text as="b">Price</Text>
              <Text>{listing.price}</Text>
              <Text as="b">Sold</Text>
              <Text>{listing.sold ? 'Yes' : 'No'}</Text>
              <Text as="b">Created At</Text>
              <Text>{listing.created_at}</Text>
            </Grid>
          </ModalBody>
        )}
      </ModalContent>
    </Modal>
  );
};

export default function ViewListings() {
  const [search, setSearch] = useState('');
  const [showSold, setShowSold] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const filterRef = useRef();
  const { data } = useQuery(GET_LISTINGS, {
    variables: { name: `%${search}%`, sold: showSold },
  });
  const { listing: listings } = data || { listing: [] };

  const history = useHistory();

  const handleListingClick = (id) => {
    history.push(`/listing/${id}`);
  };

  const handleReturnToListings = (id) => {
    history.push(`/listings`);
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
          <InputLeftElement
            children={<Icon name="search" color="gray.300" />}
          />
          <Input
            type="text"
            onChange={(value) => setSearch(value.target.value)}
            mr={3}
            placeholder="Search"
          />
          <IconButton
            ref={filterRef}
            onClick={onOpen}
            variantColor="teal"
            aria-label="Filters"
            icon={FaFilter}
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
                    <Icon name="check" size="16px" />
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
        <Flex
          w="100%"
          style={{ gap: '1rem' }}
          justifyContent="space-between"
          alignItems="center"
          direction="column"
          overflow="auto"
        >
          {listings.map((listing) => (
            <Listing {...listing} onClick={(_, id) => handleListingClick(id)} />
          ))}
        </Flex>
      </Flex>
    </Flex>
  );
}
