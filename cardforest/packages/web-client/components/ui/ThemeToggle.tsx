import { Fragment } from 'react';
import { SunIcon, MoonIcon, ComputerDesktopIcon } from '@heroicons/react/24/outline';
import { Menu, Transition } from '@headlessui/react';
import { useTheme } from '@/hooks/useTheme';

export function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme();

  // 获取当前主题图标
  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return <SunIcon className="h-5 w-5" />;
      case 'dark':
        return <MoonIcon className="h-5 w-5" />;
      case 'system':
        return <ComputerDesktopIcon className="h-5 w-5" />;
    }
  };

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button
          className="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-900"
          aria-label="Change theme"
        >
          {getThemeIcon()}
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
        <Menu.Items className="absolute right-0 z-10 mt-2 w-36 origin-top-right rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={() => setTheme('light')}
                  className={`${
                    active ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'
                  } flex w-full items-center px-4 py-2 text-sm`}
                >
                  <SunIcon className="mr-3 h-5 w-5" aria-hidden="true" />
                  Light
                  {theme === 'light' && (
                    <span className="ml-auto text-primary-500 dark:text-primary-400">✓</span>
                  )}
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={() => setTheme('dark')}
                  className={`${
                    active ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'
                  } flex w-full items-center px-4 py-2 text-sm`}
                >
                  <MoonIcon className="mr-3 h-5 w-5" aria-hidden="true" />
                  Dark
                  {theme === 'dark' && (
                    <span className="ml-auto text-primary-500 dark:text-primary-400">✓</span>
                  )}
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={() => setTheme('system')}
                  className={`${
                    active ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'
                  } flex w-full items-center px-4 py-2 text-sm`}
                >
                  <ComputerDesktopIcon className="mr-3 h-5 w-5" aria-hidden="true" />
                  System
                  {theme === 'system' && (
                    <span className="ml-auto text-primary-500 dark:text-primary-400">✓</span>
                  )}
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
