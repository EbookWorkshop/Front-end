<template>
    <a-modal fullscreen :visible="modelValue" title="分割章节" @before-open="loadData(id ?? 0)" @ok="submit"
        @cancel="$emit('update:modelValue', false)">
        <a-form :model="formData" layout="vertical">
            <a-split :style="{
                height: '90vh',
                width: '100%',
                minWidth: '500px',
            }" min="80px">
                <template #first>
                    <a-form-item field="chapTitle" label="章节标题" style="padding-right: 10px;">
                        <a-input v-model="formData.chapTitle" />
                    </a-form-item>
                    <a-form-item field="content" label="章节正文" style="padding-right: 10px;">
                        <a-textarea v-model="formData.content" :auto-size="{ minRows: 20 }" show-word-limit />
                    </a-form-item>
                </template>
                <template #second>
                    <a-form-item field="nextTitle" label="新章节标题" style="padding-left: 10px;">
                        <a-input v-model="formData.nextTitle" />
                    </a-form-item>
                    <a-form-item field="nextContent" label="新章节正文" style="padding-left: 10px;">
                        <a-textarea v-model="formData.nextContent" :auto-size="{ minRows: 20 }" show-word-limit />
                    </a-form-item>
                </template>
            </a-split>
        </a-form>
    </a-modal>
</template>

<script setup lang="ts">
import { Book, Chapter } from "@/types/book";
import { reactive } from 'vue';
import { AxiosResponse } from 'axios';
import { Message } from "@arco-design/web-vue";
import {
    queryChapterById,
    restructureChapter,
} from '@/api/book';

const param = defineProps({
    modelValue: Boolean,
    id: Number,
    bookId: Number,
})
const emiter = defineEmits(['update:modelValue', 'submit'])

const formData = reactive({
    chapTitle: '',
    content: '',
    orderNum: 0,
    nextTitle: '',
    nextContent: '',
    nextOrderNum: 0,
})

const loadData = (cid: number) => {
    // isSplit.value = true;
    if (cid <= 0) return;
    formData.nextContent = "";
    formData.nextTitle = "";
    queryChapterById(cid).then((result: AxiosResponse<Chapter>) => {
        formData.chapTitle = result.data.Title as any
        formData.content = result.data.Content as any;
        formData.orderNum = result.data.OrderNum;
        formData.nextOrderNum = result.data.OrderNum + 1;
    }).catch(result => {
        // form.chapTitle = result.value;
    });
}

const submit = () => {
    let data = {
        bookId: param.bookId,
        baseChapter: {
            chapterId: param.id,
            content: formData.content,
            orderNum: formData.orderNum,
            title: formData.chapTitle,
        },
        operations: [{
            operationType: "create",
            chapters: [{
                content: formData.nextContent,
                orderNum: formData.nextOrderNum,
                title: formData.nextTitle,
            }]
        }]
    }
    restructureChapter(data).then(result => {
        Message.success('分割章节成功');
        // emiter('submit');
        emiter('update:modelValue', false);
    }).catch(err => {
        Message.error(`分割章节失败：${err}`);
        console.log(err);
    }).finally(() => {
    })
}

</script>