<template>
  <a-empty v-if="renderData != null && renderData.length == 0 && !loading" />

  <a-spin v-else :loading="loading" tip="加载中..." :size="64" style="width: 100%; height: 100%;min-height: 200px;">
    <a-row :gutter="20" align="stretch" style="overflow-x: hidden">
      <!-- 标签工具栏 -->
      <a-col :span="24" v-if="renderData.length > 0">
        <TagList :tagid="props.tagid" :Api="props.Api" @change="renderData = $event" />
      </a-col>
      <a-divider />
      <a-col :span="24">
        <a-card class="general-card">
          <div class="book-list-wrap">
            <a-row class="list-row" :gutter="24">
              <!-- 一行 -->
              <a-col v-for="item in renderData" :key="item.BookId" class="list-col" :xs="24" :sm="12" :md="12" :lg="6"
                :xl="6" :xxl="4" @click="goto(item.BookId)">
                <a-dropdown trigger="contextMenu" alignPoint :style="{ display: 'block' }" :popup-max-height="false" >
                  <BookCover :loading="loading" :book-name="item.BookName" :cover-img="item.CoverImg">
                  </BookCover>
                  <template #content>
                    <a-dgroup title="标签">
                      <a-doption disabled>
                        <TagTool :book-id="item.BookId"></TagTool>
                      </a-doption>
                    </a-dgroup>
                    <a-doption >
                      <template #icon> <icon-delete /> </template>
                      <template #default>
                        <a-button type="text" status="danger" @click="DeleteABook(item.BookId)">删除书本</a-button>
                      </template>
                    </a-doption>
                    <a-doption >
                      <template #icon> <icon-pen /> </template>
                      <template #default><a-button type="text"
                          @click="curEditBookId = item.BookId">修改元数据</a-button></template>
                    </a-doption>
                  </template>
                </a-dropdown>
              </a-col>
            </a-row>
          </div>
        </a-card>
      </a-col>
    </a-row>
  </a-spin>

  <EditBookInfo :visible="curEditBookId != 0" :bookId="curEditBookId" @cancel="curEditBookId = 0" @submit="onUpdateMeta" />
</template>

<script lang="ts" setup>
import { PropType, ref } from 'vue';
import { useRouter } from 'vue-router';
import { ListQueryApi, deleteABook } from '@/api/library';
import { Book } from '@/types/book';
import useRequest from '../../hooks/request';
import BookCover from '../book-cover/index.vue';
import TagTool from '../tag-toolbar/index.vue';
import TagList from '../tag-toolbar/list.vue';
import EditBookInfo from '../book-info/edit.vue';

// 入参
const props = defineProps({
  title: String,
  nextRouter: String,
  tagid: Number,
  Api: {
    type: Function as PropType<ListQueryApi>,
    required: true
  }
});

// 内部状态管理
const defaultValue: Book[] = new Array().fill({});
const curEditBookId = ref(0);

/**
 * renderData --实际的数据
 */
const { loading, response: renderData } = useRequest<Book[]>(
  props.Api.bind(null, props.tagid),
  defaultValue
);


const router = useRouter();
const goto = (bookid: number) => {
  router.push({
    path: `/${props.nextRouter}/${bookid}`,
  });
};

function onUpdateMeta(form: any) {
  const curBook = renderData.value.find(item => item.BookId == form.id);
  if (curBook) {
    curBook.BookName = form.name;
    curBook.Author = form.author;
    curBook.CoverImg = form.bookCover;
  }
}

function DeleteABook(bookid: number) {
  loading.value = true;
  deleteABook(bookid).then((rsl) => {
    for (let i = 0; i < renderData.value.length; i++) {
      if (renderData.value[i].BookId == bookid) {
        loading.value = false;
        renderData.value.splice(i, 1);
        return;
      }
    }
  }).catch((err) => {
    // Message.error(`删除失败：${err}`);
    loading.value = false;
  });
}
</script>

<style scoped lang="less">
.list-col {
  min-width: 302px;
}

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
