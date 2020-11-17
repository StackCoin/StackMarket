import React from 'react';
import { useHistory } from 'react-router-dom';
import { Code, Box, Button, Flex, Text, Heading } from '@chakra-ui/core';
import { useAuth } from '../hooks';

export default function LandingPage() {
  const { loginWithRedirect } = useAuth();

  const history = useHistory();
  const handleShopClick = () => {
    history.push('listings');
  };

  return (
    <Flex w="100%" h="100vh" justifyContent="center" alignItems="center">
      <Flex
        w="50rem"
        direction="column"
        justifyContent="space-around"
        alignItems="center"
      >
        <Flex
          w="100%"
          px={5}
          py={4}
          justifyContent="space-between"
          alignItems="center"
        >
          <Text fontSize="xl" fontWeight="900" as="em">
            stackmarket
          </Text>
          <Button size="sm" onClick={() => loginWithRedirect()}>
            Log In
          </Button>
        </Flex>
        <Flex
          w="100%"
          px={5}
          py={4}
          justifyContent="space-between"
          alignItems="center"
        >
          <Box p={6}>
            <Heading as="h1">
              The World's Largest
              <br /> Pseudo Currency Marketplace
            </Heading>
          </Box>
          <Button variantColor="yellow" onClick={handleShopClick}>
            Shop Now
          </Button>
        </Flex>
        <Flex
          w="100%"
          px={5}
          py={4}
          justifyContent="center"
          alignItems="center"
        >
          <Box
            maxW="sm"
            w={200}
            p={15}
            bg="gray.100"
            rounded="lg"
            overflow="hidden"
          >
            <Text as="em" fontWeight="900" fontSize="20px">
              i hate it.
            </Text>
            <br />
            <Code fontSize="10px">- stack</Code>
          </Box>
        </Flex>
      </Flex>
    </Flex>
  );
}
