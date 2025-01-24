import { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  VStack,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react';

const CREATE_CARD = gql`
  mutation CreateCard($input: CreateCardInput!) {
    createCard(input: $input) {
      _id
      title
      content
      createdAt
      createdBy {
        username
      }
    }
  }
`;

export default function CreateCard({ onCardCreated }: { onCardCreated?: () => void }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const toast = useToast();

  const [createCard, { loading }] = useMutation(CREATE_CARD, {
    onCompleted: () => {
      toast({
        title: 'Card created successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      setTitle('');
      setContent('');
      onClose();
      if (onCardCreated) {
        onCardCreated();
      }
    },
    onError: (error) => {
      toast({
        title: 'Error creating card',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    },
  });

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      toast({
        title: 'Error',
        description: 'Title and content are required',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    await createCard({
      variables: {
        input: {
          title: title.trim(),
          content: content.trim(),
        },
      },
    });
  };

  return (
    <>
      <Button colorScheme="blue" onClick={onOpen}>
        Create New Card
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create New Card</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Title</FormLabel>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter card title"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Content</FormLabel>
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Enter card content"
                  rows={4}
                />
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              onClick={handleSubmit}
              isLoading={loading}
            >
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
