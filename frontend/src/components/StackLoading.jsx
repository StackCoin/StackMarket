import React from 'react';
import Stack from './../stack.png';
import { Flex } from '@chakra-ui/react';

export default ({ height = '100vh' }) => (
  <Flex
    width="100%"
    height={height}
    justifyContent="center"
    alignItems="center"
  >
    <img alt="stk" src={Stack} width="40" height="40" />
  </Flex>
);
