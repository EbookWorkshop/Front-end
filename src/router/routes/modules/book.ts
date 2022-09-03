import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const LIBRARY: AppRouteRecordRaw = {
  path: '/library',
  name: 'library',
  component: DEFAULT_LAYOUT,
  meta: {
    requiresAuth: true,
    icon: 'icon-bookmark',
    hideInMenu: true,
  },
  children: [
    {
      path: 'list',
      name: 'List',
      component: () => import('@/views/library/list/index.vue'),
      meta: {
        requiresAuth: true,
        hideInMenu: true,
        roles: ['*'],
      },
    },
  ],
};

export default LIBRARY;
