<template>
    <div class="chapter-opt">
        <a-button-group :status="chapter.IsHasContent?'normal':'warning'" style="width: 100%;">
            <a-button long type="dashed" class="chapter-title" @click="onToggle">
                <a-checkbox :model-value="isChecked">
                    {{ chapter.Title }}
                </a-checkbox>
            </a-button>
            <a-dropdown>
                <a-button type="dashed">
                    <icon-settings />
                </a-button>
                <template #content>
                    <a-doption :disabled="chapter.IsHasContent ? false : true"
                        @click="gotoChapter(chapter.IndexId,true)">阅读</a-doption>
                    <a-doption>隐藏本章</a-doption>
                    <a-doption>打开来源网页</a-doption>
                    <a-doption>属性</a-doption>
                </template>
            </a-dropdown>
        </a-button-group>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
//类型
import { Chapter } from '@/types/book';

//操作
import useBookHelper from '@/hooks/book-helper';
const { chapterId, gotoChapter } = useBookHelper();

//变量范围
const isChecked = ref(false);
//出参定义
const emit = defineEmits(['toggle']);

//入参定义
const props = defineProps<{
    chapter: Chapter;
}>();

defineExpose({
    handleCheckIt
})

function handleCheckIt(checked:boolean) {
    isChecked.value = checked;
}

//操作定义
function onToggle() {
    isChecked.value = !isChecked.value;
    emit("toggle", isChecked.value, props.chapter.IndexId);
}






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
    border-right: 0px;
}
</style>