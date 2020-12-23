import React from 'react';
import { Flex, Tag, Text } from '@chakra-ui/react';

export default ({ onClick, id, name, price, sold }) => {
  return (
    <Flex
      w="100%"
      p={3}
      minH={90}
      borderWidth="1px"
      rounded="lg"
      overflow="hidden"
      cursor="pointer"
      onClick={(ev) => onClick(ev, id)}
    >
      <Flex w="100%" justifyContent="space-between" alignItems="center">
        <Text fontWeight="800">{name}</Text>
        <Flex height="100%" alignItems="center">
          <Tag colorScheme="yellow" mr={3}>
            {price} STK
          </Tag>
          <Tag colorScheme="cyan">{sold ? 'Sold' : 'For Sale'}</Tag>
        </Flex>
      </Flex>
    </Flex>
  );
};
