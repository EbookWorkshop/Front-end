import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const ABOUT: AppRouteRecordRaw = {
  path: '/about',
  name: 'About',
  component: DEFAULT_LAYOUT,
  redirect: '/about/me',
  meta: {
    locale: 'menu.about',
    icon: 'icon-bulb',
    hideChildrenInMenu: true,
    // hideInMenu: true,
    requiresAuth: false,
    order: 99,
  },
  children: [
    {
      path: 'me', // 子路由默认路径为空字符串
      name: 'AboutPage',
      component: () => import('@/views/about/index.vue'),
      meta: {
        locale: 'menu.about',
        requiresAuth: false,
        activeMenu: 'About', // 这个属性可以设置高亮的菜单项
        // hideInMenu: true, // 这个属性可以控制该路由是否在菜单中隐藏
      },
    },
  ],
};

export default ABOUT;
