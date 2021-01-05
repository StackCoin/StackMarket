import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './App.css';
import { useAuth } from './hooks';
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import {
  ApolloClient,
  split,
  HttpLink,
  InMemoryCache,
  ApolloProvider,
} from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';
import {
  ChakraProvider,
  Code,
  Image,
  Tooltip,
  Text,
  Flex,
} from '@chakra-ui/react';
import {
  Dashboard,
  Listings,
  StackLogin,
  Listing,
  Landing,
  Store,
} from './pages';
import StackLoading from './components/StackLoading';
import Flushed from './stack_flushed.png';
import copy from 'copy-to-clipboard';

function Routing({ setAccessToken }) {
  const { isLoading, error } = useAuth();
  const isDevAdmin = !!window.__env__.REACT_APP_HASURA_ADMIN_SECRET;

  if (error) {
    return (
      <Flex justifyContent="center" flexWrap="wrap">
        <Image w={400} src={Flushed} />
        <Flex direction="column" justifyContent="center" w={400}>
          <Text fontSize="3xl" fontWeight="bold">
            Oppsie Woopsie!
          </Text>
          <Text>
            Looks like we hit a widde ewwor! Send this to one of our code
            monkeys and we will work vewy hawd to fix it!
          </Text>
          <Tooltip label="Click to Copy" placement="bottom" defaultIsOpen>
            <Code onMouseUp={() => copy(JSON.stringify(error))}>
              {JSON.stringify(error)}
            </Code>
          </Tooltip>
        </Flex>
      </Flex>
    );
  }

  if (isLoading) {
    return <StackLoading />;
  }

  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Landing />
        </Route>
        <Route exact path="/dashboard">
          <Dashboard />
        </Route>
        <Route path="/listings/">
          <Listings />
        </Route>
        <Route path="/listing/:id?">
          <Listing />
        </Route>
        <Route path="/store/:id">
          <Store />
        </Route>
        {isDevAdmin && (
          <Route path="/stacks">
            <StackLogin setAccessToken={setAccessToken} />
          </Route>
        )}
      </Switch>
    </Router>
  );
}

Routing.propTypes = {
  setAccessToken: PropTypes.func.isRequired,
};

function getAuthHeaders(isAuthenticated, accessToken, badToken) {
  if (isAuthenticated) {
    return { Authorization: `Bearer ${accessToken}` };
  }

  if (window.__env__.REACT_APP_HASURA_ADMIN_SECRET && !badToken) {
    return {
      'x-hasura-admin-secret': window.__env__.REACT_APP_HASURA_ADMIN_SECRET,
    };
  }

  return { Authorization: `Bearer ${badToken}` };
}

function ApolloAuth({ children, accessToken, setAccessToken }) {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();

  // TODO: Replace with something more sensible:
  // https://github.com/apollographql/apollo-client/issues/2441
  useEffect(() => {
    if (isAuthenticated) {
      (async () => setAccessToken(await getAccessTokenSilently()))();
    }
  }, [isAuthenticated, getAccessTokenSilently]);

  const badToken = window.localStorage.getItem('badtoken');
  const headers = getAuthHeaders(isAuthenticated, accessToken, badToken);

  const http = new HttpLink({
    uri: window.__env__.REACT_APP_API_URL,
    options: {
      reconnect: true,
    },
    headers,
  });

  const ws = new WebSocketLink({
    uri: window.__env__.REACT_APP_API_WS_URL,
    options: {
      reconnect: true,
      connectionParams: {
        headers,
      },
    },
  });

  const errorHandling = onError((apolloErrors) => {
    // eslint-disable-next-line no-console
    console.error(apolloErrors);
  });

  const apolloClient = new ApolloClient({
    link: split(
      ({ query }) => {
        const definition = getMainDefinition(query);
        return (
          definition.kind === 'OperationDefinition' &&
          definition.operation === 'subscription'
        );
      },
      errorHandling.concat(ws),
      errorHandling.concat(http)
    ),
    cache: new InMemoryCache(),
  });

  return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>;
}

ApolloAuth.propTypes = {
  children: PropTypes.node.isRequired,
  accessToken: PropTypes.string.isRequired,
  setAccessToken: PropTypes.func.isRequired,
};

function App() {
  const [accessToken, setAccessToken] = useState('');
  return (
    <Auth0Provider
      domain={window.__env__.REACT_APP_AUTH0_DOMAIN}
      clientId={window.__env__.REACT_APP_AUTH0_CLIENT_ID}
      redirectUri={`${window.__env__.REACT_APP_URL}/dashboard`}
      audience={window.__env__.REACT_APP_AUTH0_AUDIENCE}
      scope="read:current_user update:current_user_metadata"
    >
      <ApolloAuth accessToken={accessToken} setAccessToken={setAccessToken}>
        <ChakraProvider>
          <Routing setAccessToken={setAccessToken} />
        </ChakraProvider>
      </ApolloAuth>
    </Auth0Provider>
  );
}

export default App;
