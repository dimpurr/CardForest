import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { UserIcon, ArrowRightOnRectangleIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/router';

export function UserMenu() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  if (!isAuthenticated) {
    return (
      <Link
        href="/auth/signin"
        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-900"
      >
        Sign in
      </Link>
    );
  }

  return (
    <Menu as="div" className="relative ml-3">
      <div>
        <Menu.Button className="flex items-center max-w-xs text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-900">
          <span className="sr-only">Open user menu</span>
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-600 dark:text-primary-300">
              {user?.username?.charAt(0).toUpperCase() || <UserIcon className="h-5 w-5" />}
            </div>
            <span className="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-300">
              {user?.username || 'User'}
            </span>
          </div>
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
        <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white dark:bg-gray-800 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
            <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.username}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
          </div>
          
          <Menu.Item>
            {({ active }) => (
              <Link
                href="/profile"
                className={`${
                  active ? 'bg-gray-100 dark:bg-gray-700' : ''
                } block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 w-full text-left`}
              >
                <div className="flex items-center">
                  <UserIcon className="mr-3 h-4 w-4" />
                  Profile
                </div>
              </Link>
            )}
          </Menu.Item>
          
          <Menu.Item>
            {({ active }) => (
              <Link
                href="/settings"
                className={`${
                  active ? 'bg-gray-100 dark:bg-gray-700' : ''
                } block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 w-full text-left`}
              >
                <div className="flex items-center">
                  <Cog6ToothIcon className="mr-3 h-4 w-4" />
                  Settings
                </div>
              </Link>
            )}
          </Menu.Item>
          
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={handleLogout}
                className={`${
                  active ? 'bg-gray-100 dark:bg-gray-700' : ''
                } block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 w-full text-left`}
              >
                <div className="flex items-center">
                  <ArrowRightOnRectangleIcon className="mr-3 h-4 w-4" />
                  Sign out
                </div>
              </button>
            )}
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
