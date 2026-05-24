<template>
    <div class="container">
        <Breadcrumb :items="['menu.workplace', 'menu.workshop.export.productsmanagement']" />
        <div class="wrapper">
            <a-spin :spinning="loading">
                <div>
                    文件数：<a-statistic :value="data.length"></a-statistic>，总大小：
                    <a-statistic :value="(data.reduce((acc, cur) => acc + cur.size, 0) / 1024 / 1024)" :precision="2" :value-style="{ color: '#0fbf60' }">
                        <template #suffix>MB</template>
                    </a-statistic>
                </div>
                <a-card :bordered="false" :style="{ width: '100%' }">
                    <a-card-grid v-for="(item, index) in data" :key="index" :hoverable="true"
                        :style="{ width: '18%', margin: '10px 10px' }">
                        <a-card class="card-book" :title="item.name" :bordered="false">
                            <template #extra>
                                <a-link class="card-title">TODO</a-link>
                            </template>
                            <dl class="dl-book-info">
                                <dt>文件类型</dt>
                                <dd>{{ item.ext }}</dd>
                                <dt>大小</dt>
                                <dd>{{ (item.size / 1024 / 1024).toFixed(2) }} MB</dd>
                                <dt>创建时间</dt>
                                <dd>{{ item.createTime.replace(/[TZ]/g, ' ') }}</dd>
                            </dl>
                        </a-card>
                    </a-card-grid>
                </a-card>
            </a-spin>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { getArchiveBookList } from '@/api/book';
import type { FileInfo } from '@/types/book';
import useRequest from '@/hooks/request';

const { response: data, loading } = useRequest<FileInfo[]>(getArchiveBookList);

</script>

<style scoped>
.card-book {
    width: 100%;

    .dl-book-info {
        display: flex;
        flex-wrap: wrap;

        dt {
            width: 100px;
            text-align: right;
        }

        dd {
            width: calc(100% - 140px);
        }
    }

    &:hover {
        .card-title {
            display: block;
        }
    }

    .card-title {
        display: none;
    }
}



.card-book :deep(.arco-card-header) {
    border: none;
}
</style>