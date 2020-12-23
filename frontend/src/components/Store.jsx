import React from 'react';
import { Button, AvatarGroup, Avatar, Tag, Text, Flex } from '@chakra-ui/react';
import { SettingsIcon } from '@chakra-ui/icons';

export default ({
  id,
  name,
  vendor,
  onClick,
  onEditClick,
  listing_aggregate: {
    aggregate: { count: listingCount },
  },
}) => {
  const stopPropOnEditDangerously = (event) => {
    event.stopPropagation();
    onEditClick(event);
  };
  return (
    <Flex
      as="div"
      role="button"
      tabIndex={0}
      p={4}
      onClick={onClick}
      minW="sm"
      direction="column"
      borderWidth="1px"
      rounded="lg"
      overflow="hidden"
    >
      <Flex mb={3} alignItems="center">
        <Tag mr={3} color="blue">
          STORE
        </Tag>
        <Text fontWeight="800">{name}</Text>
      </Flex>
      <Flex alignItems="end" justifyContent="space-between">
        {onEditClick && (
          <Button
            onClick={stopPropOnEditDangerously}
            leftIcon={<SettingsIcon />}
            colorScheme="teal"
            variant="outline"
            size="xs"
          >
            Edit
          </Button>
        )}
        <Flex h="48px">
          {vendor.length > 1 && (
            <AvatarGroup size="md" max={3}>
              {vendor.map(({ user }) => (
                <Avatar name={user.full_name} src={user.name} />
              ))}
            </AvatarGroup>
          )}
        </Flex>
        <Text fontSize="0.8em">
          {listingCount === 0
            ? 'No Listings'
            : `${listingCount} ${listingCount > 0 ? 'Listing' : 'Listings'}`}
        </Text>
      </Flex>
    </Flex>
  );
};
