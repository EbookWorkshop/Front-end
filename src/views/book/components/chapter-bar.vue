<template>
    <a-button-group style="align-items: stretch; width: 100%" :status="indexOptionMap.get(item.IndexId)?.isError
        ? 'danger'
        : item.IsHasContent ||
            indexOptionMap.get(item.IndexId)?.isHasContent
            ? 'normal'
            : 'warning'
        " :title="item.Title">
        <a-button long type="dashed" class="chapter" @click="changeChapterIsCheck(item.IndexId)">
            <a-checkbox :model-value="indexOptionMap.get(item.IndexId)?.isCheck">
                {{ item.Title }}
            </a-checkbox>
        </a-button>

        <a-button type="dashed" size="large" style="height: unset !important" @click="showeditmenu(item.IndexId)">
            <template #icon>
                <icon-settings />
            </template>
        </a-button>
    </a-button-group>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { ChapterStatus, Chapter } from '@/types/book';

export default defineComponent({
    name: 'ChapterBar',
    props: {
        item: {
            type: Object as PropType<Chapter>,
            required: true
        },
        indexOptionMap: {
            type: Map as PropType<Map<number, { isError: boolean; isHasContent: boolean; isCheck: boolean }>>,
            required: true
        }
    },
    methods: {
        changeChapterIsCheck(indexId: number) {
            // Implement the method to change the chapter check status
            this.$emit('chapterCheckChanged', indexId);
        },
        showeditmenu(indexId: number) {
            // Implement the method to show the edit menu
        }
    }
});
</script>

<style scoped>
.chapter-bar {
    width: 100%;
}
</style>