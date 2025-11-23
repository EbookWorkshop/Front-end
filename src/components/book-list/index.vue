<template>
  <a-empty v-if="renderData != null && renderData.length == 0 && !loading" />

  <a-spin v-else :loading="loading" tip="加载中..." :size="64" style="width: 100%; height: 100%;min-height: 200px;">
    <a-row :gutter="20" align="stretch" style="overflow-x: hidden">
      <!-- 标签工具栏 -->
      <a-col :span="24" v-if="renderData.length > 0">
        <a-button @click="toggleFilter" shape="circle"> <template #icon><icon-filter title="筛选" /></template></a-button>
        <TagList :tagid="props.tagid" :Api="props.Api" @change="renderData = $event" />
      </a-col>
      <a-col :span="24" v-if="isFiltered">
        <a-input :style="{ width: '100%' }" placeholder="输入过滤的书名，按回车执行过滤" allow-clear @change="filterBookName">
          <template #prefix><icon-filter title="筛选" /></template>
        </a-input>
      </a-col>
      <a-divider />
      <a-col :span="24">
        <a-card class="general-card">
          <div class="book-list-wrap">
            <a-row class="list-row" :gutter="24">
              <!-- 一行 -->
              <a-col v-for="item in renderData" :key="item.BookId" class="list-col" :xs="24" :sm="12" :md="12" :lg="6"
                :xl="6" :xxl="4" @click="goto(item.BookId)">
                <a-dropdown trigger="contextMenu" alignPoint :style="{ display: 'block' }" :popup-max-height="false"
                  class="book-context-menu">
                  <BookCover :loading="loading" :book-name="item.BookName" :cover-img="item.CoverImg"> </BookCover>
                  <template #content>
                    <a-dgroup title="标签">
                      <a-doption disabled>
                        <TagTool :book-id="item.BookId"></TagTool>
                      </a-doption>
                    </a-dgroup>
                    <a-doption>
                      <template #icon> <icon-pen /> </template>
                      <template #default><a-button type="text" long
                          @click="curEditBookId = item.BookId">修改元数据</a-button></template>
                    </a-doption>
                    <a-doption>
                      <template #icon> <icon-export /> </template>
                      <template #default>
                        <a-button type="text" long @click="gotoExport(item.BookId)">{{ $t('menu.workshop.export') }}</a-button>
                      </template>
                    </a-doption>
                    <a-doption>
                      <template #icon> <icon-bar-chart /> </template>
                      <template #default>
                        <a-button type="primary" long status="warning" disabled>统计</a-button>
                      </template>
                    </a-doption>
                    <a-doption>
                      <template #icon> <icon-delete /> </template>
                      <template #default>
                        <a-button type="text" status="danger" @click="DeleteABook(item.BookId)" long>删除书本</a-button>
                      </template>
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

  <EditBookInfo :visible="curEditBookId != 0" :bookId="curEditBookId" @cancel="curEditBookId = 0"
    @submit="onUpdateMeta" />
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
import NProgress from 'nprogress'; // progress bar


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
const isFiltered = ref(false);
const defaultAllBooks = ref<Book[]>([]);

/**
 * renderData --实际的数据
 */
const { loading, response: renderData } = useRequest<Book[]>(
  props.Api.bind(null, props.tagid, []),
  defaultValue
);


const router = useRouter();
const goto = (bookid: number) => {
  router.push({
    path: `/${props.nextRouter}/${bookid}`,
  });
};

const gotoExport = (bookid: number) => {
  router.push({
    path: `/workshop/export/exportguide/${bookid}`,
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
  // loading.value = true;
  NProgress.start();
  deleteABook(bookid).then((rsl) => {
    for (let i = 0; i < renderData.value.length; i++) {
      if (renderData.value[i].BookId == bookid) {
        renderData.value.splice(i, 1);
        return;
      }
    }
  }).catch((err) => {
    // Message.error(`删除失败：${err}`);
  }).finally(() => {
    NProgress.done();
  });
}

function filterBookName(name: string) {
  renderData.value = defaultAllBooks.value.filter(item => item.BookName.includes(name));
}

function toggleFilter() {
  isFiltered.value = !isFiltered.value;

  if (defaultAllBooks.value.length == 0) {
    defaultAllBooks.value = renderData.value;
  }

  if (isFiltered.value == false) {
    filterBookName("");
  }
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

.book-context-menu {
  .arco-dropdown-option {
    width: 100%;

    :deep(.arco-dropdown-option-content) {
      // 深度选择器
      width: 100%;
      box-sizing: border-box; // 防止边框影响宽度计算
    }

    .arco-dropdown-option-content {
      button {
        width: 100%;
        box-sizing: border-box;
      }
    }
  }
}
</style>
