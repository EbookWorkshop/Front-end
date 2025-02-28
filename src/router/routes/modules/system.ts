import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const SYSTEM: AppRouteRecordRaw = {
  path: '/system',
  name: 'system',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.system',
    requiresAuth: true,
    icon: 'icon-settings',
    order: 8,
  },
  children: [
    {
      path: 'workerpool',
      name: 'workerpool',
      component: () => import('@/views/system/workerpool.vue'),
      meta: {
        locale: 'menu.system.workerpool',
        icon: 'icon-dashboard',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'mailsetting',
      name: 'mailsetting',
      component: () => import('@/views/system/mailsetting.vue'),
      meta: {
        locale: 'menu.system.smtp',
        icon: 'icon-email',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'webrule',
      name: 'webrule',
      component: () => import('@/views/system/webrule/index.vue'),
      meta: {
        locale: 'menu.system.webrule',
        icon: 'icon-robot',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'fontmanager',
      name: 'fontmanager',
      component: () => import('@/views/system/fontmanager.vue'),
      meta: {
        locale: 'menu.system.fontmanager',
        icon: 'icon-language',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'preferences',
      name: 'Preferences',
      component: () => import('@/views/result/success/index.vue'),
      meta: {
        locale: 'menu.system.preferences',
        icon: 'icon-star',
        requiresAuth: true,
        roles: ['*'],
      },
    },
  ],
};

export default SYSTEM;
