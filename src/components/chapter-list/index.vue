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
            <div v-else>
                <!-- 带卷的章节 -->
                <div v-for="volume in Volumes" :key="volume.VolumeId">
                    <VolumeBlock :volume="volume"
                        :Chapters="Chapters.filter(chapter => chapter.VolumeId === volume.VolumeId)"
                        :columnProps="columnProps">
                        <template #chapter="{ chapter }">
                            <slot name="chapter" :chapter="chapter"></slot>
                        </template>
                        <template #addChapterTool="{ columnSetting:columnProps}">
                            <slot name="addChapterTool" :volumeId="volume.VolumeId" :columnSetting="columnProps" :volumeTitle="volume.Title"></slot>
                        </template>
                    </VolumeBlock>
                </div>
                <!-- 不带卷的章节 -->
                <div v-if="ChaptersNotInVolume.length > 0">
                    <VolumeBlock :volume="ChaptersWithoutVolume" :Chapters="ChaptersNotInVolume" :columnProps="columnProps">
                        <template #chapter="{ chapter }">
                            <slot name="chapter" :chapter="chapter"></slot>
                        </template>
                        <template #addChapterTool="{ columnSetting:columnProps }">
                            <slot name="addChapterTool" :volumeId="-1" :columnSetting="columnProps" :volumeTitle="''"></slot>
                        </template>
                    </VolumeBlock>
                </div>
            </div>
        </a-col>
    </a-row>

</template>
<script lang="ts" setup>
import type { PropType } from "vue";
import { computed } from "vue";
import { mean } from '@/utils/math';
import type { Chapter, WebChapter, Volume } from '@/types/book';
import VolumeBlock from "./volume-block.vue";

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

const columnProps = computed(() => {
    let avgTitleLength = mean(props.Chapters.map(c => c.Title.length));
    if (avgTitleLength >= 16) {
        return {
            xs: 24,
            sm: 24,
            md: 24,
            lg: 24,
            xl: 12,
            xxl: 6,
        };
    }

    return {
        xs: 24,
        sm: 12,
        md: 8,
        lg: 6,
        xl: 5,
        xxl: 4
    };
});

const ChaptersNotInVolume = computed(() => props.Chapters.filter(chapter => !chapter.VolumeId));

/**
 * 不带卷的章节
 */
const ChaptersWithoutVolume = computed(() => {
    if(props.Volumes.length > 0) {
        return {
            VolumeId: -1,
            Title: ' -未指定卷-',
        } as Volume;
    }
    return null;
});
</script>
