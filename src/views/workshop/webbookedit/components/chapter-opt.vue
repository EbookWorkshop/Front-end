<template>
    <div class="chapter-opt">
        <a-button-group :status="updateStatus" style="width: 100%;">
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
                        @click="gotoChapter(chapter.IndexId, true)">阅读</a-doption>
                    <a-doption>隐藏本章</a-doption>
                    <a-doption>编辑来源</a-doption>
                    <a-doption @click="OpenWin">打开来源网页</a-doption>
                    <a-doption>属性</a-doption>
                </template>
            </a-dropdown>
        </a-button-group>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
// import { queryWebBookChapterSourcesById } from '@/api/book';
import { openWindow } from '@/utils';

//类型
import type { WebChapter } from '@/types/book';

//操作
import useBookHelper from '@/hooks/book-helper';
const { gotoChapter } = useBookHelper();

//变量范围
const isChecked = ref(false);
//出参定义
const emit = defineEmits(['toggle']);

//入参定义
const props = defineProps<{
    chapter: WebChapter;
    status?: "normal" | "success" | "warning" | "danger" | undefined;
}>();

// console.log(props.chapter);

defineExpose({
    handleCheckIt: (checked: boolean) => { isChecked.value = checked; },
    handleChangeStatus: (status: "normal" | "success" | "warning" | "danger" | undefined) => { updateStatus.value = status; },
    getTitle: () => { return props.chapter.Title; }
})

let updateStatus = ref<"normal" | "success" | "warning" | "danger" | undefined>(props.chapter.IsHasContent ? 'normal' : 'warning');

//操作定义
function onToggle() {
    isChecked.value = !isChecked.value;
    emit("toggle", isChecked.value, props.chapter.IndexId);
}

function OpenWin() {
    let thisUrl = props.chapter.URL.filter(i => i.Path.includes(props.chapter.curHost));
    if (thisUrl.length > 0) openWindow(thisUrl[0].Path);
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