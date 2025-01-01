<template>
    <div class="chapter-opt">
        <a-button long type="dashed" class="chapter-title">
            <a-checkbox :model-value="false">
                {{ chapter.Title }}
            </a-checkbox>
        </a-button>
        <a-dropdown class="setting-dropdown">
            <a-button>
                <icon-settings />
            </a-button>
            <template #content>
                <a-doption :disabled="chapter.IsHasContent ? false : true" @click="gotoChapter(chapter.IndexId)">阅读</a-doption>
                <a-doption>隐藏本章</a-doption>
                <a-doption>打开来源网页</a-doption>
                <a-doption>属性</a-doption>
            </template>
        </a-dropdown>
    </div>
</template>

<script lang="ts" setup>

import { Chapter } from '@/types/book';

import useBookHelper from '@/hooks/book-helper';

const { chapterId, gotoChapter, gotoIndex } = useBookHelper();

defineProps<{
    chapter: Chapter;
}>();

</script>
<style lang="css" scoped>
.chapter-opt {
    overflow: hidden;
    width: 100%;
    display: flex;
}

.chapter-opt .chapter-title {
    flex-grow: 1;
    justify-content: flex-start;
    max-width: 82%;
    overflow: hidden;
}

.chapter-opt .setting-dropdown {
    flex-grow: 0;
}
</style>