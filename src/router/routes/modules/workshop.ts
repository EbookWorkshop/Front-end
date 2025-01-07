import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const WORKSHOP: AppRouteRecordRaw = {
  path: '/workshop',
  name: 'workshop',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.workshop',
    requiresAuth: true,
    icon: 'icon-loop',
    order: 2,
  },
  children: [
    {
      path: 'import',
      name: 'import',
      component: () => import('@/views/workshop/import/index.vue'),
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
      component: import('@/layout/page-layout.vue'),
      meta: {
        locale: 'menu.workshop.export',
        requiresAuth: true,
        icon: 'icon-export',
        roles: ['*'],
      },
      children: [
        {
          path: 'productsmanagement',
          name: 'ProductsManagement',
          component: () => import('@/views/exception/404/index.vue'),
          meta: {
            icon: 'icon-select-all',
            locale: 'menu.workshop.export.productsmanagement',
            requiresAuth: true,
            roles: ['*'],
          },
        },
      ],
    },
    {
      path: 'webbookmanage',
      name: 'WebBookManage',
      component: () => import('@/views/workshop/webbooklist.vue'),
      meta: {
        locale: 'menu.workshop.webbook',
        requiresAuth: true,
        icon: 'icon-storage',
        roles: ['*'],
      },
    },
    {
      path: 'mailto',
      name: 'MailTo',
      component: () => import('@/views/workshop/mailto.vue'),
      meta: {
        locale: 'menu.workshop.mailto',
        requiresAuth: true,
        icon: 'icon-send',
        roles: ['*'],
      },
    },
  ],
};

export default WORKSHOP;
