<template>
    <div>
        <div class="container">
            <Breadcrumb :items="['menu.library', 'menu.library.search']" />
            <div class="wrapper">
                <a-row justify="center">
                    <a-col :span="4">
                        <h1 class="mainTitle">检<icon-search class="search-icon" />索</h1>
                    </a-col>
                </a-row>
                <a-row>
                    <a-col>
                        <a-form v-bind:model="searchForm">
                            <a-form-item label-col-flex="80px">
                                <a-input v-model="searchForm.searchQuery" placeholder="请输入关键字..." />
                                <a-button @click="search" type="primary" :loading="isSearching">检 索</a-button>
                                <a-button @click="isAdvance = !isAdvance" type="text">高级检索</a-button>
                            </a-form-item>
                        </a-form>
                    </a-col>
                </a-row>
                <a-row v-if="isAdvance" justify="center" align="middle">
                    <a-col :span="12">
                        <a-form v-bind:model="advanceForm" layout="inline">
                            <a-form-item label="检索类型">
                                <a-radio-group v-model="advanceForm.type">
                                    <a-radio value="all">全部</a-radio>
                                    <a-radio value="title">仅标题</a-radio>
                                    <a-radio value="content">仅正文</a-radio>
                                </a-radio-group>
                            </a-form-item>
                            <a-form-item label="限定检索范围">
                                <SelectBook v-model="advanceForm.bookId" :is-multiple="true" />
                            </a-form-item>
                        </a-form>
                    </a-col>
                </a-row>
                <a-row v-if="isShowResult">
                    <a-col>
                        <a-empty v-if="!results.length" />
                        <a-typography-paragraph v-else>已找到<a-typography-text type="danger" underline>{{ results.length }}</a-typography-text>条记录，共涉及<a-typography-text type="danger" underline>{{ bookCount }}</a-typography-text>本书。
                        </a-typography-paragraph>
                    </a-col>
                </a-row>
                <a-row v-if="results.length">
                    <a-col>
                        <a-list :data="results">
                            <template #item="{ item }">
                                <a-list-item>
                                    <a-typography>
                                        <a-typography-title :heading="3">
                                            <a-link
                                                :href="`/book/${item.BookId}/chapter/${item.id}?keywork=${encodeURIComponent(searchForm.searchQuery)}`"
                                                target="_blank"
                                                v-html="'&nbsp;&nbsp;' + item.Title + '&nbsp;&nbsp;'"></a-link>
                                            &nbsp;&nbsp;
                                            <a-link :href="`/book/${item.BookId}`" target="_blank">《{{ item.BookName }}》</a-link>
                                        </a-typography-title>
                                        <a-typography-paragraph v-html="item.Content"></a-typography-paragraph>
                                    </a-typography>
                                </a-list-item>
                            </template>
                        </a-list>
                    </a-col>
                </a-row>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import SelectBook from '@/components/select-book/index.vue';
import { searchBook } from '@/api/library';

const searchForm = ref({
    searchQuery: '',
});
const advanceForm = ref({
    bookId: [],
    type: 'all',
});
const isAdvance = ref(false);       // 是否显示高级检索
const results = ref([]);
const isSearching = ref(false);
const isShowResult = ref(false);
const bookCount = ref(0);

const search = () => {
    isShowResult.value = false;
    let setting = {
        keyword: searchForm.value.searchQuery,
    };
    if (isAdvance.value) {
        setting.option = {
            ...advanceForm.value,
        };
    }
    isSearching.value = true;
    searchBook(setting).then(res => {
        RenderResult(res.data);
    }).catch(() => {
        results.value = [];
    }).finally(() => {
        isSearching.value = false;
        isShowResult.value = true;
    });
};

function RenderResult(data) {
    const keyWord = searchForm.value.searchQuery;
    bookCount.value = 0;
    let bookSet=new Set();
    let i = 0;
    let rr = data.map(item => {
        let title = item.Title;
        let contIndex = item.Content?.indexOf(keyWord);
        let content = item.Content?.substring(Math.max(contIndex - 180, 0), contIndex + 180);
        title = title.replaceAll(keyWord, `<span class="keyword">${keyWord}</span>`);
        content = content?.replaceAll(keyWord, `<span class="keyword">${keyWord}</span>`);

        if (!content) content = "章节内容缺失";
        else content = `...${content}...`;
        bookSet.add(item.BookId);
        return {
            index: ++i,
            id: item.id,
            BookName: item.Ebook?.BookName,
            Title: title,
            Content: content,
            BookId: item.BookId
        };
    });
    results.value = rr;
    bookCount.value = bookSet.size;
}

</script>
<style lang="less">
.mainTitle {
    font-size: 96px;
    font-weight: bold;
    display: flex;
    align-items: center;

    .search-icon {
        font-size: 168px;
        stroke-linecap: round;
        stroke-linejoin: round;
        stroke-width: 3;
        color: gray;
    }
}

h3.arco-typography {
    margin-top: 5px;
}

.keyword {
    color: rgb(var(--red-6));
    background-color: cornsilk;
    font-weight: bold;
}
</style>