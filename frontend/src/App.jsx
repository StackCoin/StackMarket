import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './App.css';
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
import Dashboard from './Dashboard';
import Store from './StoreView';
import StackLogin from './StackLogin';
import LandingPage from './LandingPage';
import Listings from './Listings';
import Stack from './stack.png';

export const isDevAdmin = !!process.env.REACT_APP_HASURA_ADMIN_SECRET;

function Routing() {
  const { isLoading, error } = useAuth0();

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
          <LandingPage />
        </Route>
        <Route exact path="/dashboard">
          <Dashboard />
        </Route>
        <Route path="/listings/:id?">
          <Listings />
        </Route>
        <Route path="/store/:id">
          <Store />
        </Route>
        {isDevAdmin && (
          <Route path="/stacks">
            <StackLogin />
          </Route>
        )}
      </Switch>
    </Router>
  );
}

function ApolloAuth({ children }) {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [accessToken, setAccessToken] = useState('');

  // TODO: Replace with something more sensible:
  // https://github.com/apollographql/apollo-client/issues/2441
  useEffect(() => {
    if (isAuthenticated) {
      (async () => setAccessToken(await getAccessTokenSilently()))();
    }
  }, [isAuthenticated, getAccessTokenSilently]);

  const headers = isAuthenticated
    ? { Authorization: `Bearer ${accessToken}` }
    : process.env.REACT_APP_HASURA_ADMIN_SECRET !== null
    ? { 'x-hasura-admin-secret': process.env.REACT_APP_HASURA_ADMIN_SECRET }
    : {};

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
};

function App() {
  return (
    <ThemeProvider>
      <Auth0Provider
        domain={process.env.REACT_APP_AUTH0_DOMAIN}
        clientId={process.env.REACT_APP_AUTH0_CLIENT_ID}
        redirectUri={`${process.env.REACT_APP_URL}/dashboard`}
        audience={process.env.REACT_APP_AUTH0_AUDIENCE}
        scope="read:current_user update:current_user_metadata"
      >
        <ApolloAuth>
          <CSSReset />
          <Routing />
        </ApolloAuth>
      </Auth0Provider>
    </ThemeProvider>
  );
}

export default App;
