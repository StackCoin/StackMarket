import React from 'react';
import {
  useMediaQuery,
  Button,
  Menu,
  MenuItem,
  MenuButton,
  MenuList,
  Flex,
  IconButton,
  Text,
} from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';
import { Link, useHistory } from 'react-router-dom';
import { useAuth } from '../hooks';
import UserDisplay from './UserDisplay';

function LoginButton() {
  const { loginWithRedirect } = useAuth();
  return (
    <Button size="sm" onClick={() => loginWithRedirect()}>
      Log In
    </Button>
  );
}

export default () => {
  const [isLargerThan600] = useMediaQuery('(min-width: 600px)');
  const isDevAdmin = !!window.__env__.REACT_APP_HASURA_ADMIN_SECRET;

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
      <Link to="/listings">
        <Text fontSize="xl" fontWeight="900" as="em">
          stackmarket
        </Text>
      </Link>
      <Flex>
        {isLargerThan600 ? (
          <>
            <Button
              mr={3}
              onClick={() => history.push('/listings')}
              colorScheme="blue"
            >
              All Listings
            </Button>
            {isAuthenticated ? (
              <>
                <Button
                  mr={3}
                  onClick={() => history.push('/dashboard')}
                  colorScheme="yellow"
                >
                  Your Dashboard
                </Button>
                <UserDisplay user={user} logout={logout} />
              </>
            ) : (
              <LoginButton />
            )}
          </>
        ) : (
          <Menu>
            <MenuButton as={IconButton} icon={<HamburgerIcon />}></MenuButton>
            <MenuList>
              <UserDisplay user={user} logout={logout} />
              <MenuItem>All Listing</MenuItem>
              <MenuItem onClick={() => history.push('/dashboard')}>
                Your Dashboard
              </MenuItem>
            </MenuList>
          </Menu>
        )}
      </Flex>
    </Flex>
  );
};
