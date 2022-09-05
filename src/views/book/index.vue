<template>
  <div class="container">
    <Breadcrumb :items="['menu.library', 'menu.library.list']" />
    <a-row :gutter="20" align="stretch" justify="center">
      <a-col :span="2"></a-col>
      <a-col :span="3">
        <BookCover
          :loading="loading"
          :book-name="renderData.BookName"
          :cover-img="renderData.CoverImg"
        ></BookCover>
      </a-col>
      <a-col :span="14">
        <a-row :gutter="20" align="center" justify="center">
          <a-col :span="10" style="margin-top: 50px; text-align: center">
            <a-typography-title> {{ renderData.BookName }}</a-typography-title>
          </a-col>
          <a-col :span="14"> </a-col>
        </a-row>
        <a-row>
          <!-- 书详情页面 -->
        </a-row>
        <template v-if="isEdit">
          <!-- 管理按钮 -->
          <a-row justify="start">
            <a-col></a-col>
          </a-row>
        </template>
      </a-col>
    </a-row>
    <a-row class="grid-chapter" style="margin-bottom: 16px">
      <a-col :span="2" style="height: 100%">
        <!-- 【章节列表】给左边预留一点空位 -->
      </a-col>
      <a-col :span="20">
        <!-- loading用的骨架页 -->
        <a-row v-if="loading" :gutter="10">
          <a-col v-for="i in [1, 2, 3, 4, 5, 6]" :key="i" :span="4">
            <a-skeleton :animation="true">
              <a-skeleton-line :rows="4" :line-height="48" :line-spacing="10" />
            </a-skeleton>
          </a-col>
        </a-row>

        <a-grid
          :cols="{ xs: 1, sm: 2, md: 3, lg: 4, xl: 5, xxl: 6 }"
          :col-gap="12"
          :row-gap="16"
          class="grid-demo-grid"
        >
          <template v-if="!isEdit">
            <!-- 阅读视图 阅读时的章节列表 -->
            <a-grid-item
              v-for="item in renderData.Index"
              :key="item.IndexId"
              class="reading-index"
            >
              <a-button
                long
                :disabled="!item.IsHasContent"
                class="chapter"
                @click="goto(item.IndexId)"
                >{{ item.Title }}
              </a-button>
            </a-grid-item>
          </template>
          <template v-else>
            <!-- 编辑视图 班级功能时的章节列表 -->
            <a-grid-item
              v-for="item in renderData.Index"
              :key="item.IndexId"
              class="edit-index"
            >
              <a-button-group
                style="align-items: stretch; width: 100%"
                :status="item.IsHasContent ? 'normal' : 'warning'"
                :title="item.Title"
              >
                <a-button long type="dashed" class="chapter">
                  <a-checkbox :value="item.IndexId">{{
                    item.Title
                  }}</a-checkbox>
                </a-button>

                <a-button
                  type="dashed"
                  size="large"
                  style="height: unset !important"
                  @click="showeditmenu(item.IndexId)"
                >
                  <template #icon>
                    <icon-settings />
                  </template>
                </a-button>
              </a-button-group>
            </a-grid-item>
          </template>
        </a-grid>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts" setup>
  import { useRouter, useRoute } from 'vue-router';
  import { queryBookById, Book, Chapter } from '@/api/book';
  import useRequest from '@/hooks/request';
  import BookCover from '@/components/book-cover/index.vue';

  const route = useRoute();
  const router = useRouter();

  // 是否编辑模式
  const isEdit = route.path.includes('/bookedit/');
  // 当前书的ID
  const bookid = Number(route.params.id);
  const queryBook = () => {
    return queryBookById(bookid);
  };

  const { loading, response: renderData } = useRequest<Book>(queryBook);

  const goto = (chapterId: number) => {
    router.push({ path: `/book/${bookid}/chapter/${chapterId}` });
  };

  /** ****下面是编辑模式专有****** */
  const showeditmenu = (chapterId: number) => {};
</script>

<style>
  .showBord {
    border: 1px solid red;
  }

  .chapter {
    height: 48px;
    overflow: hidden;
    font-size: 1.2rem;
    text-align: left;
  }
</style>
