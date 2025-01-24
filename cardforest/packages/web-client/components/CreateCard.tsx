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

  const { data: session } = useSession();
  const jwt = useJWT();

  const { data: templatesData, loading: templatesLoading } = useQuery(GET_TEMPLATES);

  const [createCard, { loading }] = useMutation(CREATE_CARD, {
    onCompleted: () => {
      setTitle('');
      setContent('');
      setSelectedTemplate('');
      setOpen(false);
      if (onCardCreated) {
        onCardCreated();
      }
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
          meta: {}, // Empty meta object for now, can be extended based on template requirements
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
            <div className="text-sm text-red-500 mb-4">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <label
              htmlFor="template"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Template
            </label>
            <select
              id="template"
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">Select a template</option>
              {templatesData?.templates.map((template: any) => (
                <option key={template._key} value={template._key}>
                  {template.name}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label
              htmlFor="title"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Title
            </label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter card title"
              error={error && !title.trim()}
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="content"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Content
            </label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter card content"
              error={error && !content.trim()}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="secondary"
            onClick={() => setOpen(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={loading || templatesLoading || !session}
          >
            {loading ? 'Creating...' : 'Create'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
