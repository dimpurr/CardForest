import { ReactNode } from 'react';
import { Navigation } from './Navigation';
import { Breadcrumb } from './ui/Breadcrumb';
import Head from 'next/head';

interface LayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  breadcrumbs?: Array<{ label: string; href?: string }>;
}

export function Layout({ children, title, description, breadcrumbs }: LayoutProps) {
  const pageTitle = title ? `${title} | CardForest` : 'CardForest';
  const pageDescription = description || 'Your personal knowledge garden';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Navigation />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <div className="mb-4">
            <Breadcrumb items={breadcrumbs} />
          </div>
        )}
        {title && (
          <div className="mb-6">
            <h1 className="text-2xl font-bold">{title}</h1>
            {description && <p className="text-gray-600 dark:text-gray-400 mt-1">{description}</p>}
          </div>
        )}
        <main>{children}</main>
      </div>
    </div>
  );
}
