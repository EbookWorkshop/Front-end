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
      path: 'booklist/:tagid?',
      name: 'BookList',
      component: () => import('@/views/library/list/index.vue'),
      meta: {
        locale: 'menu.library.list',
        requiresAuth: true,
        icon: 'icon-book',
        roles: ['*'],
      },
    },
    {
      path: 'bookmark',
      name: 'Bookmark',
      component: () => import('@/views/not-found/index.vue'),
      meta: {
        locale: 'menu.library.bookmark',
        requiresAuth: true,
        icon: 'icon-bookmark',
        roles: ['*'],
      },
    },
    {
      path: '/book/:id(\\d+)',
      name: 'Reading',
      component: () => import('@/views/book/reading.vue'),
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
  ],
};

export default LIBRARY;
