<template>
    <a-grid :cols="{ xs: 1, sm: 2, md: 3, lg: 4, xl: 5, xxl: 6 }" :colGap="6" :rowGap="16" class="">
        <a-grid-item class="" :span="{ xs: 1, sm: 1, md: 1, lg: 1, xl: 2, xxl: 1 }" :offset="{xl: 1, xxl: 1 }">
            <BookCover :loading="loading" :book-name="BookName" :cover-img="convertImg"></BookCover>
        </a-grid-item>
        <a-grid-item class="right-txt" :span="{ xs: 1, sm: 1, md: 2, lg: 2, xl: 2, xxl: 2 }">
            <a-row :gutter="20" align="center" justify="center">
                <a-col :span="22" style="margin-top: 50px; text-align: left">
                    <a-typography-title>{{ BookName }}</a-typography-title>
                </a-col>
            </a-row>
            <a-row>
                <!-- 书详情页面 -->
                <a-col :offset="2">
                    <a-typography-text>作者：{{ Author }}</a-typography-text>
                </a-col>
                <a-col :offset="2">
                    <a-typography-text>简介：</a-typography-text>
                </a-col>
                <a-col>&nbsp</a-col>
            </a-row>
            <slot name="toolbar"></slot>
        </a-grid-item>
    </a-grid>
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
