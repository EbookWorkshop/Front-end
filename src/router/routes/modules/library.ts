import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const LIBRARY: AppRouteRecordRaw = {
  path: '/library',
  name: 'Library',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.library',
    requiresAuth: true,
    // hideChildrenInMenu: true,
    icon: 'icon-home',
    order: 2,
  },
  children: [
    {
      path: 'booklist',
      name: 'BookList',
      component: () => import('@/views/library/list/index.vue'),
      meta: {
        locale: 'menu.library.list',
        requiresAuth: true,
        icon: 'icon-book',
        roles: ['*'],
      },
    },
  ],
};

export default LIBRARY;
