<template>
    <a-spin :loading="loading" tip="加载中..." :size="64" style="width: 100%; height: 100%">
        <a-row :gutter="20" align="stretch" justify="center">
            <a-col :span="2"></a-col>
            <a-col :span="3">
                <BookCover :loading="loading" :book-name="renderData.BookName" :cover-img="renderData.CoverImg"></BookCover>
            </a-col>
            <a-col :span="14" :offset="1">
                <a-row :gutter="20" align="center" justify="center">
                    <a-col :span="22" style="margin-top: 50px; text-align: left">
                        <a-typography-title>
                            {{ renderData.BookName }}</a-typography-title>
                    </a-col>
                    <a-col :span="14"> </a-col>
                </a-row>
                <a-row>
                    <!-- 书详情页面 -->
                    <a-col :offset="2">
                        <a-typography-text>作者：{{ renderData.Author }}</a-typography-text>
                    </a-col>
                    <a-col :offset="2">
                        <a-typography-text>简介：</a-typography-text>
                    </a-col>
                    <a-col>&nbsp;</a-col>
                </a-row>
            </a-col>
        </a-row>
        <a-row class="grid-chapter" style="margin-bottom: 16px">
            <a-col :span="20" :offset="2">
                <!-- loading用的骨架页 -->
                <a-row v-if="loading" :gutter="10">
                    <a-col v-for="i in [1, 2, 3, 4, 5, 6]" :key="i" :span="4">
                        <a-skeleton :animation="loading">
                            <a-skeleton-line :rows="8" :line-height="48" :line-spacing="10" />
                        </a-skeleton>
                    </a-col>
                </a-row>

                <a-grid :cols="{ xs: 1, sm: 2, md: 3, lg: 4, xl: 5, xxl: 6 }" :col-gap="12" :row-gap="16"
                    class="grid-demo-grid">
                    <!-- 阅读视图 阅读时的章节列表 -->
                    <a-grid-item v-for="item in renderData.Index" :key="item.IndexId" class="reading-index">
                        <a-tooltip :content="item.Title">
                            <a-button long class="chapter" @click="onClickChapter(item.IndexId)">
                                {{ item.Title }}
                            </a-button>
                        </a-tooltip>
                    </a-grid-item>
                </a-grid>
            </a-col>
        </a-row>
    </a-spin>
</template>


<script lang="ts" setup>
import {
    queryBookById,
    Book,
} from './../../api/book';
import useRequest from './../../hooks/request';
import useBookHelper from './../../hooks/book-helper';

import BookCover from './../book-cover/index.vue';


const { bookId, gotoChapter, gotoIndex } = useBookHelper();
const { loading, response: renderData } = useRequest<Book>(queryBookById.bind(null, bookId));


const emit = defineEmits(["ClickChapter"])

const onClickChapter = (cid: number) => {
    emit("ClickChapter", cid);
}

</script>