import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const Reader: AppRouteRecordRaw = {
    path: '/reader',
    name: 'Reader',
    component: DEFAULT_LAYOUT,
    meta: {
        hideInMenu: true,
        requiresAuth: false,
        order: 99,
    },
    children: [
        {
            path: '/reader/:path(.*)',
            name: 'EpubReader',
            component: () => import('@/views/reader/epub.vue'),
            meta: {
                requiresAuth: false,
                hideInMenu: true,
            },
        },
        {
            path: 'txt', // 子路由默认路径为空字符串
            name: 'TxtReader',
            component: () => import('@/views/reader/txt.vue'),
            meta: {
                requiresAuth: false,
                hideInMenu: true,
            },
        },
    ],
};

export default Reader;
