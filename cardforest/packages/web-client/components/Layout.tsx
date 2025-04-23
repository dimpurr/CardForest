import { ReactNode } from 'react';
import { useRouter } from 'next/router';
import { Navigation } from './Navigation';
import { Breadcrumb } from './ui/Breadcrumb';
import Head from 'next/head';
import { getBreadcrumbs } from '@/config/routes';

interface LayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  breadcrumbs?: Array<{ label: string; href?: string }>;
  actions?: ReactNode;
  fullWidth?: boolean;
  hideTitle?: boolean;
}

export function Layout({
  children,
  title,
  description,
  breadcrumbs,
  actions,
  fullWidth = false,
  hideTitle = false
}: LayoutProps) {
  const router = useRouter();
  const pageTitle = title ? `${title} | CardForest` : 'CardForest';
  const pageDescription = description || 'Your personal knowledge garden';

  // 如果没有提供面包屑，则根据当前路径生成
  const currentBreadcrumbs = breadcrumbs || getBreadcrumbs(router.pathname);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Navigation />
      <div className={`${fullWidth ? 'w-full' : 'max-w-7xl mx-auto'} py-6 px-4 sm:px-6 lg:px-8`}>
        {currentBreadcrumbs && currentBreadcrumbs.length > 0 && (
          <div className="mb-4">
            <Breadcrumb items={currentBreadcrumbs} />
          </div>
        )}

        {!hideTitle && (title || actions) && (
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              {title && <h1 className="text-2xl font-bold">{title}</h1>}
              {description && <p className="text-gray-600 dark:text-gray-400 mt-1">{description}</p>}
            </div>
            {actions && (
              <div className="mt-4 sm:mt-0 flex space-x-3 justify-end">
                {actions}
              </div>
            )}
          </div>
        )}

        <main className="pb-12">
          {children}
        </main>
      </div>
    </div>
  );
}
