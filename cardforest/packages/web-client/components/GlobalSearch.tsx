import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import {
  MagnifyingGlassIcon,
  XMarkIcon,
  DocumentTextIcon,
  CubeIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { useRouter } from 'next/router';
import { useLazyQuery } from '@apollo/client';
import { SEARCH_ALL } from '@/graphql/queries/searchQueries';
import { formatDate } from '@/utils/date';

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SearchResult {
  _id: string;
  _key: string;
  title?: string;
  name?: string;
  content?: string;
  createdAt: string;
  updatedAt?: string;
  type: 'card' | 'model';
  model?: {
    _id: string;
    name: string;
  };
  system?: boolean;
}

export function GlobalSearch({ isOpen, onClose }: GlobalSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'cards' | 'models'>('all');
  const router = useRouter();

  // 设置搜索查询
  const [search, { loading, data }] = useLazyQuery(SEARCH_ALL, {
    fetchPolicy: 'network-only',
  });

  // 当模态框打开时，重置搜索状态
  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
      setResults([]);
      setActiveTab('all');
    }
  }, [isOpen]);

  // 处理搜索结果
  useEffect(() => {
    if (data) {
      const allResults: SearchResult[] = [];

      // 处理卡片结果
      if (data.searchCards) {
        data.searchCards.forEach((card: any) => {
          allResults.push({
            ...card,
            type: 'card'
          });
        });
      }

      // 处理模型结果
      if (data.searchModels) {
        data.searchModels.forEach((model: any) => {
          allResults.push({
            ...model,
            type: 'model'
          });
        });
      }

      setResults(allResults);
    }
  }, [data]);

  // 处理搜索输入
  const handleSearch = (query: string) => {
    setSearchQuery(query);

    if (query.trim().length > 0) {
      search({
        variables: {
          query,
          limit: 10
        }
      });
    } else {
      setResults([]);
    }
  };

  // 处理结果点击
  const handleResultClick = (result: SearchResult) => {
    const path = result.type === 'card'
      ? `/cards/${result._key}`
      : `/models/${result._key}`;

    router.push(path);
    onClose();
  };

  // 过滤结果
  const filteredResults = results.filter(result => {
    if (activeTab === 'all') return true;
    return result.type === activeTab.slice(0, -1); // 移除复数形式的 's'
  });

  // 获取结果标题
  const getResultTitle = (result: SearchResult) => {
    return result.title || result.name || 'Untitled';
  };

  // 获取结果图标
  const getResultIcon = (result: SearchResult) => {
    switch (result.type) {
      case 'card':
        return <DocumentTextIcon className="h-5 w-5 text-blue-500" />;
      case 'model':
        return <CubeIcon className="h-5 w-5 text-purple-500" />;
      default:
        return <DocumentTextIcon className="h-5 w-5" />;
    }
  };

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

        <div className="fixed inset-0 z-10 overflow-y-auto p-4 sm:p-6 md:p-20">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="mx-auto max-w-3xl transform divide-y divide-gray-100 dark:divide-gray-700 overflow-hidden rounded-xl bg-white dark:bg-gray-800 shadow-2xl ring-1 ring-black ring-opacity-5 transition-all">
              <div className="relative">
                <MagnifyingGlassIcon
                  className="pointer-events-none absolute top-3.5 left-4 h-5 w-5 text-gray-400 dark:text-gray-500"
                  aria-hidden="true"
                />
                <input
                  type="text"
                  className="h-12 w-full border-0 bg-transparent pl-11 pr-4 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-0 sm:text-sm"
                  placeholder="Search cards, models..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  autoFocus
                />
                <button
                  type="button"
                  className="absolute top-3.5 right-4 h-5 w-5 text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400"
                  onClick={onClose}
                >
                  <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>

              {/* 搜索结果标签页 */}
              {searchQuery.trim().length > 0 && (
                <div className="flex border-b border-gray-100 dark:border-gray-700">
                  <button
                    className={`flex-1 px-4 py-2 text-sm font-medium ${
                      activeTab === 'all'
                        ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-500 dark:border-primary-400'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                    onClick={() => setActiveTab('all')}
                  >
                    All ({results.length})
                  </button>
                  <button
                    className={`flex-1 px-4 py-2 text-sm font-medium ${
                      activeTab === 'cards'
                        ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-500 dark:border-primary-400'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                    onClick={() => setActiveTab('cards')}
                  >
                    Cards ({results.filter(r => r.type === 'card').length})
                  </button>
                  <button
                    className={`flex-1 px-4 py-2 text-sm font-medium ${
                      activeTab === 'models'
                        ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-500 dark:border-primary-400'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                    onClick={() => setActiveTab('models')}
                  >
                    Models ({results.filter(r => r.type === 'model').length})
                  </button>
                </div>
              )}

              {/* 加载状态 */}
              {loading && (
                <div className="p-6 text-center">
                  <div className="inline-block animate-pulse h-8 w-8 rounded-full bg-primary-100 dark:bg-primary-900 p-1">
                    <MagnifyingGlassIcon className="h-6 w-6 text-primary-500 dark:text-primary-400" />
                  </div>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Searching...</p>
                </div>
              )}

              {/* 搜索结果 */}
              {!loading && filteredResults.length > 0 && (
                <div className="max-h-80 scroll-py-2 overflow-y-auto p-2">
                  <div className="p-2">
                    <ul className="divide-y divide-gray-100 dark:divide-gray-700">
                      {filteredResults.map((result) => (
                        <li
                          key={result._id}
                          className="cursor-pointer p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md"
                          onClick={() => handleResultClick(result)}
                        >
                          <div className="flex items-start">
                            <div className="flex-shrink-0 mt-1">
                              {getResultIcon(result)}
                            </div>
                            <div className="ml-3 flex-1 truncate">
                              <div className="flex items-center space-x-2">
                                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                  {getResultTitle(result)}
                                </h3>
                                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                                  result.type === 'card'
                                    ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                                    : 'bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300'
                                }`}>
                                  {result.type}
                                  {result.type === 'model' && result.system && ' (system)'}
                                </span>
                              </div>
                              {result.content && (
                                <p className="mt-1 text-sm text-gray-600 dark:text-gray-300 line-clamp-1">
                                  {result.content}
                                </p>
                              )}
                              <div className="mt-1 flex items-center text-xs text-gray-500 dark:text-gray-400">
                                <ClockIcon className="mr-1 h-3 w-3 flex-shrink-0" />
                                <span>
                                  {formatDate(result.updatedAt || result.createdAt)}
                                </span>
                                {result.type === 'card' && result.model && (
                                  <span className="ml-2 flex items-center">
                                    <CubeIcon className="mr-1 h-3 w-3 flex-shrink-0" />
                                    {result.model.name}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* 无结果状态 */}
              {!loading && searchQuery.trim().length > 0 && filteredResults.length === 0 && (
                <div className="p-6 text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    No {activeTab !== 'all' ? activeTab : 'results'} found for "{searchQuery}"
                  </p>
                </div>
              )}

              {/* 底部提示 */}
              <div className="p-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                    <span>Press</span>
                    <kbd className="rounded-sm border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 px-1 font-sans text-xs text-gray-600 dark:text-gray-300">
                      ESC
                    </kbd>
                    <span>to close</span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {searchQuery.trim().length > 0 && !loading && (
                      <span>{filteredResults.length} results</span>
                    )}
                  </div>
                </div>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
