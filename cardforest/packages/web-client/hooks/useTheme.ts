import { useState, useEffect } from 'react';
import { atomWithStorage } from 'jotai/utils';
import { useAtom } from 'jotai';

type Theme = 'light' | 'dark' | 'system';

// 持久化存储主题设置
const themeAtom = atomWithStorage<Theme>('theme', 'system');

export function useTheme() {
  const [theme, setTheme] = useAtom(themeAtom);
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

  // 根据系统偏好设置解析主题
  const resolveTheme = (): 'light' | 'dark' => {
    if (theme === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return theme;
  };

  // 应用主题到 DOM
  const applyTheme = (newTheme: 'light' | 'dark') => {
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    setResolvedTheme(newTheme);
  };

  // 初始化主题
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // 监听系统主题变化
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      const handleChange = () => {
        if (theme === 'system') {
          applyTheme(mediaQuery.matches ? 'dark' : 'light');
        }
      };
      
      // 初始应用主题
      applyTheme(resolveTheme());
      
      // 添加监听器
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', handleChange);
      } else {
        // 兼容旧版浏览器
        mediaQuery.addListener(handleChange);
      }
      
      // 清理监听器
      return () => {
        if (mediaQuery.removeEventListener) {
          mediaQuery.removeEventListener('change', handleChange);
        } else {
          // 兼容旧版浏览器
          mediaQuery.removeListener(handleChange);
        }
      };
    }
  }, [theme]);

  // 更新主题
  const setThemeValue = (newTheme: Theme) => {
    setTheme(newTheme);
    if (newTheme !== 'system') {
      applyTheme(newTheme);
    } else {
      applyTheme(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    }
  };

  return {
    theme,
    resolvedTheme,
    setTheme: setThemeValue,
    isSystem: theme === 'system',
    isLight: resolvedTheme === 'light',
    isDark: resolvedTheme === 'dark'
  };
}
