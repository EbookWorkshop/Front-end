import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';
import {h} from 'vue';

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
      path: 'usestate',
      name: 'UseState',
      component: () => h("div","当前书库数据库一些情况统计：比如有多少本书，分别多少万字……"),
      meta: {
        locale: 'menu.system.usestate',
        icon: 'icon-bar-chart',
        requiresAuth: true,
        roles: ['*'],
      },
    },
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
      component: () => h("div","一些可以设置的选项，用户偏好设置等，比如默认字体"),
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
