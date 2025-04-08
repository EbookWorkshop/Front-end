<template>
    <div class="chapter-opt">
        <a-button-group :status="updateStatus" style="width: 100%;">
            <a-button long type="dashed" class="chapter-title" @click="onToggle">
                <a-checkbox :model-value="isChecked">
                    {{ chapter.Title }}
                </a-checkbox>
            </a-button>
            <a-dropdown :popup-max-height="false">
                <a-button type="dashed">
                    <icon-settings />
                </a-button>
                <template #content>
                    <a-doption :disabled="chapter.IsHasContent ? false : true"
                        @click="gotoChapter(chapter.IndexId, true)">阅读</a-doption>
                    <a-doption @click="onToggleHideChapter(chapter.IndexId)">隐藏本章</a-doption>
                    <a-doption @click="isUrlDialogVisible = true">管理来源</a-doption>
                    <a-doption @click="OpenWin">打开来源网页</a-doption>
                    <a-doption @click="isEdit = true">直接录入/修正</a-doption>
                    <a-doption>属性</a-doption>
                </template>
            </a-dropdown>
        </a-button-group>

        <!-- 原有按钮组保持不变... -->
        <a-modal v-model:visible="isUrlDialogVisible" :title="`来源管理-【${chapter.Title}】`" @ok="handleUrlConfirm"
            width="50%" draggable unmount-on-close>
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
import { updateWebBookChapterSourcesById, toggleChapterHide, } from '@/api/book';
import { openWindow } from '@/utils';
import { Message } from '@arco-design/web-vue';
import ChapterEdit from "@/components/chapter/edit.vue";

//类型
import type { WebChapter } from '@/types/book';
import type { HttpResponse } from '@/types/global';
import { ApiResultCode } from '@/types/global';

//操作
import useBookHelper from '@/hooks/book-helper';
const { gotoChapter } = useBookHelper();

//变量范围
const isChecked = ref(false);
const isEdit = ref(false);

//出参定义
const emit = defineEmits(['toggle', 'hide']);

//入参定义
const props = defineProps<{
    chapter: WebChapter;
    status?: "normal" | "success" | "warning" | "danger" | undefined;
}>();


// URL 管理相关状态
const isUrlDialogVisible = ref(false);
// const urlForm = reactive({ path: '' });
const editingIndex = ref(-1);
const urlList = ref<Array<{ id: number; Path: string }>>([...props.chapter.URL]);

defineExpose({
    handleCheckIt: (checked: boolean) => { isChecked.value = checked; },
    handleChangeStatus: (status: "normal" | "success" | "warning" | "danger" | undefined) => { updateStatus.value = status; },
    getTitle: () => { return props.chapter.Title; },
})

let updateStatus = ref<"normal" | "success" | "warning" | "danger" | undefined>(props.chapter.IsHasContent ? 'normal' : 'warning');

//操作定义
/**
 * 切换选中状态
 */
function onToggle() {
    isChecked.value = !isChecked.value;
    emit("toggle", isChecked.value, props.chapter.IndexId);
}

/**
 * 切换章节隐藏状态
 * @param {number} cid 章节ID
 */
function onToggleHideChapter(cid: number) {
    toggleChapterHide(cid).then((result: HttpResponse<boolean>) => {
        if (result.code == ApiResultCode.Success) {
            Message.success("已隐藏");
            emit("hide");
        } else Message.error("隐藏章节失败：" + result.msg)
    }).catch(err => {
        Message.error("隐藏章节出错：" + err);
    })
}

function OpenWin() {
    let thisUrl = props.chapter.URL.filter(i => i.Path.includes(props.chapter.curHost));
    if (thisUrl.length > 0) openWindow(thisUrl[0].Path);
}


const startEdit = (index: number) => {
    editingIndex.value = index;
};

const cancelEdit = () => {
    editingIndex.value = -1;
};

const saveEdit = (index: number) => {
    editingIndex.value = -1;

    // console.log(urlList.value[index], props.chapter.URL[index]);
    // if (urlList.value[index].Path == props.chapter.URL[index].Path) return;

    let urlSetting = {
        id: urlList.value[index].id,
        url: urlList.value[index].Path
    }
    console.log(urlSetting);
    updateWebBookChapterSourcesById(urlSetting).then((res) => {
        console.log(res);
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