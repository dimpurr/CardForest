/**
 * 应用程序路由配置
 * 用于定义应用程序的路由和导航结构
 */
import {
  HomeIcon,
  DocumentTextIcon,
  CubeIcon,
  UserIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';

export const routes = {
  // 主页
  home: '/',

  // 认证相关
  auth: {
    signin: '/auth/signin',
    callback: '/auth/callback',
  },

  // 卡片相关
  cards: {
    index: '/cards',
    new: '/cards/new',
    edit: (id: string) => `/cards/${id}/edit`,
    view: (id: string) => `/cards/${id}`,
  },

  // 模型相关
  models: {
    index: '/models',
    new: '/models/new',
    edit: (id: string) => `/models/${id}/edit`,
    view: (id: string) => `/models/${id}`,
  },

  // 用户相关
  profile: '/profile',
  settings: '/settings',
};

/**
 * 导航菜单项
 */
export const navItems = [
  { label: 'Home', href: routes.home, icon: HomeIcon },
  { label: 'Cards', href: routes.cards.index, icon: DocumentTextIcon },
  { label: 'Models', href: routes.models.index, icon: CubeIcon },
];

/**
 * 用户菜单项
 */
export const userMenuItems = [
  { label: 'Profile', href: routes.profile, icon: UserIcon },
  { label: 'Settings', href: routes.settings, icon: Cog6ToothIcon },
];

/**
 * 获取面包屑导航项
 * @param path 当前路径
 * @param customItems 自定义面包屑项
 * @returns 面包屑导航项
 */
export function getBreadcrumbs(path: string, customItems?: Array<{ label: string; href?: string }>) {
  // 如果提供了自定义面包屑项，则使用它们
  if (customItems) {
    return customItems;
  }

  // 根据路径生成面包屑项
  const parts = path.split('/').filter(Boolean);
  const breadcrumbs = [];

  // 添加首页
  breadcrumbs.push({ label: 'Home', href: routes.home });

  // 根据路径部分添加面包屑项
  if (parts.length > 0) {
    if (parts[0] === 'cards') {
      breadcrumbs.push({ label: 'Cards', href: routes.cards.index });

      if (parts.length > 1) {
        if (parts[1] === 'new') {
          breadcrumbs.push({ label: 'Create New Card' });
        } else if (parts.length > 2 && parts[2] === 'edit') {
          breadcrumbs.push({ label: 'Edit Card' });
        }
      }
    } else if (parts[0] === 'models') {
      breadcrumbs.push({ label: 'Models', href: routes.models.index });

      if (parts.length > 1) {
        if (parts[1] === 'new') {
          breadcrumbs.push({ label: 'Create New Model' });
        } else if (parts.length > 2 && parts[2] === 'edit') {
          breadcrumbs.push({ label: 'Edit Model' });
        }
      }
    }
  }

  return breadcrumbs;
}
