import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { gql, useQuery } from '@apollo/client';
import PropTypes from 'prop-types';
import Select from 'react-select';
import { Button, Flex, Text, Image } from '@chakra-ui/core';
import hubbahubba from './hubbahubba.jpg';

const GET_USERS = gql`
  query {
    user {
      id
      full_name
      email
      created_at
      avatar
      auth0_id
    }
  }
`;

export default function StackLogin({ setAccessToken }) {
  const { data } = useQuery(GET_USERS);
  const { user } = data || { user: [] };
  const [selected, setSelected] = useState();
  const history = useHistory();

  const handlePop = async () => {
    const iat = Math.floor(new Date().getTime() / 1000);
    const response = await fetch(
      `${process.env.REACT_APP_JWT_SIGN_URL}?sub=stackmarket&iat=${iat}&allowed_roles=user&default_role=user&user_id=${selected.value}&user_id_internal=${selected.value}`
    );
    const token = await response.text();
    setAccessToken(token);
    window.localStorage.setItem('badtoken', token);
    history.push('dashboard');
  };

  return (
    <Flex w="100%" h="100vh" justifyContent="center" alignItems="center">
      <Flex
        w="40rem"
        direction="column"
        justifyContent="space-around"
        alignItems="center"
      >
        <img src={hubbahubba}></img>
        <Flex direction="column">
          <Flex>
            <Text
              display="inline-flex"
              fontSize="xl"
              fontFamily="'Times New Roman', Times, serif;"
            >
              😳😳
            </Text>
            <Text fontSize="md">
              You're <b>not</b> supposed to be here! Just take a user and get
              OUT OF MY ROOM!!!
            </Text>
          </Flex>
          <Flex mb={2} flex={1} direction="column">
            <Select
              placeholder="Select a development user..."
              onChange={setSelected}
              options={user.map(({ id, full_name, avatar }) => ({
                value: id,
                label: (
                  <Flex lineHeight="2rem" direction="row">
                    <Image
                      rounded="full"
                      size="2rem"
                      marginRight={1}
                      src={avatar}
                      alt="User Profile"
                    />
                    {full_name}
                  </Flex>
                ),
              }))}
            />
          </Flex>
          <Button onClick={handlePop}>Pop</Button>
        </Flex>
      </Flex>
    </Flex>
  );
}

StackLogin.propTypes = {
  setAccessToken: PropTypes.func,
};
