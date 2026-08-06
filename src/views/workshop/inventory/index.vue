<template>
    <div class="container">
        <Breadcrumb :items="['menu.workplace', 'menu.workshop.export.inventory']" />
        <div class="wrapper">
            <a-spin :spinning="loading" style="width: 100%;">
                <div
                    style="margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center;padding: 0 10%;">
                    <div>
                        文件数：<a-statistic :value="data.length"></a-statistic>，总大小：
                        <a-statistic :value="(data.reduce((acc, cur) => acc + cur.size, 0) / 1024 / 1024)"
                            :precision="2" :value-style="{ color: '#0fbf60' }">
                            <template #suffix>MB</template>
                        </a-statistic>
                    </div>
                    <div>
                        <a-button-group>
                            <a-button size="large" @click="refresh">刷新</a-button>
                            <a-dropdown @select="(value) => SortTheList(true, value as string)">
                                <a-button size="large"> <template #icon><icon-sort-ascending /></template> 升序</a-button>
                                <template #content>
                                    <a-doption value="name">名字</a-doption>
                                    <a-doption value="size">大小</a-doption>
                                    <a-doption value="date">日期</a-doption>
                                    <a-doption value="type">类型</a-doption>
                                </template>
                            </a-dropdown>
                            <a-button size="large" @click="SortToGroup">分组</a-button>
                            <a-dropdown @select="(value) => SortTheList(false, value as string)">
                                <a-button size="large"> <template #icon><icon-sort-descending /></template>
                                    降序</a-button>
                                <template #content>
                                    <a-doption value="name">名字</a-doption>
                                    <a-doption value="size">大小</a-doption>
                                    <a-doption value="date">日期</a-doption>
                                    <a-doption value="type">类型</a-doption>
                                </template>
                            </a-dropdown>
                        </a-button-group>
                    </div>
                </div>
                <a-empty v-if="data.length === 0" />
                <a-card :bordered="false" :style="{ width: '100%' }" v-for="ext of GroupExt" :key="ext">
                    <a-divider v-if="ext !== ``" orientation="left">{{ ext.toUpperCase() }}</a-divider>
                    <a-card-grid v-for="(item, index) in data.filter(i => i.ext === ext || ext === ``)" :key="index"
                        :hoverable="true" :style="{ margin: '10px 10px', width: '340px' }">
                        <a-card :class="['card-book', item.ext]" :title="item.name" :bordered="false">
                            <template #extra>
                                <a-dropdown>
                                    <a-button class="card-opt">操作</a-button>
                                    <template #content>
                                        <a-doption @click="DownLoad(item.filePath)">下载</a-doption>
                                        <a-doption @click="SendByMail(item.filePath)">发送</a-doption>
                                        <a-doption @click="OpenReader(item.filePath, item.ext)">查看</a-doption>
                                        <a-doption @click="Rename(item)">重命名</a-doption>
                                        <a-doption @click="Delete(item.file)">删除</a-doption>
                                    </template>
                                </a-dropdown>
                            </template>
                            <dl class="dl-book-info">
                                <dt>文件类型</dt>
                                <dd>{{ item.ext }}</dd>
                                <dt>大小</dt>
                                <dd>{{ (item.size / 1024 / 1024).toFixed(2) }} MB （ {{ item.size }} B）</dd>
                                <dt>创建时间</dt>
                                <dd>{{ item.createTime }}</dd>
                            </dl>
                        </a-card>
                    </a-card-grid>
                </a-card>
            </a-spin>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { h, ref } from 'vue';
import { useRouter } from 'vue-router';
import { getArchiveBookList, deleteArchiveBook, editArchiveBook } from '@/api/book';
import { sendAEMail } from '@/api/system'
import type { FileInfo } from '@/types/book';
import useRequest from '@/hooks/request';
import { getApiBaseUrl } from '@/utils/config';
import { Modal, Input, Button } from '@arco-design/web-vue';

const ASSETS_HOST = getApiBaseUrl();
const router = useRouter();
const GroupExt = ref<Set<string>>(new Set([""]));
const { response: data, loading, reload:refresh } = useRequest<FileInfo[]>(getArchiveBookList);

function SortTheList(ascending: boolean, sortBy: string) {
    loading.value = true;
    data.value = [...data.value].sort((a, b) => {
        let comparison = 0;
        if (sortBy === 'name') {
            comparison = a.name.localeCompare(b.name);
        } else if (sortBy === 'size') {
            comparison = a.size - b.size;
        } else if (sortBy === 'date') {
            comparison = new Date(a.createTime).getTime() - new Date(b.createTime).getTime();
        } else if (sortBy === 'type') {
            comparison = a.ext.localeCompare(b.ext);
        }
        return ascending ? comparison : -comparison;
    });
}

function DownLoad(filePath: string) {
    window.open(`${ASSETS_HOST}/assets/download/${encodeURIComponent(filePath)}`);
}

function OpenReader(filePath: string, fileType: string) {
    if (fileType === 'epub') window.open(`/reader/${ASSETS_HOST}/assets/download/${encodeURIComponent(encodeURIComponent(filePath))}`);
    else if (fileType === "txt") {
        router.push({
            path: '/reader/txt',
            query: { name: filePath.split('/').pop()?.split(".").shift(), path: filePath }
        });
    }
    else window.open(`${ASSETS_HOST}/assets/view/${encodeURIComponent(filePath)}`);
}

function SendByMail(filePath: string) {
    const eMailForm = new FormData();
    eMailForm.append('filePath', JSON.stringify([filePath]));
    sendAEMail(eMailForm).then((response) => {
        Modal.success({
            title: '发送成功',
            content: `书籍已成功发送，请注意查收。\n${filePath}`,
            okText: '确认',
        });
    });
}

function Rename(item: FileInfo) {
    const m = Modal.open({
        title: `重命名 - ${item.name}`,
        content: () => h({
            setup() {
                const newName = ref(item.name);
                const onClick = () => {
                    editArchiveBook(newName.value, item.file).then(() => {
                        m.close();
                    });
                };
                return () => h('div', { class: 'info-modal-content' }, [
                    h('span', { style: 'margin-bottom: 10px; display: block;' }, '请输入新名字：'),
                    h(Input, {
                        modelValue: newName.value,
                        'onUpdate:modelValue': (v: string) => { newName.value = v; }
                    }),
                    h(Button, { type: 'primary', status: 'success', onClick }, '重命名')
                ])
            },
        }),
    });
}

function Delete(fileName: string) {
    Modal.warning({
        title: '删除书籍',
        content: `确定要删除书籍《${fileName}》吗？ `,
        okText: '确认删除',
        cancelText: '取消',
        hideCancel: false,
        onOk() {
            deleteArchiveBook(fileName).then(() => {
                data.value = data.value.filter(item => item.file !== fileName);
            });
        }
    });
}
function SortToGroup() {
    GroupExt.value = new Set(GroupExt.value.size === 1 ? data.value.map(({ ext }) => ext) : [""]);
}

</script>

<style scoped>
.card-book {
    width: 100%;
    border: 2px solid transparent;

    &.pdf {
        border-color: rgba(231, 76, 60, 0.3);
    }

    &.txt {
        border-color: rgba(15, 191, 96, 0.3);
    }

    &.epub {
        border-color: rgba(52, 152, 219, 0.3);
    }

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

    &:hover,
    &:active {
        .card-opt {
            visibility: visible;
        }
    }

    .card-opt {
        visibility: hidden;
    }
}

.card-book :deep(.arco-card-header) {
    border: none;
}
</style>