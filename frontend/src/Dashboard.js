import React from 'react';
import { useAuth0 } from "@auth0/auth0-react";

export default function Dashboard() {
  const { isAuthenticated, getAccessTokenSilently, isLoading, ...props } = useAuth0();
  console.log(props)
  return `Welcome back ${isAuthenticated}`
}
