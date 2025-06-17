<template>
    <a-modal width="auto" :visible="show" @before-open="loadData" @cancel="close" unmount-on-close draggable :maskClosable="false">
        <template #title> 重复内容检测 </template>
        <div>相似度：
            <a-slider :min="0" :max="1" :style="{ width: '100%' }" :format-tooltip="formatter" :step="0.0005"
                v-model="threshold" @change="onThresholdChange" :marks="stepMarks" />
        </div>
        <a-table :columns="columns" :data="resultData" show-empty-tree :default-expanded-keys="expandedKeys"
            style="margin-top: 20px" :stripe="true" :loading="loading">
            <template #optional="{ record, rowIndex }">
                <a-button v-if="record.similarity" @click="onCompare(record.originalId,record.id)">对比</a-button>
            </template>
        </a-table>
    </a-modal>
      <a-modal :visible="showDiff" fullscreen title="对比差异" unmount-on-close :footer="false"
        @cancel="showDiff = false">
        <Diff mode="split" :theme="appStore.theme as any" language="text" :left="diffLeft" :right="diffRight"
          style="height: 100%; width: 100%; overflow: scroll" />
      </a-modal>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { HeatABook } from '@/api/library';
import { queryDuplicatesChapter,queryChapterById } from '@/api/book';

import { useAppStore } from '@/store';

import Diff from '@/components/diff/index.vue'


const expandedKeys = ref<number[]>([]);
const loading = ref(false)
const props = defineProps({
    bookId: {
        type: Number,
        default: 0
    },
    show: {
        type: Boolean,
        default: false
    }
});
const threshold = ref(0.35); // 相似度阈值
const showDiff = ref(false);
const diffLeft = ref('');
const diffRight = ref('');
const resultData = ref<any>([]);
const columns = [
    {
        title: '章节ID',
        dataIndex: 'id',
    },
    {
        title: '章节标题',
        dataIndex: 'title',
        width: '400'
    },
    {
        title: '相似度',
        dataIndex: 'similarity',
    },
    {
        title: '操作',
        slotName: 'optional',
    },
];

const stepMarks = {
    0: '0%',
    0.25: '25%',
    0.5: '50%',
    0.75: '75%',
    1: '100%',
};
const appStore = useAppStore();

const loadData = async () => {
    loading.value = true;
    resultData.value = [];
    queryDuplicatesChapter(props.bookId, threshold.value).then((res: any) => {
        // results.value = res.data;
        for (let i = 0; i < res.data.length; i++) {
            let item = {
                key: i,
                id: res.data[i].original.id,
                title: res.data[i].original.title,
                children: [] as any[],
            };

            expandedKeys.value.push(i);
            for (let j = 0; j < res.data[i].duplicates.length; j++) {
                item.children.push({
                    key: j,
                    id: res.data[i].duplicates[j].id,
                    title: res.data[i].duplicates[j].title,
                    similarity: res.data[i].duplicates[j].similarity * 100 + '%',
                    originalId: res.data[i].original.id,
                });
            }
            resultData.value.push(item);
        }
        HeatABook(props.bookId);
    }).finally(() => {
        loading.value = false;
    });
}

let clockInterval = 0;//防抖
/**
 * 调整相似度阈值
 * @param value 
 */
function onThresholdChange(value: number) {
    if (clockInterval) {
        clearTimeout(clockInterval);
    }
    clockInterval = setTimeout(() => {
        threshold.value = value;
        loadData();
    }, 500);
}

function onCompare(fromId: number, toId: number) {
    showDiff.value= true;
    diffLeft.value = '';
    diffRight.value = '';

    queryChapterById(fromId).then((res: any) => {
        diffLeft.value = res.data.Content;
    });
    queryChapterById(toId).then((res: any) => {
        diffRight.value = res.data.Content;
    });
}

const emit = defineEmits(['close', 'confirm'])

const close = () => {
    // show.value = false
    // document.removeEventListener('keydown', onEscPress)
    emit('close')
}
const formatter = (value: number) => {
    return `${(value * 100).toFixed(1)}%`
};

</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s, transform 0.2s;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}
</style>