import { useAuth0 } from '@auth0/auth0-react';
import { gql, useQuery } from '@apollo/client';

export const logout = () => {
  window.localStorage.removeItem('badtoken');
  window.location.href = '/';
};

const CURRENT_USER = gql`
  query {
    user_current {
      auth0_id
      avatar
      created_at
      full_name
      email
      id
    }
  }
`;

// eslint-disable-next-line import/prefer-default-export
export const useAuth = () => {
  const isDevAdmin = !!window.__env__.REACT_APP_HASURA_ADMIN_SECRET;
  const auth = useAuth0();
  const badToken = window.localStorage.getItem('badtoken');
  const badAuth = {
    isLoading: true,
    isBadAuth: true,
    isAuthenticated: badToken,
    loginWithRedirect: () => {
      window.location.href = '/stacks';
    },
    logout,
  };

  const { data, loading } = useQuery(CURRENT_USER);
  const { avatar: picture, ...user } = data?.user_current[0] || { avatar: '' };

  if (isDevAdmin) {
    return { ...badAuth, isLoading: loading, user: { picture, ...user } };
  }

  return auth;
};
