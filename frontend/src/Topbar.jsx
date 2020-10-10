import React from 'react';
import { Button, Flex, Text } from '@chakra-ui/core';
import { useHistory } from 'react-router-dom';
import { useAuth } from './hooks';
import UserDisplay from './UserDisplay';
import { isDevAdmin } from './App';

function LoginButton() {
  const { loginWithRedirect } = useAuth();
  return (
    <Button size="sm" onClick={() => loginWithRedirect()}>
      Log In
    </Button>
  );
}

export default () => {
  const { isAuthenticated, user, logout } = useAuth();
  const history = useHistory();

  if (isDevAdmin && !isAuthenticated) {
    history.push('/stacks');
  }

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
        <Button mr={3} variantColor="yellow">
          All Listings
        </Button>
        {isAuthenticated ? (
          <UserDisplay user={user} logout={logout} />
        ) : (
          <LoginButton />
        )}
      </Flex>
    </Flex>
  );
};
