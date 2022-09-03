import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const LIBRARY: AppRouteRecordRaw = {
  path: '/workshop',
  name: 'workshop',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.workshop',
    requiresAuth: true,
    icon: 'icon-translate',
    order: 2,
  },
  children: [
    {
      path: 'import',
      name: 'import',
      component: () => import('@/views/library/list/index.vue'),
      meta: {
        locale: 'menu.workshop.import',
        requiresAuth: true,
        icon: 'icon-import',
        roles: ['*'],
      },
    },
    {
      path: 'export',
      name: 'export',
      component: () => import('@/views/library/list/index.vue'),
      meta: {
        locale: 'menu.workshop.export',
        requiresAuth: true,
        icon: 'icon-export',
        roles: ['*'],
      },
    },
  ],
};

export default LIBRARY;
