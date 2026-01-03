<template>
    <div class="container">
        <Breadcrumb :items="['menu.system', 'menu.system.webrule', 'menu.system.RegisteredWebsites']" />
        <div class="wrapper">
            <h3>已注册网站</h3>
            <div v-if="loading">加载中...</div>
            <div v-else>
                <div v-if="!sites.length">暂无已注册网站</div>
                <div v-else>
                    <a-table :data="sites" row-key="Host" :loading="loading" :pagination="false" :row-class="rowClass">
                        <template #columns>
                            <a-table-column title="站点" data-index="Host" :width="250">
                                <template #cell="{ record }">
                                    <a :href="`https://${record.Host}`" target="_blank">{{ record.Host }}</a>
                                </template>
                            </a-table-column>

                            <a-table-column title="关联书数量" data-index="BookCount" :width="120"></a-table-column>

                            <a-table-column title="最后一次使用" data-index="LastAddedTime" :width="180">
                                <template #cell="{ record }">{{ formatTime(record.LastAddedTime) }}</template>
                            </a-table-column>

                            <a-table-column title="是否可以访问" :width="150">
                                <template #cell="{ record }">
                                    <div v-if="statuses[record.Host] && statuses[record.Host].loading" class="meta">
                                        检测中...</div>
                                    <div v-else-if="statuses[record.Host] && statuses[record.Host].result">{{
                                        statuses[record.Host].result }}：{{ statuses[record.Host].status }}</div>
                                    <div v-else>-</div>
                                    <a-button type="text" class="link-btn"
                                        @click="checkHost(record.Host, true)">重试</a-button>
                                </template>
                            </a-table-column>

                            <a-table-column title="关联书本">
                                <template #cell="{ record }">
                                    <div>
                                        <a-tag v-for="book in record.Books" :key="book.BookId"
                                            :title="`ID: ${book.BookId}`" class="tag">{{ book.BookName }}</a-tag>
                                    </div>
                                </template>
                            </a-table-column>
                        </template>
                    </a-table>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { queryRegisteredWebsites } from '@/api/webbot';
import { checkSiteAccessibility } from '@/api/system';
import useRequest from '@/hooks/request';
import { computed, reactive, watch } from 'vue';

interface Book { BookId: number; BookName: string }
interface Website { Host: string; BookCount: number; LastAddedTime: string; Books: Book[] }

const { loading, response: renderData } = useRequest<Website[]>(queryRegisteredWebsites);

const sites = computed(() => {
    const v = (renderData as any)?.value;
    return Array.isArray(v) ? v as Website[] : [];
});


function formatTime(t?: string) {
    if (!t) return '';
    const d = new Date(t);
    if (isNaN(d.getTime())) return t;
    return d.toLocaleString();
}

// 行级检测状态管理
const statuses = reactive<Record<string, { loading: boolean; result?: string; status?: string, style?: string }>>({});

async function checkHost(host: string, force = false) {
    if (!host) return;
    const s = statuses[host];
    if (s && s.loading) return; // 已在检测中
    if (!force && s && s.result) return; // 已有结果且非强制
    statuses[host] = { loading: true } as any;
    try {
        const res: any = await checkSiteAccessibility(host);
        let text = '';
        if (res && res.data != null) {
            text = res.data === true ? '可访问' : '不可访问';
            statuses[host].style = res.data === true ? 'row-success' : 'row-failure';
        } else if (res && res.status === 200) {
            text = '可访问';
        } else {
            text = '无返回信息';
        }
        statuses[host].result = text;
        statuses[host].status = res?.status;
    } catch (err: any) {
        statuses[host].result = err?.message || '检测失败';
    } finally {
        statuses[host].loading = false;
    }
}

const rowClass = (record: Website) => {
    return (statuses[record.Host]?.style || '');
}

// 当 sites 变化时触发检测（仅首次检测）
watch(sites, (v) => {
    if (!v || !v.length) return;
    v.forEach(site => {
        if (site && site.Host) checkHost(site.Host);
    });
}, { immediate: true });

</script>

<style scoped>
h3 {
    text-align: center;
}

.wrapper {
    padding: 16px
}



.tag {
    display: inline-block;
    background: var(--color-fill-2, #f2f5f7);
    color: var(--text-color, #333);
    padding: 2px 8px;
    border-radius: 12px;
    margin: 2px 6px 2px 0;
    font-size: 12px
}

.meta {
    color: #888;
    font-size: 12px;
    margin-bottom: 8px
}

.link-btn {
    margin-left: 8px;
    background: none;
    border: none;
    color: var(--link-color, #409EFF);
    cursor: pointer;
    padding: 0;
    font-size: 12px
}

:global(.row-success), :global(.row-success td) {
    background-color: rgb(var(--green-1));
}

:global(.row-failure), :global(.row-failure td) {
    background-color: rgb(var(--orange-1));
}
</style>
