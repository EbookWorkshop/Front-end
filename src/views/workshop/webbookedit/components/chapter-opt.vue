<template>
    <div class="chapter-opt">
        <a-button-group style="width: 100%;">
            <a-button long type="dashed" class="chapter-title" :class="statu_color" @click="onToggle">
                <a-checkbox :model-value="checked">
                    {{ chapter.Title }}
                </a-checkbox>
            </a-button>
            <a-dropdown :popup-max-height="false">
                <a-button type="dashed" :class="statu_color">
                    <icon-settings />
                </a-button>
                <template #content>
                    <a-doption :disabled="!chapter.IsHasContent"
                        @click="gotoChapter(chapter.IndexId, true)">阅读</a-doption>
                    <a-doption @click="onToggleHideChapter">隐藏本章</a-doption>
                    <a-doption @click="isUrlDialogVisible = true">管理来源</a-doption>
                    <a-doption @click="OpenWin">打开来源网页</a-doption>
                    <a-doption @click="isEdit = true">直接录入/修正</a-doption>
                </template>
            </a-dropdown>
        </a-button-group>

        <ChapterSourceManager v-model:visible="isUrlDialogVisible" :chapter-id="chapter.IndexId"
            :chapter-title="chapter.Title" />

        <ChapterEdit :isShow="isEdit" :bookId="chapter.BookId" :chapterId="chapter.IndexId" @close="isEdit = false"
            @reload="" />
    </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import { updateWebBookChapterSourcesById, getDefaultChapterSource, getChapterSource } from '@/api/book';
import { openWindow } from '@/utils';
import ChapterEdit from "@/components/chapter/edit.vue";
import ChapterSourceManager from './chapter-source-manager.vue';

//类型
import type { WebChapter } from '@/types/book';

//操作
import useChapterHiddenHelper from "@/hooks/chapter-hidden";
import useBookHelper from '@/hooks/book-helper';
const { gotoChapter } = useBookHelper();
const { toggleChapterHidden } = useChapterHiddenHelper();

//变量范围
const isEdit = ref(false);

//出参定义
const emit = defineEmits(['toggle', 'hide']);

//入参定义
const props = defineProps<{
    chapter: WebChapter;
    checked: boolean;          // 是否被选中
    status?: "normal" | "success" | "error" | "empty" | "processing";
}>();

// URL 管理相关状态
const isUrlDialogVisible = ref(false);
const editingIndex = ref(-1);
const urlList = ref<Array<{ id: number, Path: string }>>([]);

const statu_color = computed(() => {
    let s = props.status ?? "normal";
    return `statu-color-${s}`;
});

//操作定义
/**
 * 切换选中状态
 */
function onToggle() {
    // 不再修改内部状态，直接通知父组件
    emit('toggle', !props.checked, props.chapter.IndexId);
}

function onToggleHideChapter() {
    toggleChapterHidden(props.chapter.IndexId).then(() => {
        emit('hide', props.chapter.IndexId);
    });
}

async function OpenWin() {
    const { IndexId, BookId } = props.chapter;
    const defUrl = await getDefaultChapterSource(IndexId, BookId || 0)
    const url = defUrl.data.Path;
    if (url) openWindow(url)
}

</script>

<style lang="css" scoped>
.chapter-opt {
    overflow: hidden;
    width: 100%;
    display: flex;
}

.statu-color-normal {
    background-color: var(--color-secondary-disabled) !important;
}

.statu-color-processing {
    background-color: var(--color-primary-light-2) !important;
}

.statu-color-error {
    background-color: var(--color-danger-light-1) !important;
}

.statu-color-empty {
    background-color: var(--color-warning-light-1) !important;
}

.statu-color-success {
    background-color: var(--color-success-light-1) !important;
}

.chapter-opt .chapter-title {
    flex-grow: 1;
    justify-content: flex-start;
    max-width: 82%;
    overflow: hidden;
    border-right: 0px;
}

.arco-modal-body {
    max-height: 60vh;
    overflow-y: auto;
}
</style>