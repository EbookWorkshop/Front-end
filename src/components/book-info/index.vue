<template>
    <a-row :gutter="20" align="stretch" justify="center">
        <a-col :span="2"></a-col>
        <a-col :span="3">
            <BookCover :loading="loading" :book-name="BookName" :cover-img="convertImg">
            </BookCover>
        </a-col>
        <a-col :span="14" :offset="1">
            <a-row :gutter="20" align="center" justify="center">
                <a-col :span="22" style="margin-top: 50px; text-align: left">
                    <a-typography-title>
                        {{ BookName }}</a-typography-title>
                </a-col>
                <a-col :span="14"> </a-col>
            </a-row>
            <a-row>
                <!-- 书详情页面 -->
                <a-col :offset="2">
                    <a-typography-text>作者：{{ Author }}</a-typography-text>
                </a-col>
                <a-col :offset="2">
                    <a-typography-text>简介：???</a-typography-text>
                </a-col>
                <a-col>&nbsp</a-col>
            </a-row>
            <slot name="toolbar"></slot>
        </a-col>
    </a-row>
</template>
<script lang="ts" setup>
import BookCover from '@/components/book-cover/index.vue';

const props = defineProps<{
    loading: boolean;
    bookId: number;
    BookName: string | undefined;
    convertImg: string | undefined;
    Author: string | undefined;
}>();
</script>