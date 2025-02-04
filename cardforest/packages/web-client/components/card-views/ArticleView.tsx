import { useRef, useState } from 'react';
import { Card } from '@/types/card';
import * as ScrollArea from '@radix-ui/react-scroll-area';

interface ArticleViewProps {
  data: Card[];
}

interface Section {
  card: Card;
  level: number;
}

export function ArticleView({ data }: ArticleViewProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  // 简单的标题级别判断逻辑
  const getSectionLevel = (title: string): number => {
    if (title.startsWith('# ')) return 1;
    if (title.startsWith('## ')) return 2;
    if (title.startsWith('### ')) return 3;
    return 4;
  };

  // 处理标题，移除 Markdown 标记
  const cleanTitle = (title: string): string => {
    return title.replace(/^#+\s/, '');
  };

  // 构建文章结构
  const sections: Section[] = data.map((card) => ({
    card,
    level: getSectionLevel(card.title),
  }));

  // 处理滚动到指定部分
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(id);
    }
  };

  return (
    <div className="flex h-full">
      {/* 目录侧边栏 */}
      <div className="w-64 flex-shrink-0 border-r border-gray-200 dark:border-gray-700">
        <ScrollArea.Root className="w-full h-full">
          <ScrollArea.Viewport className="w-full h-full">
            <nav className="p-4">
              <h2 className="font-bold text-gray-900 dark:text-white mb-4">
                Table of Contents
              </h2>
              <ul className="space-y-2">
                {sections.map(({ card, level }) => (
                  <li
                    key={card._id}
                    style={{ paddingLeft: `${(level - 1) * 1}rem` }}
                  >
                    <button
                      onClick={() => scrollToSection(card._id)}
                      className={`
                        text-left text-sm w-full px-2 py-1 rounded
                        ${
                          activeSection === card._id
                            ? 'bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-200'
                            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                        }
                      `}
                    >
                      {cleanTitle(card.title)}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </ScrollArea.Viewport>
          <ScrollArea.Scrollbar
            className="flex select-none touch-none p-0.5 bg-gray-100 dark:bg-gray-700 transition-colors duration-150 ease-out hover:bg-gray-200 dark:hover:bg-gray-600"
            orientation="vertical"
          >
            <ScrollArea.Thumb className="flex-1 bg-gray-300 dark:bg-gray-500 rounded-lg relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:min-w-[44px] before:min-h-[44px]" />
          </ScrollArea.Scrollbar>
        </ScrollArea.Root>
      </div>

      {/* 文章内容 */}
      <div className="flex-grow overflow-auto">
        <ScrollArea.Root className="w-full h-full">
          <ScrollArea.Viewport className="w-full h-full">
            <div
              ref={contentRef}
              className="max-w-3xl mx-auto px-8 py-6 space-y-12"
            >
              {sections.map(({ card, level }) => (
                <section
                  key={card._id}
                  id={card._id}
                  className="scroll-mt-6"
                >
                  <h2
                    className={`
                      font-bold text-gray-900 dark:text-white mb-4
                      ${level === 1 ? 'text-3xl' : ''}
                      ${level === 2 ? 'text-2xl' : ''}
                      ${level === 3 ? 'text-xl' : ''}
                      ${level === 4 ? 'text-lg' : ''}
                    `}
                  >
                    {cleanTitle(card.title)}
                  </h2>
                  <div className="prose dark:prose-invert max-w-none">
                    <p className="whitespace-pre-wrap">{card.content}</p>
                  </div>
                </section>
              ))}
            </div>
          </ScrollArea.Viewport>
          <ScrollArea.Scrollbar
            className="flex select-none touch-none p-0.5 bg-gray-100 dark:bg-gray-700 transition-colors duration-150 ease-out hover:bg-gray-200 dark:hover:bg-gray-600"
            orientation="vertical"
          >
            <ScrollArea.Thumb className="flex-1 bg-gray-300 dark:bg-gray-500 rounded-lg relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:min-w-[44px] before:min-h-[44px]" />
          </ScrollArea.Scrollbar>
        </ScrollArea.Root>
      </div>
    </div>
  );
}
