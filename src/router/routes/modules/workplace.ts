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
      name: 'correction', // 校阅
      component: () => import('@/layout/page-layout.vue'),
      meta: {
        icon: 'icon-find-replace',
        locale: 'menu.workplace.correction',
        requiresAuth: true,
        roles: ['*'],
      },
      children: [
        {
          path: 'reviewbook/:bookid(\\d+)?',
          name: 'ReviewBook',//校阅书本
          component: () => import('@/views/workplace/review/index.vue'),
          meta: {
            icon: 'icon-robot',
            locale: 'menu.workplace.correction.reviewbook',
            requiresAuth: true,
            roles: ['*'],
          },
        },
        {
          path: 'reviewrule',
          name: 'Reviewrule',
          component: () => import('@/views/workplace/reviewrule.vue'),
          meta: {
            icon: 'icon-nav',
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
        }
      ],
    },
    {
      path: 'revise',
      name: 'revise', // 修订内容
      component: () => import('@/views/workplace/revise/index.vue'),
      meta: {
        icon: 'icon-eraser',
        locale: 'menu.workplace.revise',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'revise/book/:id(\\d+)',
      name: 'revisebook',//修订-编辑书本内容
      component: () => import('@/views/workplace/revise/book.vue'),
      meta: {
        requiresAuth: true,
        hideInMenu: true,
        activeMenu: "revise",
        roles: ['*'],
      },
    },
    {
      path: 'suspiciouschars',
      name: 'SuspiciousChars',//可疑字符分析
      component: () => import('@/views/workplace/suspiciouschars.vue'),
      meta: {
        locale: 'menu.workplace.suspiciouschars',
        requiresAuth: true,
        hideInMenu: true,
        activeMenu: "workplace",
        roles: ['*'],
      },
    },
    {
      path: 'analytics/text/:id(\\d+)',
      name: 'AnalyticsText',//文本统计
      component: () => import('@/views/workplace/analyticstext.vue'),
      meta: {
        locale: 'menu.workplace.analyticstext',
        requiresAuth: true,
        hideInMenu: true,
        activeMenu: "workplace",
        roles: ['*'],
      },
    }
  ],
};

export default WORKPLACE;