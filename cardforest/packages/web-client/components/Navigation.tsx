import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
import { navItems, routes } from '@/config/routes';
import { UserMenu } from './ui/UserMenu';
import { ThemeToggle } from './ui/ThemeToggle';
import { SearchButton } from './ui/SearchButton';
import { GlobalSearch } from './GlobalSearch';
import { MobileNav } from './MobileNav';
import { Bars3Icon } from '@heroicons/react/24/outline';

export function Navigation() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const isActiveLink = (href: string) => {
    if (href === '/') {
      return router.pathname === '/';
    }
    return router.pathname.startsWith(href);
  };

  return (
    <>
      <nav className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              {/* 移动端菜单按钮 */}
              <div className="flex items-center sm:hidden">
                <button
                  type="button"
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
                  onClick={() => setIsMobileNavOpen(true)}
                >
                  <span className="sr-only">Open main menu</span>
                  <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>

              {/* Logo */}
              <div className="flex-shrink-0 flex items-center">
                <Link href="/" className="text-xl font-bold text-primary-600 dark:text-primary-400">
                  CardForest
                </Link>
              </div>

              {/* 桌面端导航 */}
              <div className="hidden sm:ml-6 sm:flex sm:space-x-4">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                      isActiveLink(item.href)
                        ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
                    }`}
                  >
                    {item.icon && (
                      <item.icon
                        className={`mr-1.5 h-5 w-5 flex-shrink-0 ${
                          isActiveLink(item.href)
                            ? 'text-primary-500 dark:text-primary-400'
                            : 'text-gray-400 group-hover:text-gray-500 dark:text-gray-400 dark:group-hover:text-gray-300'
                        }`}
                        aria-hidden="true"
                      />
                    )}
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* 右侧工具栏 */}
            <div className="flex items-center space-x-2">
              <SearchButton onClick={() => setIsSearchOpen(true)} />
              <ThemeToggle />
              <UserMenu />
            </div>
          </div>
        </div>
      </nav>

      {/* 全局搜索 */}
      <GlobalSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* 移动端导航 */}
      <MobileNav
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
        navItems={navItems}
      />
    </>
  );
}
