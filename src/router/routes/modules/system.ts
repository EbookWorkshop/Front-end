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
      path: 'smtp',
      name: 'smtp',
      component: () => import('@/views/system/smtpsetting.vue'),
      meta: {
        locale: 'menu.system.smtp',
        icon: 'icon-email',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'email',
      name: 'Email',
      component: () => import('@/views/system/kindlemail.vue'),
      meta: {
        locale: 'menu.system.email_kindle',
        icon: 'icon-mobile',
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
  ],
};

export default SYSTEM;
