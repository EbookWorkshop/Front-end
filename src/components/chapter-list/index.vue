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

            <!-- 使用Grid当GridItem超过101个会在控制台得到一个报错：Maximum recursive updates exceeded in component <Grid>. 所以改用Row -->
            <!-- 带卷的章节 -->
            <div v-else>
                <div v-for="volume in Volumes" :key="volume.id">
                    <h3 class="volume-title">{{ volume.Title }}</h3>
                    <a-row :gutter="[4, 4]" class="chapter-list"><!-- 不带卷的章节 -->
                        <a-col v-for="item in Chapters.filter(chapter => chapter.VolumeId === volume.id)"
                            :key="item.IndexId" :xs="24" :sm="12" :md="8" :lg="6" :xl="5" :xxl="4">
                            <a-tooltip v-if="item.Title.length > 13" :content="item.Title">
                                <slot name="content" :item="item"></slot>
                            </a-tooltip>
                            <slot v-else name="content" :item="item"></slot>
                        </a-col>
                    </a-row>
                </div>
                <a-row :gutter="[4, 4]" class="chapter-list"><!-- 不带卷的章节 -->
                    <a-col v-for="item in Chapters.filter(chapter => !chapter.VolumeId)" :key="item.IndexId" :xs="24"
                        :sm="12" :md="8" :lg="6" :xl="5" :xxl="4">
                        <a-tooltip v-if="item.Title.length > 13" :content="item.Title">
                            <slot name="content" :item="item"></slot>
                        </a-tooltip>
                        <slot v-else name="content" :item="item"></slot>
                    </a-col>
                    <a-col :xs="24" :sm="12" :md="8" :lg="6" :xl="5" :xxl="4">
                        <slot name="addChapterTool"></slot>
                    </a-col>
                </a-row>
            </div>
        </a-col>
    </a-row>

</template>
<script lang="ts" setup>
import type { PropType } from "vue";
//类型引入
import { Chapter, WebChapter, Volume } from '@/types/book';

const props = defineProps({
    loading: {
        type: Boolean,
        default: false
    },
    Chapters: {
        type: Array as PropType<Chapter[] | WebChapter[]>,
        default: () => []
    },

    Volumes: {
        type: Array as PropType<Volume[]>,
        default: () => []
    },
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