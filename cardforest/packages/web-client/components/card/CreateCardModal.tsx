import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/client';
import { GET_MODELS } from '@/graphql/queries/modelQueries';
import { ModelCard } from '@/components/model/ModelCard';
import { Button } from '@/components/ui/Button';
import { SearchInput } from '@/components/ui/SearchInput';
import { PageState } from '@/components/ui/PageState';
import { Model } from '@/atoms/modelAtoms';

interface CreateCardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateCardModal({ isOpen, onClose }: CreateCardModalProps) {
  const router = useRouter();
  const [selectedModelId, setSelectedModelId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const { data, loading, error } = useQuery(GET_MODELS, {
    skip: !isOpen,
  });

  // 当模态框关闭时重置状态
  useEffect(() => {
    if (!isOpen) {
      setSelectedModelId(null);
      setSearchQuery('');
    }
  }, [isOpen]);

  const handleModelSelect = (model: Model) => {
    setSelectedModelId(model._id);
  };

  const handleCreateCard = () => {
    if (selectedModelId) {
      const modelKey = selectedModelId.replace('models/', '');
      router.push(`/cards/new?modelId=${modelKey}`);
      onClose();
    }
  };

  // 过滤模型
  const filteredModels = data?.models?.filter((model: Model) => {
    if (!searchQuery) return true;
    return model.name.toLowerCase().includes(searchQuery.toLowerCase());
  }) || [];

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-3xl sm:p-6">
                <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                  <button
                    type="button"
                    className="rounded-md bg-white dark:bg-gray-800 text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                    onClick={onClose}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                
                <div>
                  <div className="mt-3 text-center sm:mt-0 sm:text-left">
                    <Dialog.Title as="h3" className="text-xl font-semibold leading-6 text-gray-900 dark:text-white">
                      Create New Card
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Select a model to create a new card. The model determines the fields and structure of your card.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <SearchInput
                    placeholder="Search models..."
                    value={searchQuery}
                    onChange={setSearchQuery}
                    className="mb-4"
                  />
                  
                  <div className="max-h-96 overflow-y-auto p-1">
                    <PageState
                      loading={loading}
                      error={error}
                      empty={filteredModels.length === 0}
                      emptyMessage="No models found. Try a different search term."
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filteredModels.map((model: Model) => (
                          <ModelCard
                            key={model._id}
                            model={model}
                            isSelected={selectedModelId === model._id}
                            onClick={() => handleModelSelect(model)}
                          />
                        ))}
                      </div>
                    </PageState>
                  </div>
                </div>

                <div className="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse">
                  <Button
                    variant="primary"
                    onClick={handleCreateCard}
                    disabled={!selectedModelId}
                    className="w-full sm:w-auto sm:ml-3"
                  >
                    Create Card
                  </Button>
                  <Button
                    variant="outline"
                    onClick={onClose}
                    className="mt-3 w-full sm:mt-0 sm:w-auto"
                  >
                    Cancel
                  </Button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
