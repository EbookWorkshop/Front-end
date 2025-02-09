<template>
    <a-row class="grid-chapter" style="margin-bottom: 16px">
        <a-col :span="20" :offset="2">
            <!-- loading用的骨架页 -->
            <a-row v-if="loading" :gutter="10">
                <a-col v-for="i in [1, 2, 3, 4, 5, 6]" :key="i" :span="4">
                    <a-skeleton :animation="loading">
                        <a-skeleton-line :rows="8" :line-height="48" :line-spacing="10" />
                    </a-skeleton>
                </a-col>
            </a-row>

            <a-grid v-else :cols="Chapters.length < 50 ? 4 : { xs: 1, sm: 2, md: 3, lg: 4, xl: 5, xxl: 6 }" :col-gap="12"
                :row-gap="16" class="chapter-list">
                <!-- 阅读视图 阅读时的章节列表 -->
                <a-grid-item v-for="item in Chapters" :key="item.IndexId" class="reading-index">
                    <a-tooltip v-if="item.Title.length > 13" :content="item.Title">
                        <slot name="content" :item="item"></slot>
                    </a-tooltip>
                    <slot v-else name="content" :item="item"></slot>
                </a-grid-item>
                <a-grid-item>
                    <slot name="addChapterTool"></slot>
                </a-grid-item>
            </a-grid>
        </a-col>
    </a-row>

</template>
<script lang="ts" setup>
//类型引入
import { Chapter } from '@/types/book';

const props = defineProps({
    loading: {
        type: Boolean,
        default: false
    },
    Chapters: {
        type: Array as () => Chapter[],
        default: []
    }
});

</script>