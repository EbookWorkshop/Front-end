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
                                <a-input v-model="searchForm.searchQuery" placeholder="请输入关键字..." size="large" />
                                <a-button @click="search" type="primary" :loading="isSearching" size="large">检
                                    索</a-button>
                                <a-button @click="isAdvance = !isAdvance" type="text" size="large">高级检索</a-button>
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
                            <a-form-item label="排除书籍">
                                <SelectBook v-model="advanceForm.notFind" :is-multiple="true" />
                            </a-form-item>
                        </a-form>
                    </a-col>
                </a-row>
                <a-row v-if="isShowResult">
                    <a-col>
                        <a-empty v-if="!results.length" />
                        <a-typography-paragraph v-else>
                            已找到<a-typography-text type="danger" underline>{{ results.length }}</a-typography-text>条记录，
                            共命中<a-typography-text type="danger" underline>{{ hitCount }}</a-typography-text>次，
                            共涉及<a-typography-text type="danger" underline>{{ bookCount }}</a-typography-text>本书。
                        </a-typography-paragraph>
                    </a-col>
                </a-row>
                <a-row v-if="results.length">
                    <a-col>
                        <a-collapse :default-active-key="results.map(t => t.BookId)" bordered>
                            <a-collapse-item v-for="book in results" :key="book.BookId">
                                <template #header>
                                    <a-typography-paragraph>
                                        <a-badge :count="book.HitCount" :max-count="9999">{{ book.BookName }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</a-badge>
                                    </a-typography-paragraph>
                                </template>
                                <a-list :data="book.data" bordered :style="{ backgroundColor: 'var(--color-bg-1)' }">
                                    <template #item="{ item }">
                                        <a-list-item>
                                            <a-typography>
                                                <a-typography-title :heading="5">
                                                    <a-badge :count="item.HitCount">
                                                        <a-link
                                                            :href="`/book/${item.BookId}/chapter/${item.id}?keyword=${encodeURIComponent(searchForm.searchQuery)}`"
                                                            target="_blank"
                                                            v-html="'&nbsp;&nbsp;' + item.Title + '&nbsp;&nbsp;'"
                                                            style="font-size: inherit;"></a-link>
                                                    </a-badge>
                                                    &nbsp;&nbsp;
                                                    <a-link :href="`/book/${item.BookId}`" target="_blank"
                                                        style="font-size: inherit;">《{{ item.BookName }}》</a-link>
                                                </a-typography-title>
                                                <a-typography-paragraph v-html="item.Content"></a-typography-paragraph>
                                            </a-typography>
                                        </a-list-item>
                                    </template>
                                </a-list>
                            </a-collapse-item>
                        </a-collapse>
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
    notFind: [],
    type: 'all',
});
const isAdvance = ref(false);       // 是否显示高级检索
const results = ref([]);
const isSearching = ref(false);
const isShowResult = ref(false);
const bookCount = ref(0);       // 涉及的书籍数量
const hitCount = ref(0);        // 命中次数总和

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
    if (!setting.keyword) {
        return;
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
    let bookSet = new Set();
    let i = 0;
    let sumCount = 0;
    let rr = data.map(item => {
        let title = item.Title;
        let contIndex = item.Content?.indexOf(keyWord);
        let content = item.Content?.substring(Math.max(contIndex - 90, 0), contIndex + 280);
        title = title.replaceAll(keyWord, `<span class="keyword">${keyWord}</span>`);
        content = content?.replaceAll(keyWord, `<span class="keyword">${keyWord}</span>`);

        if (!content) content = "章节内容缺失";
        else content = `...${content}...`;
        bookSet.add(item.BookId);
        sumCount += item.HitCount;
        return {
            index: ++i,
            id: item.id,
            BookName: item.BookName,
            Title: title,
            Content: content,
            HitCount: item.HitCount,
            BookId: item.BookId
        };
    });

    // 按照书名聚合
    const groupedResults = rr.reduce((acc, item) => {
        if (!acc[item.BookName]) {
            acc[item.BookName] = [];
        }
        acc[item.BookName].push(item);
        return acc;
    }, {});
    // rr = Object.values(groupedResults).flat();
    const showResult = [];
    for (const key in groupedResults) {
        showResult.push({
            BookName: key,
            BookId: groupedResults[key][0].BookId,
            data: groupedResults[key],
            HitCount: groupedResults[key].reduce((sum, item) => sum + item.HitCount, 0),
        });
    }

    results.value = showResult;
    bookCount.value = bookSet.size;
    hitCount.value = sumCount;
}

</script>
<style lang="less">
.mainTitle {
    font-size: 96px;
    font-weight: bold;
    display: flex;
    align-items: center;
    color: var(--color-neutral-10);

    .search-icon {
        font-size: 168px;
        stroke-linecap: round;
        stroke-linejoin: round;
        stroke-width: 3;
        color: gray;
    }
}

h5.arco-typography {
    margin-top: 0px;
}

.keyword {
    color: rgb(var(--red-6));
    background-color: cornsilk;
    font-weight: bold;
}
</style>