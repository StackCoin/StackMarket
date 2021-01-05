import React from 'react';
import {
  Grid,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Image,
  Button,
  Text,
} from '@chakra-ui/react';

export default function UserDisplay({ user, logout }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Button p={2} variant="ghost" onClick={onOpen}>
      <Image
        rounded="full"
        size="2rem"
        height="100%"
        marginRight={1}
        src={user.picture}
        alt="User Profile"
      />
      {user.name}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Your Profile</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Image size="2rem" mb={4} src={user.picture} alt="User Profile" />
            <Grid templateColumns="2fr 3fr">
              <Text as="b">Name</Text>
              <Text> {user.name}</Text>
              <Text as="b">Email</Text>
              <Text>{user.email}</Text>
              <Text as="b">Email Verified?</Text>
              <Text>{user.email_verified ? 'Yes' : 'No'}</Text>
            </Grid>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="red" mr={5} onClick={logout}>
              Logout
            </Button>
            <Button colorScheme="yellow" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Button>
  );
}
