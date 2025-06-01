<template>
    <a-modal width="auto" :visible="show" @before-open="loadData" @cancel="close" unmount-on-close draggable>
        <template #title> 重复内容检测 </template>
        <a-table :columns="columns" :data="resultData" show-empty-tree :default-expanded-keys="expandedKeys"
            style="margin-top: 20px" :stripe="true" :loading="loading" />
    </a-modal>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { HeatABook } from '@/api/library';
import { queryDuplicatesChapter } from '@/api/book';
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

const resultData = ref<any>([]);
const columns = [
    {
        title: '章节ID',
        dataIndex: 'id',
    },
    {
        title: '章节标题',
        dataIndex: 'title',
    },
    {
        title: '相似度',
        dataIndex: 'similarity',
    },
];


const loadData = async () => {
    loading.value = true;
    queryDuplicatesChapter(props.bookId).then((res: any) => {
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
                });
            }
            resultData.value.push(item);
        }

        HeatABook(props.bookId);
    }).finally(() => {
        loading.value = false;
    });
}

const emit = defineEmits(['close', 'confirm'])

const close = () => {
    // show.value = false
    // document.removeEventListener('keydown', onEscPress)
    emit('close')
}

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