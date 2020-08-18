import React from 'react';
import { useAuth0 } from "@auth0/auth0-react";

export default function Dashboard() {
  const value = useAuth0();
  console.log(value.getAccessTokenSilently())
  return `Welcome back ${value.isAuthenticated}`
}
