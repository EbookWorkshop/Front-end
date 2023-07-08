import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const WORKPLACE: AppRouteRecordRaw = {
  path: '/workplace',
  name: 'workplace',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.workplace',
    requiresAuth: true,
    icon: 'icon-brush',
    order: 4,
  },
  children: [
    {
      path: 'correction',
      name: 'correction', // 改错别字
      component: import('@/layout/page-layout.vue'),
      meta: {
        icon: 'icon-find-replace',
        locale: 'menu.workplace.correction',
        requiresAuth: true,
        roles: ['*'],
      },
      children: [
        {
          path: 'reviewrule',
          name: 'Reviewrule',
          component: () => import('@/views/workplace/reviewrule.vue'),
          meta: {
            icon: 'icon-list',
            locale: 'menu.workplace.correction.reviewrule',
            requiresAuth: true,
            roles: ['*'],
          },
        },
        {
          path: 'bookandrule',
          name: 'BookAndRule',
          component: () => import('@/views/workplace/bookandrule.vue'),
          meta: {
            icon: 'icon-select-all',
            locale: 'menu.workplace.correction.bookandrule',
            requiresAuth: true,
            roles: ['*'],
          },
        },
      ],
    },
    {
      path: 'revise',
      name: 'revise', // 修订内容
      component: () => import('@/views/workplace/index.vue'),
      meta: {
        icon: 'icon-eraser',
        locale: 'menu.workplace.revise',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'readtypeset',
      name: 'readtypeset', // 调章节顺序
      component: () => import('@/views/workplace/index.vue'),
      meta: {
        icon: 'icon-sort-ascending',
        locale: 'menu.workplace.readtypeset',
        requiresAuth: true,
        roles: ['*'],
      },
    },
  ],
};

export default WORKPLACE;
