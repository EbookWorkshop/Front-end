import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const BOOK: AppRouteRecordRaw = {
  path: '/book',
  name: 'book',
  component: DEFAULT_LAYOUT,
  meta: {
    requiresAuth: true,
    icon: 'icon-bookmark',
    hideInMenu: true,
  },
  children: [
    {
      path: '/book/:id(\\d+)',
      name: 'BookIndex',
      component: () => import('@/views/book/index.vue'),
      meta: {
        requiresAuth: true,
        hideInMenu: true,
        roles: ['*'],
      },
    },
    {
      path: '/book/:id(\\d+)/chapter/:cid(\\d+)',
      name: 'Chapter',
      component: () => import('@/views/chapter/index.vue'),
      meta: {
        requiresAuth: true,
        hideInMenu: true,
        roles: ['*'],
      },
    },

    {
      path: '/bookedit/:id(\\d+)',
      name: 'BookEdit',
      component: () => import('@/views/book/index.vue'),
      meta: {
        requiresAuth: true,
        hideInMenu: true,
        roles: ['*'],
      },
    },
  ],
};

export default BOOK;
