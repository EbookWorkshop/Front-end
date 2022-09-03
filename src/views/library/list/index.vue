<template>
  <div class="container">
    <Breadcrumb :items="['menu.library', 'menu.library.list']" />
    <a-row :gutter="20" align="stretch">
      <a-col :span="24">
        <a-card class="general-card" :title="$t('menu.library.list')">
          <div class="book-list-wrap">
            <a-row class="list-row" :gutter="24">
              <!-- 一行 -->
              <a-col
                v-for="item in renderData"
                :key="item.BookId"
                class="list-col"
                :xs="12"
                :sm="12"
                :md="12"
                :lg="3"
                :xl="3"
                :xxl="3"
                @click="goto(item.BookId)"
              >
                <BookWrap
                  v-if="item.CoverImg !== null"
                  :loading="loading"
                  :title="item.BookName"
                  :cover-img="item.CoverImg"
                >
                  <a-descriptions
                    style="margin-top: 16px"
                    layout="inline-horizontal"
                    :column="2"
                  />
                </BookWrap>
                <BookClassical
                  v-if="item.CoverImg === null"
                  :loading="loading"
                  :title="item.BookName"
                  :title-show="item.BookName.replace(/[\(（)].*$/, '')"
                >
                  <a-descriptions
                    style="margin-top: 16px"
                    layout="inline-horizontal"
                    :column="2"
                  />
                </BookClassical>
              </a-col>
            </a-row>
          </div>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts" setup>
  import { queryBookList, Book } from '@/api/library';
  import useRequest from '@/hooks/request';
  import { useRouter, useRoute } from 'vue-router';
  import BookWrap from './components/book-wrap.vue';
  import BookClassical from './components/book-classical.vue';

  const defaultValue: Book[] = new Array(4).fill({});
  const { loading, response: renderData } = useRequest<Book[]>(
    queryBookList,
    defaultValue
  );
  const router = useRouter();

  const goto = (bookid: number) => {
    router.push({ path: `/book/${bookid}` });
  };
</script>

<style scoped lang="less">
  .empty-wrap {
    height: 200px;
    border-radius: 4px;

    :deep(.arco-card) {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      border-radius: 4px;

      .arco-result-title {
        color: rgb(var(--gray-6));
      }
    }
  }
</style>
