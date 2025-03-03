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
                                <a-button @click="search" type="primary">检 索</a-button>
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
                <a-row v-if="results.length">
                    <a-col>
                        <div>
                            <ul>
                                <li v-for="result in results" :key="result.id">{{ result.name }}</li>
                            </ul>
                        </div>
                    </a-col>
                </a-row>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import SelectBook from '@/components/select-book/index.vue';

const searchForm = ref({
    searchQuery: '',
});
const advanceForm = ref({
    bookId: [],
    type: 'all',
});
const isAdvance = ref(false);       // 是否显示高级检索
const results = ref([]);

const search = () => {
    console.log('Searching for:', searchForm.value.searchQuery);
};
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
</style>