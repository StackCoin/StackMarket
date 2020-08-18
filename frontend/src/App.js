import React from 'react';
import logo from './logo.svg';
import './App.css';
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { gql } from '@apollo/client';
import { Auth0Provider } from "@auth0/auth0-react";
import { useAuth0 } from "@auth0/auth0-react";
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Dashboard from './Dashboard';

function LoginButton() {
  const { loginWithRedirect } = useAuth0();
  return <button onClick={() => loginWithRedirect()}>Log In</button>;
}

function App() {
  return (
    <Auth0Provider
      domain={process.env.REACT_APP_AUTH0_DOMAIN}
      clientId={process.env.REACT_APP_AUTH0_CLIENT_ID}
      redirectUri={`${process.env.REACT_APP_URL}/dashboard`}
      onRedirectCallback={() => console.log("Hello world")}
      audience={process.env.REACT_APP_AUTH0_AUDIENCE}
    >
      <Router>
        <Switch>
          <Route exact path="/">
            <div className="App">
              <header className="App-header">
                <LoginButton/>
              </header>
            </div>
          </Route>
          <Route exact path="/dashboard">
            <Dashboard/>
          </Route>
        </Switch>
      </Router>
    </Auth0Provider>
  );
}

export default App;
