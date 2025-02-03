import { useAtom } from 'jotai';
import * as Tabs from '@radix-ui/react-tabs';
import { cardViewsConfigAtom, CardViewType } from '@/atoms/cardViews';
import { useEffect } from 'react';

const views: { value: CardViewType; label: string; icon: React.ReactNode }[] = [
  {
    value: 'table',
    label: 'Table',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3h18v18H3z"/>
        <path d="M3 9h18"/>
        <path d="M3 15h18"/>
        <path d="M9 3v18"/>
        <path d="M15 3v18"/>
      </svg>
    ),
  },
  {
    value: 'gallery',
    label: 'Gallery',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7"/>
        <rect x="14" y="3" width="7" height="7"/>
        <rect x="14" y="14" width="7" height="7"/>
        <rect x="3" y="14" width="7" height="7"/>
      </svg>
    ),
  },
  {
    value: 'kanban',
    label: 'Kanban',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3h18v18H3z"/>
        <path d="M8 3v18"/>
        <path d="M16 3v18"/>
      </svg>
    ),
  },
  {
    value: 'feed',
    label: 'Feed',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 11h16"/>
        <path d="M4 6h16"/>
        <path d="M4 16h16"/>
      </svg>
    ),
  },
  {
    value: 'article',
    label: 'Article',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
        <line x1="10" y1="9" x2="8" y2="9"/>
      </svg>
    ),
  },
];

export function ViewSwitcher() {
  const [config, setConfig] = useAtom(cardViewsConfigAtom);

  useEffect(() => {
    localStorage.setItem('cardViewsConfig', JSON.stringify(config));
  }, [config]);

  return (
    <Tabs.Root
      value={config.currentView}
      onValueChange={(value) => setConfig({ ...config, currentView: value as CardViewType })}
    >
      <Tabs.List className="inline-flex h-9 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 p-1 text-gray-500 dark:text-gray-400">
        {views.map((view) => (
          <Tabs.Trigger
            key={view.value}
            value={view.value}
            className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-950 data-[state=active]:text-gray-950 dark:data-[state=active]:text-gray-50 data-[state=active]:shadow-sm`}
          >
            <span className="mr-2">{view.icon}</span>
            {view.label}
          </Tabs.Trigger>
        ))}
      </Tabs.List>
    </Tabs.Root>
  );
}
