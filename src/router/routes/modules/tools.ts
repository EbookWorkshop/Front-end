import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const TOOLS: AppRouteRecordRaw = {
  path: '/tools',
  name: 'Tools',
  component: DEFAULT_LAYOUT,
  redirect: '/tools/other',
  meta: {
    locale: 'menu.tools',
    icon: 'icon-tool',
    hideChildrenInMenu: true,
    requiresAuth: false,
    order: 8,
  },
  children: [
    {
      path: 'other', // 子路由默认路径为空字符串
      name: 'OtherTools',
      component: () => import('@/views/tools/other.vue'),
      meta: {
        locale: 'menu.tools.other',
        requiresAuth: false,
        activeMenu: 'Tools', // 这个属性可以设置高亮的菜单项
      },
    },
  ],
};

export default TOOLS;
