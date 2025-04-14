<template>
    <a-row align="end" justify="center">
        <a-space direction="vertical">
            <a-space>
                <a-button-group type="primary">
                    <a-button @click="() => { isOrdering = !isOrdering; emit('EditChapterOrdering', isOrdering); }"
                        :status="isOrdering ? 'success' : 'normal'"> {{ isOrdering ? "保存并退出排序" : "章节排序" }} </a-button>
                    <a-button @click="isEditBookInfo = true"> <icon-pen /> 元数据 </a-button>
                    <a-button @click="isFormatTitle = true"> 标题格式化 </a-button>
                    <a-button @click="checkDescriptions = true"> 内容重复检查 </a-button>
                    <a-button @click="showHiddenChapters"> 已隐藏章节 </a-button>

                </a-button-group>
            </a-space>
        </a-space>
    </a-row>
    <EditBookInfo :visible="isEditBookInfo" :bookId="bookid ?? 0" @cancel="isEditBookInfo = false" />
    <Descriptions :bookId="bookid ?? 0" :show="checkDescriptions" @close="checkDescriptions = false" />
    <FormatTitle v-model:visible="isFormatTitle" :bookId="bookid ?? 0" :chapters="chapters" />
</template>

<script lang="ts" setup>
import { ref, h } from 'vue';
import EditBookInfo from '@/components/book-info/edit.vue';
import Descriptions from '@/components/book-tool/duplicates.vue';
import FormatTitle from './FormatTitle.vue';
import type { Chapter } from "@/types/book";
import { ApiResultCode } from '@/types/global';
import { listHiddenChapters } from '@/api/book';
import { Button, Message, Modal, Table } from '@arco-design/web-vue';

const isEditBookInfo = ref(false);      //是否正在编辑书籍信息
const checkDescriptions = ref(false);
const isFormatTitle = ref(false);

const props = defineProps<{
    bookid: number | undefined;
    chapters: Array<Chapter>;
}>();


//状态区
const isOrdering = ref(false);//是否正在排序


//定义消息
const emit = defineEmits(["EditChapterOrdering"]);


function showHiddenChapters() {
    listHiddenChapters(props.bookid ?? 0).then(res => {
        console.log(res);
        if (res.code != ApiResultCode.Success) {
            Message.error(`展示隐藏章节接口出错：${res.msg}`);
            return;
        }

        // 定义表格列
        const columns = [
            { title: '章节名称', dataIndex: 'title' },
            { title: '章节ID', dataIndex: 'chapterIndex' },
            {
                title: '操作',
                slotName: 'optional',
                width: 100
            }
        ];

        // 转换数据结构
        const data = res.data.map(item => ({
            key: item.IndexId,
            title: item.Title == "Sys_Introduction_Chapter" ? "简介" : item.Title,
            chapterIndex: item.IndexId,
            rawData: item // 保留原始数据
        }));

        Modal.info({
            title: '已隐藏章节',
            draggable: true,
            width: 'auto',
            content: () => h(Table, {
                columns,
                data,
            }, {
                // 添加操作列插槽
                optional: ({ record }: any) => h(Button, {
                    size: 'small',
                    type: 'primary',
                    onClick: () => handleShowChapter(record.chapterIndex)
                }, '显示')
            })
        });

    });
}

function handleShowChapter(chapterId: number) {
    console.log(chapterId)
}
</script>
