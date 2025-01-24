import { useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from './ui/Dialog';
import { Button } from './ui/Button';
import { GET_TEMPLATES } from '../graphql/queries';
import { Template } from '../types/template';
import { TemplateCard } from './template/TemplateCard';

export function CreateCard({ onCardCreated }: { onCardCreated?: () => void }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);

  const { data: templatesData, loading: templatesLoading } = useQuery(GET_TEMPLATES);
  const templates = templatesData?.templates || [];

  const handleCreateCard = (template: Template) => {
    setOpen(false);
    const templateId = template._key.replace('templates/', '');
    router.push(`/cards/new?templateId=${templateId}`);
    onCardCreated?.();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setOpen(true)}>Create Card</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Card</DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <h4 className="text-sm font-medium mb-3">Template</h4>
          {templatesLoading ? (
            <div>Loading templates...</div>
          ) : (
            <div className="grid gap-4">
              {templates.map((template: Template) => (
                <TemplateCard
                  key={template._key}
                  template={template}
                  isSelected={selectedTemplate?._key === template._key}
                  onClick={() => setSelectedTemplate(template)}
                />
              ))}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            onClick={() => selectedTemplate && handleCreateCard(selectedTemplate)}
            disabled={!selectedTemplate}
          >
            Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
