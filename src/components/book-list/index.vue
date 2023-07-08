<template>
  <a-spin :loading="loading">
    <a-row :gutter="20" align="stretch" style="overflow-x: hidden">
      <a-col :span="24">
        <a-card class="general-card" :title="title">
          <div class="book-list-wrap">
            <a-row class="list-row" :gutter="24">
              <!-- 一行 -->
              <a-col
                v-for="item in renderData"
                :key="item.BookId"
                class="list-col"
                :xs="24"
                :sm="12"
                :md="12"
                :lg="6"
                :xl="6"
                :xxl="4"
                @click="goto(item.BookId)"
              >
                <BookCover
                  :loading="loading"
                  :book-name="item.BookName"
                  :cover-img="item.CoverImg"
                >
                </BookCover>
              </a-col>
            </a-row>
          </div>
        </a-card>
      </a-col>
    </a-row>
  </a-spin>
</template>

<script lang="ts" setup>
  import { useRouter } from 'vue-router';
  import { queryBookList, Book } from '../../api/library';
  import useRequest from '../../hooks/request';
  import BookCover from '../book-cover/index.vue';

  // 入参
  const props = defineProps({
    title: String,
    nextRouter: String,
  });

  const defaultValue: Book[] = new Array(6).fill({});
  /**
   * renderData --实际的数据
   */
  const { loading, response: renderData } = useRequest<Book[]>(
    queryBookList,
    defaultValue
  );

  const router = useRouter();
  const goto = (bookid: number) => {
    router.push({
      path: `/${props.nextRouter}/${bookid}`,
    });
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
