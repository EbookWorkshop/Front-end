import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const LIBRARY: AppRouteRecordRaw = {
  path: '/library',
  name: 'library',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.library',
    requiresAuth: true,
    // hideChildrenInMenu: true,
    icon: 'icon-bookmark',
    order: 2,
  },
  children: [
    {
      path: 'list',
      name: 'List',
      component: () => import('@/views/library/list/index.vue'),
      meta: {
        locale: 'menu.library.list',
        requiresAuth: true,
        icon: 'icon-storage',
        roles: ['*'],
      },
    },
  ],
};

export default LIBRARY;
