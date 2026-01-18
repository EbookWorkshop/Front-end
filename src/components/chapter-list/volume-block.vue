<template>
    <h3 class="volume-title" v-if="volume != null">
        {{ volume.Title }}
        <a-tooltip v-if="volume.Introduction" :content="volume.Introduction">
            <icon-archive style="font-size:1.2em" />
        </a-tooltip>
    </h3>

    <a-row :gutter="[4, 4]" class="chapter-list">
        <a-col v-for="item in Chapters" :key="item.IndexId" v-bind="columnProps">
            <a-tooltip v-if="item.Title.length > 13" :content="item.Title">
                <slot name="chapter" :chapter="item"></slot>
            </a-tooltip>
            <slot v-else name="chapter" :chapter="item"></slot>
        </a-col>
        <slot name="addChapterTool" :volumeId="volume?.VolumeId" :columnSetting="columnProps"></slot>
    </a-row>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue';
import type { Chapter, WebChapter, Volume } from '@/types/book';

const props = defineProps({
    volume: {
        type: Object as PropType<Volume | null>,
        required: true
    },
    Chapters: {
        type: Array as PropType<Chapter[] | WebChapter[]>,
        default: () => []
    },
    columnProps: {
        type: Object as PropType<Record<string, any>>,
        required: true
    }
});
</script>
<style lang="less" scoped>
.volume-title {
    margin-top: 16px;
    margin-bottom: 8px;
    padding-left: 8px;
    border-left: 4px solid red;
    font-size: 1.2em;
    font-weight: bold;
}
</style>