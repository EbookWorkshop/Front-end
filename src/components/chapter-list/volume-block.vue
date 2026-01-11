<template>
    <h3 class="volume-title" v-if="volume != null">{{ volume.Title }}</h3>
    <a-row :gutter="[4, 4]" class="chapter-list"><!-- 不带卷的章节 -->
        <a-col v-for="item in Chapters" :key="item.IndexId" v-bind="columnProps">
            <a-tooltip v-if="item.Title.length > 13" :content="item.Title">
                <slot name="chapter" :chapter="item"></slot>
            </a-tooltip>
            <slot v-else name="chapter" :chapter="item"></slot>
        </a-col>
        <a-col v-bind="columnProps">
            <slot name="addChapterTool" :volumeId="volume?.VolumeId"></slot>
        </a-col>
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
