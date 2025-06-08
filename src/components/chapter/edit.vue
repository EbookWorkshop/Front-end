<template>
    <!-- 编辑章节内容的弹出窗口 -->
    <a-modal fullscreen :visible="isShow" @cancel="emit('close')" :title="chapterId == -1 ? '新增章节' : form.chapTitle"
        @ok="() => { return toMergeChapterId > 0 ? onMergeChapter() : onSubmit() }" @before-open="InitData()">
        <a-form :model="form" layout="vertical">
            <a-form-item field="chapTitle" label="章节标题">
                <a-input v-model="form.chapTitle" />
            </a-form-item>
            <a-form-item field="content" label="章节正文">
                <a-textarea v-model="form.content" :auto-size="{ minRows: 20 }" show-word-limit />
            </a-form-item>
        </a-form>
    </a-modal>
</template>
<script setup lang="ts">
import { reactive, } from 'vue';
import { HeatABook } from '@/api/library';
import type { Chapter } from "@/types/book";
import {
    queryChapterById,
    editChapter,
    restructureChapter,
} from '@/api/book';
import { Message } from '@arco-design/web-vue';

const props = defineProps({
    isShow: {
        type: Boolean,
        default: false
    },
    bookId: {
        type: Number,
        default: -1
    },
    /**
     * 章节ID ,-1:新增章节
     */
    chapterId: {
        type: Number,
        default: -1
    },
    /**
     * 合并的章节ID
     */
    toMergeChapterId: {
        type: Number,
        default: -1
    }
});

const emit = defineEmits(['close', "reload"]);

//状态区
let defTitle: string = ""
let defContent: string = "";

const form = reactive({
    chapTitle: '',
    content: '',
});

async function InitData() {
    try {
        if (props.chapterId == -1) {
            form.chapTitle = defTitle = "";
            form.content = defContent = "";
            return;
        }
        let result = await queryChapterById(props.chapterId);
        form.chapTitle = result.data.Title as any
        form.content = result.data.Content as any;
        defTitle = result.data.Title;
        defContent = result.data.Content ?? "";

        if (props.toMergeChapterId > 0) {
            result = await queryChapterById(props.toMergeChapterId);
            form.content = form.content + result.data.Title + result.data.Content as any;
        }
    } catch (err: any) {
        form.chapTitle = err.message || err;
    }
}

/**
 * 提交修改-单独修改单独章节标题/内容
 */
const onSubmit = () => {
    // console.log("保存", deleteChapter)
    let result = {} as Chapter;
    let change = false;
    let reload = false;
    if (defTitle !== form.chapTitle) {
        change = true;
        result.Title = form.chapTitle;
        reload = true;
    }
    if (defContent !== form.content) {
        change = true;
        result.Content = form.content;
    }
    if (props.chapterId == -1) {    // 新增章节
        result.BookId = props.bookId;
        reload = true;
    }

    if (change) {
        result.IndexId = props.chapterId;
        editChapter(result).then(rsl => {
            // console.log(rsl);
            Message.success("更新成功！");
            HeatABook(props.bookId);
            emit('close');

            if (reload) {
                emit('reload');
            }
        });
        return;
    }
}


/**
 * 合并章节保存
 */
function onMergeChapter() {
    // console.log("合并章节保存", deleteChapter)
    if (props.toMergeChapterId <= 0) return;
    restructureChapter({
        "bookId": props.bookId,
        "baseChapter": {
            "chapterId": props.chapterId,
            "content": form.content,
            "title": form.chapTitle
        },
        "operations": [{
            "operationType": "delete",
            "chapters": [props.toMergeChapterId]
        }]
    }).then(rsl => {
        Message.success("更新成功！");
        HeatABook(props.bookId);
        emit('close');
    })
}
</script>