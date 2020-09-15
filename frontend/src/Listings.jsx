import React from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import {
  Grid,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Button,
  Flex,
  Text,
} from '@chakra-ui/core';
import { gql, useQuery } from '@apollo/client';
import Listing from './Listing';

function LoginButton() {
  const { loginWithRedirect } = useAuth0();
  return (
    <Button size="sm" onClick={() => loginWithRedirect()}>
      Log In
    </Button>
  );
}

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
  query MyQuery {
    listing(where: { sold: { _eq: false } }) {
      id
      name
      price
      sold
      created_at
      store {
        name
      }
    }
  }
`;

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
  const { id: viewingListing } = useParams();
  const { data } = useQuery(GET_LISTINGS);
  const { listing: listings } = data || { listing: [] };

  const history = useHistory();
  const handleShopClick = () => {
    history.push('dashboard');
  };

  const handleListingClick = (id) => {
    if (!viewingListing) {
      history.push(`/listings/${id}`);
    }
  };

  const handleReturnToListings = (id) => {
    if (viewingListing) {
      history.push(`/listings`);
    }
  };

  return (
    <Flex
      w="100%"
      direction="column"
      justifyContent="space-around"
      alignItems="center"
    >
      <Flex
        w="100%"
        px={5}
        py={4}
        justifyContent="space-between"
        alignItems="center"
      >
        <Text fontSize="xl" fontWeight="900" as="em">
          stackmarket
        </Text>
        <LoginButton />
      </Flex>
      <Flex
        p={5}
        w="100%"
        justifyContent="space-between"
        alignItems="center"
        direction="column"
      >
        {listings.map((listing) => (
          <Listing {...listing} onClick={(ev, id) => handleListingClick(id)} />
        ))}
        <ListingView
          onReturnToListings={handleReturnToListings}
          id={viewingListing}
        />
      </Flex>
    </Flex>
  );
}
