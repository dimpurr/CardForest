import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { 
  EllipsisVerticalIcon, 
  PencilIcon, 
  TrashIcon, 
  DocumentPlusIcon,
  ArrowTopRightOnSquareIcon
} from '@heroicons/react/24/outline';
import { useRouter } from 'next/router';
import { Model } from '@/atoms/modelAtoms';
import { routes } from '@/config/routes';

interface ModelMenuProps {
  model: Model;
  onDelete?: (model: Model) => void;
  onCreateCard?: (model: Model) => void;
}

export function ModelMenu({ model, onDelete, onCreateCard }: ModelMenuProps) {
  const router = useRouter();

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(routes.models.edit(model._key));
  };

  const handleView = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(routes.models.view(model._key));
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(model);
    }
  };

  const handleCreateCard = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onCreateCard) {
      onCreateCard(model);
    } else {
      router.push(`/cards/new?modelId=${model._key}`);
    }
  };

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button 
          className="flex items-center rounded-full p-1 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          onClick={(e) => e.stopPropagation()}
        >
          <span className="sr-only">Open options</span>
          <EllipsisVerticalIcon className="h-5 w-5" aria-hidden="true" />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={handleView}
                  className={`${
                    active ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'
                  } flex w-full items-center px-4 py-2 text-sm`}
                >
                  <ArrowTopRightOnSquareIcon className="mr-3 h-5 w-5" aria-hidden="true" />
                  View Details
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={handleEdit}
                  className={`${
                    active ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'
                  } flex w-full items-center px-4 py-2 text-sm`}
                >
                  <PencilIcon className="mr-3 h-5 w-5" aria-hidden="true" />
                  Edit
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={handleCreateCard}
                  className={`${
                    active ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'
                  } flex w-full items-center px-4 py-2 text-sm`}
                >
                  <DocumentPlusIcon className="mr-3 h-5 w-5" aria-hidden="true" />
                  Create Card
                </button>
              )}
            </Menu.Item>
            {onDelete && !model.system && (
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={handleDelete}
                    className={`${
                      active ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'
                    } flex w-full items-center px-4 py-2 text-sm text-red-600 dark:text-red-400`}
                  >
                    <TrashIcon className="mr-3 h-5 w-5" aria-hidden="true" />
                    Delete
                  </button>
                )}
              </Menu.Item>
            )}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
