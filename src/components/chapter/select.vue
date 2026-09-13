<template>
    <a-select v-if="!ChapterInVolume" :options="isReverse ? ChapterReverse : chapters"
        :field-names="{ value: 'IndexId', label: 'Title' }" :virtual-list-props="{ height: 200 }" allow-search>
        <template #option="{ data }">
            <span><icon-subscribe style="color:red;" v-if="bm?.includes(data.IndexId)" /> {{ data?.Title }}</span>
        </template>
    </a-select>
    <a-select v-else allow-search :filter-option="true">
        <!-- filter-option开启内置过滤，只显示匹配搜索词的选项，解决虚拟列表不能用的替代方案 -->
        <!-- :virtual-list-props="{ height: 200 }"  虚拟列表打开后，控件会显示空列表 -->
        <a-optgroup v-for="v in ChapterInVolume" :label="v.name">
            <a-option v-for="c in v.Chapters" :key="c.IndexId" :value="c.IndexId">
                &emsp;&emsp;<icon-subscribe style="color:red;" v-if="bm?.includes(c.IndexId)" />
                {{ c.Title }}
            </a-option>
        </a-optgroup>
    </a-select>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import type { Volume, Chapter } from '@/types/book';

const props = withDefaults(defineProps<{
    chapters: Chapter[];
    volume: Volume[];
    bookmark?: any[];
    isReverse?: boolean;
}>(), { isReverse: false, });

const bm = computed(() => { return props.bookmark?.map(b => b.ChapterId); });
const ChapterReverse = computed(() => {
    return [...props.chapters].reverse();
})
const ChapterInVolume = computed(() => {
    if (props.volume.length === 0) return null;
    let rsl = [];

    for (let v of props.volume) {
        let cs = props.chapters.filter((chapter) => chapter.VolumeId === v.VolumeId);
        if (cs.length === 0) continue;
        rsl.push({
            name: v.Title,
            Chapters: cs
        });
    }

    if (props.isReverse) {
        rsl.reverse();
        for (let v of rsl) {
            v.Chapters.reverse();
        }
    }

    return rsl;
});
</script>