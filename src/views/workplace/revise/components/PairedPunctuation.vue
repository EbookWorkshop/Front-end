<script lang="ts" setup>
import { ref } from "vue";
import { queryPairedPunctuation } from '@/api/book';

const props = defineProps({
    visible: Boolean,
    bookId: Number,
})

const emit = defineEmits(['update:visible']);
const showData = ref<any[]>();

function loadData(bookId: number) {
    queryPairedPunctuation(bookId, null).then(result => {
        let tempData = [] as any[];
        result.data.map((item: { CheckResult: { ChapterName: string; SpanNum: number | undefined }[]; ChapterName: any; }) => {
            item.CheckResult[0].SpanNum = item.CheckResult.length;
            tempData.push(...item.CheckResult.map((record: { ChapterName: any; }) => {
                record.ChapterName = item.ChapterName;
                return record;
            }));
        });
        showData.value = tempData;
    }).catch(error => {
        showData.value = [];
        console.error('Failed to load paired punctuation:', error);
    });
}

function close() {
    emit('update:visible', false);
}

function spanMethod({ record, column }: { record: any; column: any; }) {
    if (column.dataIndex === 'ChapterName') return { rowspan: record.SpanNum };
}
</script>

<template>
    <a-modal fullscreen :visible="visible" title="标点配对检查" @before-open="loadData(bookId ?? 0)" @ok="close"
        @cancel="close">
        <a-table :data="showData" :pagination="false" :span-method="spanMethod" :sticky-header="true">
            <template #columns>
                <a-table-column title="章节" data-index="ChapterName" :width="'38.2%'"></a-table-column>
                <a-table-column title="结果">
                    <a-table-column title="标点" data-index="Punctuation"></a-table-column>
                    <a-table-column title="左标点计数" data-index="LeftCount"></a-table-column>
                    <a-table-column title="右标点计数" data-index="RightCount"></a-table-column>
                </a-table-column>
            </template>
        </a-table>
    </a-modal>
</template>
<style lang="css">
.arco-modal-body {
    padding-top: 0px;
}
</style>