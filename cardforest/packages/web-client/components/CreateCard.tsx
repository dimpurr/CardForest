import { useState } from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';
import { useSession } from 'next-auth/react';
import { useJWT } from '../hooks/useJWT';
import { Button } from './ui/Button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/Select';
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
import { CardEditor } from './CardEditor';
import { GET_TEMPLATES } from '../graphql/queries';

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
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [cardData, setCardData] = useState<any>(null);
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
        setSelectedTemplate('');
        setCardData(null);
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

    if (!selectedTemplate || !cardData?.title) {
      setError('Template and title are required');
      return;
    }

    setError(null);
    await createCard({
      variables: {
        input: {
          title: cardData.title.trim(),
          content: cardData.content?.trim() || '',
          body: cardData.body?.trim() || '',
          templateId: selectedTemplate,
          meta: cardData.meta || {},
        },
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create Card</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Card</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {error && (
            <Alert variant="destructive" className="mb-4">
              {error}
            </Alert>
          )}
          {success && (
            <Alert className="mb-4">
              Card created successfully!
            </Alert>
          )}
          
          {/* Template Selection */}
          <div>
            <label className="block text-sm font-medium mb-1">Template</label>
            <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
              <SelectTrigger>
                <SelectValue placeholder="Select a template" />
              </SelectTrigger>
              <SelectContent>
                {templatesData?.templates.map((template: any) => (
                  <SelectItem key={template._key} value={template._key}>
                    {template.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Card Editor */}
          {selectedTemplate && (
            <CardEditor
              templateId={selectedTemplate}
              onChange={setCardData}
            />
          )}
        </div>
        <DialogFooter>
          <Button
            onClick={handleSubmit}
            disabled={loading || !selectedTemplate || !cardData?.title}
          >
            {loading ? 'Creating...' : 'Create'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
