import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const IFRAME = import('@/layout/iframe-layout.vue'); // 组件需要异步导入 不然会有警告

const SYSTEM: AppRouteRecordRaw = {
  path: '/docs',
  name: 'docs',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.api',
    requiresAuth: true,
    icon: 'icon-info-circle-fill',
    order: 9,
  },
  children: [
    {
      path: 'swagger-ui',
      name: 'swagger-ui',
      component: () => IFRAME,
      props: () => ({
        src: 'http://localhost:8777/swagger',
      }),
      meta: {
        icon: 'icon-file',
        locale: 'menu.api.swagger',
        requiresAuth: false,
        roles: ['*'],
      },
    },
    {
      path: 'swagger-ui-dist',
      name: 'swagger-ui-dist',
      component: () => IFRAME,
      props: () => ({
        src: 'http://localhost:8777/swagger-ui-dist',
      }),
      meta: {
        icon: 'icon-file',
        locale: 'menu.api.swagger.dist',
        requiresAuth: false,
        roles: ['*'],
      },
    },
    {
      path: 'scalar',
      name: 'scalar',
      component: () => IFRAME,
      props: () => ({
        src: 'http://localhost:8777/swagger/scalar',
      }),
      meta: {
        icon: 'icon-file',
        locale: 'menu.api.scalar',
        requiresAuth: false,
        roles: ['*'],
      },
    },
    {
      path: 'stoplight',
      name: 'stoplight',
      component: () => IFRAME,
      props: () => ({
        src: 'http://localhost:8777/swagger/stoplight',
      }),
      meta: {
        icon: 'icon-file',
        locale: 'menu.api.stoplight',
        requiresAuth: false,
        roles: ['*'],
      },
    },
  ],
};

export default SYSTEM;
