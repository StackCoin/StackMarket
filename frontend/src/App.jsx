import React, { useState, useEffect } from 'react';
import './App.css';
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react';
import {
  BrowserRouter as Router,
  useHistory,
  Route,
  Switch,
} from 'react-router-dom';
import {
  gql,
  useQuery,
  ApolloClient,
  split,
  HttpLink,
  InMemoryCache,
  ApolloProvider,
  createApolloClient,
} from '@apollo/client';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';
import { ThemeProvider, CSSReset, Flex } from '@chakra-ui/core';
import Dashboard from './Dashboard';
import LandingPage from './LandingPage';
import Listings from './Listings';
import Stack from './stack.png';

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
        <img src={Stack} width="40" height="40" />
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
      </Switch>
    </Router>
  );
}

function ApolloAuth({ children }) {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [accessToken, setAccessToken] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      (async () => setAccessToken(await getAccessTokenSilently()))();
    }
  }, [isAuthenticated, getAccessTokenSilently]);

  const headers = isAuthenticated
    ? {
        Authorization: `Bearer ${accessToken}`,
      }
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

  const apolloClient = new ApolloClient({
    link: split(
      ({ query }) => {
        const definition = getMainDefinition(query);
        return (
          definition.kind === 'OperationDefinition' &&
          definition.operation === 'subscription'
        );
      },
      ws,
      http
    ),
    cache: new InMemoryCache(),
  });

  return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>;
}

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
