import React from 'react';
import { Button, Flex, Text } from '@chakra-ui/core';
import { useAuth0 } from '@auth0/auth0-react';
import UserDisplay from './UserDisplay';
import {
  useHistory,
} from 'react-router-dom';

function LoginButton() {
  const { loginWithRedirect } = useAuth0();
  return <Button size="sm" onClick={() => loginWithRedirect()}>Log In</Button>;
}

export default () => {
  const { isAuthenticated, user, logout } = useAuth0();
  return (
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
      <Flex>
        <Button mr={3} variantColor="yellow">All Listings</Button>
        {isAuthenticated ? <UserDisplay user={user} logout={logout} /> : <LoginButton />}
      </Flex>
    </Flex>
  );
};
