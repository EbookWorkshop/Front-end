<template>
    <div class="chapter-opt">
        <a-button-group :status="status" style="width: 100%;">
            <a-button long type="dashed" class="chapter-title" @click="onToggle">
                <a-checkbox :model-value="checked">
                    {{ chapter.Title }}
                </a-checkbox>
            </a-button>
            <a-dropdown :popup-max-height="false">
                <a-button type="dashed">
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

        <a-modal v-model:visible="isUrlDialogVisible" :title="`来源管理-【${chapter.Title}】`" @ok="handleUrlConfirm"
            width="50%" draggable unmount-on-close @before-open="loadUrlData">
            <a-table :data="urlList" :pagination="false">
                <template #columns>
                    <a-table-column title="操作" :width="180">
                        <template #cell="{ rowIndex }">
                            <template v-if="editingIndex !== rowIndex">
                                <a-button type="text" @click="startEdit(rowIndex)">编辑</a-button>
                                <a-popconfirm content="确认删除？此操作将无法恢复！" @ok="handleDeleteUrl(rowIndex)">
                                    <a-button status="danger">删除</a-button>
                                </a-popconfirm>
                            </template>
                            <template v-else>
                                <a-button type="text" @click="saveEdit(rowIndex)">保存</a-button>
                                <a-button type="text" @click="cancelEdit">取消</a-button>
                            </template>
                        </template>
                    </a-table-column>
                    <a-table-column title="路径">
                        <template #cell="{ record, rowIndex }">
                            <a-input v-if="editingIndex === rowIndex" v-model="urlList[rowIndex].Path"
                                placeholder="请输入URL" style="width: 100%" />
                            <span v-else>{{ record.Path }}</span>
                        </template>
                    </a-table-column>
                </template>
            </a-table>
        </a-modal>

        <ChapterEdit :isShow="isEdit" :bookId="chapter.BookId" :chapterId="chapter.IndexId" @close="isEdit = false"
            @reload="" />
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { updateWebBookChapterSourcesById, getDefaultChapterSource, getChapterSource } from '@/api/book';
import { openWindow } from '@/utils';
import ChapterEdit from "@/components/chapter/edit.vue";
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
    status?: "normal" | "success" | "warning" | "danger" | undefined;
}>();


// URL 管理相关状态
const isUrlDialogVisible = ref(false);
const editingIndex = ref(-1);
const urlList = ref<Array<{ id: number, Path: string }>>([]);

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

async function loadUrlData() {
    const urlData = await getChapterSource(props.chapter.IndexId);
    urlList.value = urlData.data;
}

const startEdit = (index: number) => {
    editingIndex.value = index;
};

const cancelEdit = () => {
    editingIndex.value = -1;
};

const saveEdit = (index: number) => {
    editingIndex.value = -1;
    const { id, Path } = urlList.value[index];
    let urlSetting = { id: id, url: Path }
    // console.log(urlSetting);
    updateWebBookChapterSourcesById(urlSetting).then((res) => {
        // console.log(res);
    })
    // 这里可以添加即时保存逻辑，或保持原确认按钮统一保存
};

// 修改删除逻辑添加确认提示
const handleDeleteUrl = (index: number) => {
    // Message.confirm({
    //     title: '确认删除',
    //     content: '确定要删除这个URL吗？',
    //     onOk: () => {
    //         urlList.value.splice(index, 1);
    //     }
    // });
};

const handleUrlConfirm = () => {

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

.arco-modal-body {
    max-height: 60vh;
    overflow-y: auto;
}
</style>