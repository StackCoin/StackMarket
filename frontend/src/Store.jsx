import React from 'react';
import { Flex } from '@chakra-ui/core';

export default ({ id, name }) => {
  return (
    <Flex p={4} mb={4} minW="sm" borderWidth="1px" rounded="lg" overflow="hidden">
      {name}
    </Flex>
  );
};
