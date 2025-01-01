<template>
    <div class="container">
        <Breadcrumb :items="['menu.library', 'menu.library.manage']" />
        <div class="wrapper">
            <ProcessBar :bookid="bookId" :begin-percent="curDoingProcent" />
            <a-spin :loading="loading" tip="加载中..." :size="64" style="width: 100%; height: 100%">
                <BookInfo :loading="loading" :bookId="bookId" :BookName="renderData.BookName"
                    :convertImg="renderData.CoverImg" :Author="renderData.Author">
                    <template #toolbar>
                        <a-row justify="start">
                            <a-col>
                                <a-space wrap>
                                    <a-select :style="{ width: '160px' }" placeholder="数据来源"
                                        :trigger-props="{ autoFitPopupMinWidth: true }">
                                        <a-option v-for="s of bookSourcesData" :key="s.Path as string"
                                            @click="open(s.Path as string)">{{
                                                s.Path }}</a-option>
                                    </a-select>
                                    <a-button type="primary" size="large" @click="mergeIndex">
                                        <icon-loop />同步目录
                                    </a-button>

                                    <a-badge :max-count="20000" :count="chapterHasCheckedNum">
                                        <a-dropdown-button type="primary" size="large" status="warning"
                                            style="align-items: stretch" @click="checkEmptyChapter">
                                            选中空章节
                                            <template #icon>
                                                <icon-down />
                                            </template>
                                            <template #content>
                                                <a-doption @click="checkAllChapter">选中全部章节</a-doption>
                                                <a-doption @click="cleanAllChapter">清空已选</a-doption>
                                                <a-doption
                                                    @click="checkAllChapterAfterFirstChecked">已选章节后续全选中</a-doption>
                                                <a-doption @click="checkNextChapter(10, 1)">选中已选章节后续10个</a-doption>
                                                <a-doption @click="checkNextChapter(20, 1)">选中已选章节后续20个</a-doption>
                                                <a-doption @click="checkNextChapter(100, 1)">选中已选章节后续100个</a-doption>
                                                <a-doption @click="checkNextChapter(10, 2)">选中空章节后续10个</a-doption>
                                                <a-doption @click="checkNextChapter(20, 2)">选中空章节后续20个</a-doption>
                                            </template>
                                        </a-dropdown-button>
                                    </a-badge>

                                    <a-dropdown trigger="hover">
                                        <a-button type="primary" size="large" status="success"
                                            @click="goToGetAllChapter(false)">
                                            <icon-robot-add />获取选中章节内容
                                        </a-button>
                                        <template #content>
                                            <a-doption @click="goToGetAllChapter(true)">获取选中章节内容(强制更新)</a-doption>
                                            <a-doption>删除选中章节TODO</a-doption>
                                        </template>
                                    </a-dropdown>

                                    <a-button size="large">
                                        <icon-ordered-list />章节排序
                                    </a-button>
                                </a-space>
                            </a-col>
                        </a-row>
                        <a-row justify="start">
                            <a-col>
                                <a-button type="outline" size="large" @click="goToSendSelectedChapter">
                                    <icon-mobile />发送到默认邮箱账户
                                </a-button>
                            </a-col>
                        </a-row>
                    </template>
                </BookInfo>
                <ChapterList :loading="loading" :Chapters="renderData.Index">
                    <template #content="{ item }">
                        <ChapterOpt :chapter="item" />
                    </template>
                </ChapterList>
            </a-spin>
        </div>
    </div>
</template>

<script lang="ts" setup>
//类型引入
import { Book, BookSources } from '@/types/book';

import { ref } from 'vue';
import useRequest from '@/hooks/request';
import useBookHelper from '@/hooks/book-helper';

import {
    queryBookById,
    updateChapter,
    createPDF,
    mergeWebBookIndex,
    queryBookSourcesById,
} from '@/api/book';


const { bookId, gotoChapter, gotoIndex } = useBookHelper();

//组件引入
import { Message, Modal, Notification } from '@arco-design/web-vue';
import ProcessBar from './components/processbar.vue';
import BookInfo from '@/components/book-info/index.vue';
import ChapterList from '@/components/chapter-list/index.vue';
import ChapterOpt from './components/chapter-opt.vue';

//变量定义
const chapterHasCheckedNum = ref(0);    // 已选中的章节数
const curDoingProcent = ref(-1);        //进度条状态


const queryBook = () => {
    curDoingProcent.value = -1;
    return queryBookById(bookId).then((rsl: any) => {
        new Promise((ok: any) => {
            ok();
        }).then(() => {
            // InitEditModelOption(rsl.data);
        });
        return rsl;
    });
};
const { loading, response: renderData } = useRequest<Book>(queryBook);
const { response: bookSourcesData } = useRequest<BookSources[]>(() => {
    return queryBookSourcesById(bookId);
});



//事件定义
/**
 * 合并当前章节
 * @param bookid
 */
function mergeIndex() {
    return mergeWebBookIndex(bookId)
        .then((result) => {
            Message.success('已启动章节更新合并');
            console.log(result);
        })
        .catch((err) => Message.error(`合并、更新章节失败${err}`));
}

/**
 * 从指定位置开始，选中后续章节
 * @param num 选中的数量
 * @param type 1:后续任意章节/2:后续空章节
 */
const checkNextChapter = (num: number, type: number) => { }

/**
 * 选中所有章节
 */
const checkAllChapter = () => { }
/**
 * 选中当前的后续章节
 */
const checkAllChapterAfterFirstChecked = () => { }

/**
 * 选中所有空章节
 */
const checkEmptyChapter = (ev: PointerEvent) => { }

/**
 * 清空已选章节
 */
const cleanAllChapter = () => { }

/**
 * 开始抓取选中章节
 * @param isUpdate 是否强制更新
 */
const goToGetAllChapter = (isUpdate = false) => { }

/**
 * 所选章节制作PDF并发到邮箱
 */
const goToSendSelectedChapter = async () => { }

const open = (url: string) => { window.open(url); };
</script>