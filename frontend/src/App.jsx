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
import { ThemeProvider, CSSReset, Flex } from '@chakra-ui/core';
import {
  Dashboard,
  Listings,
  StackLogin,
  Listing,
  Landing,
  Store,
} from './pages';
import Stack from './stack.png';

export const isDevAdmin = !!process.env.REACT_APP_HASURA_ADMIN_SECRET;

function Routing({ setAccessToken }) {
  const { isLoading, error } = useAuth();

  if (error) {
    return (
      <Flex alignItems="center" justifyContent="center">
        FUCK@!!! Ireally screwed up man, and Im sorry... Please please please
        forgive me.... IM SORRY I said Im sorry man!!!!
        <br />
        {error.message}
      </Flex>
    );
  }

  if (isLoading) {
    return (
      <Flex
        width="100%"
        height="100vh"
        justifyContent="center"
        alignItems="center"
      >
        <img alt="stk" src={Stack} width="40" height="40" />
      </Flex>
    );
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

  if (process.env.REACT_APP_HASURA_ADMIN_SECRET !== null && !badToken) {
    return {
      'x-hasura-admin-secret': process.env.REACT_APP_HASURA_ADMIN_SECRET,
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
    uri: process.env.REACT_APP_API_URL,
    options: {
      reconnect: true,
    },
    headers,
  });

  const ws = new WebSocketLink({
    uri: process.env.REACT_APP_API_WS_URL,
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
    <ThemeProvider>
      <Auth0Provider
        domain={process.env.REACT_APP_AUTH0_DOMAIN}
        clientId={process.env.REACT_APP_AUTH0_CLIENT_ID}
        redirectUri={`${process.env.REACT_APP_URL}/dashboard`}
        audience={process.env.REACT_APP_AUTH0_AUDIENCE}
        scope="read:current_user update:current_user_metadata"
      >
        <ApolloAuth accessToken={accessToken} setAccessToken={setAccessToken}>
          <CSSReset />
          <Routing setAccessToken={setAccessToken} />
        </ApolloAuth>
      </Auth0Provider>
    </ThemeProvider>
  );
}

export default App;
