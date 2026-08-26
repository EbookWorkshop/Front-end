import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';
import { getApiBaseUrl } from '@/utils/config';
export const API_BASE_URL = getApiBaseUrl();

const IFRAME = import('@/views/docs/docs-frame.vue'); // 组件需要异步导入 不然会有警告

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
        src: `${API_BASE_URL}/swagger`,
      }),
      meta: {
        icon: 'icon-file',
        locale: 'menu.api.swagger',
        requiresAuth: false,
        roles: ['*'],
      },
    },
    {
      path: 'openapi-ui-dist',
      name: 'openapi-ui-dist',
      component: () => IFRAME,
      props: () => ({
        src: `${API_BASE_URL}/swagger/openapi-ui-dist`,
        useTheme: true,
      }),
      meta: {
        icon: 'icon-file',
        locale: 'menu.api.openapi.dist',
        requiresAuth: false,
        roles: ['*'],
      },
    },
    {
      path: 'scalar',
      name: 'scalar',
      component: () => IFRAME,
      props: () => ({
        src: `${API_BASE_URL}/swagger/scalar`,
        useTheme: true,
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
        src: `${API_BASE_URL}/swagger/stoplight`,
      }),
      meta: {
        icon: 'icon-file',
        locale: 'menu.api.stoplight',
        requiresAuth: false,
        roles: ['*'],
      },
    },
    {
      path: 'rapidoc',
      name: 'rapidoc',
      component: () => IFRAME,
      props: () => ({
        src: `${API_BASE_URL}/swagger/rapidoc`,
        useTheme: true,
      }),
      meta: {
        icon: 'icon-file',
        locale: 'menu.api.rapidoc',
        requiresAuth: false,
        roles: ['*'],
      },
    },
    {
      path: 'redoc',
      name: 'redoc',
      component: () => IFRAME,
      props: () => ({
        src: `${API_BASE_URL}/swagger/redoc`,
      }),
      meta: {
        icon: 'icon-file',
        locale: 'menu.api.redoc',
        requiresAuth: false,
        roles: ['*'],
      },
    },
  ],
};

export default SYSTEM;
