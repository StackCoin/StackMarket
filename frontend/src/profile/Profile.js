import React from 'react';
import logo from './logo.svg';
import './App.css';
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { gql } from '@apollo/client';
import { Auth0Provider } from "@auth0/auth0-react";
import { useAuth0 } from "@auth0/auth0-react";

import { createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';


const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
    }
  }
});

const httpLink = createHttpLink({
  uri: process.env.REACT_APP_API_URL,
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});

client
  .query({
    query: gql`
      query Users {
        user {
          id,
          full_name,
        }
      }
    `
  })
  .then(result => console.log(result));

function LoginButton() {
  const { loginWithRedirect } = useAuth0();

  return <button onClick={() => loginWithRedirect()}>Log In</button>;
}

function App() {
  return (
    <Auth0Provider
      domain={process.env.REACT_APP_AUTH0_DOMAIN}
      clientId={process.env.REACT_APP_AUTH0_CLIENT_ID}
      redirectUri={window.location.origin}
      onRedirectCallback={() => console.log("Hello world")}
      audience={process.env.REACT_APP_AUTH0_AUDIENCE}
    >
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <LoginButton/>
        </header>
      </div>
    </Auth0Provider>
  );
}

export default App;
