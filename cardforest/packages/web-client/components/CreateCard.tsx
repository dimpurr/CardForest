import { useState } from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';
import { useSession } from 'next-auth/react';
import { useJWT } from '../hooks/useJWT';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Textarea } from './ui/Textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from './ui/Dialog';
import { Alert } from './ui/Alert';
import { useAtom } from 'jotai';
import { cardsAtom } from '../store/cards';

const GET_TEMPLATES = gql`
  query GetTemplates {
    templates {
      _id
      _key
      name
    }
  }
`;

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
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const { data: session } = useSession();
  const jwt = useJWT();
  const [cards, setCards] = useAtom(cardsAtom);

  const { data: templatesData, loading: templatesLoading } = useQuery(GET_TEMPLATES);

  const [createCard, { loading }] = useMutation(CREATE_CARD, {
    onCompleted: (data) => {
      setSuccess(true);
      // 更新 Jotai 状态
      setCards([data.createCard, ...cards]);
      setTimeout(() => {
        setTitle('');
        setContent('');
        setSelectedTemplate('');
        setOpen(false);
        setSuccess(false);
        if (onCardCreated) {
          onCardCreated();
        }
      }, 1500);
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  const handleSubmit = async () => {
    if (!session) {
      setError('Please sign in to create a card');
      return;
    }

    if (!title.trim() || !content.trim() || !selectedTemplate) {
      setError('Title, content and template are required');
      return;
    }

    setError(null);
    await createCard({
      variables: {
        input: {
          title: title.trim(),
          content: content.trim(),
          template: selectedTemplate,
          meta: {},
        },
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="primary">Create New Card</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Card</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {error && (
            <Alert variant="error">
              <Alert.Title>Error</Alert.Title>
              <Alert.Description>{error}</Alert.Description>
            </Alert>
          )}
          {success && (
            <Alert variant="success">
              <Alert.Title>Success!</Alert.Title>
              <Alert.Description>Card created successfully</Alert.Description>
            </Alert>
          )}
          <div className="space-y-2">
            <label className="text-sm font-medium">Template</label>
            {templatesLoading ? (
              <div>Loading templates...</div>
            ) : (
              <select
                className="w-full p-2 border rounded"
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value)}
              >
                <option value="">Select a template</option>
                {templatesData?.templates?.map((template: any) => (
                  <option key={template._key} value={template._key}>
                    {template.name}
                  </option>
                ))}
              </select>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Title</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter card title"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Content</label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter card content"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Creating...' : 'Create Card'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
