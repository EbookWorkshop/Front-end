<template>
  <a-empty v-if="renderData != null && renderData.length == 0 && !loading" />
  <a-spin v-else :loading="loading" tip="加载中..." :size="64" style="width: 100%; height: 100%; min-height: 200px;">
    <!-- 筛选/标签工具栏 -->
    <a-row :gutter="20" align="stretch" :wrap="false" style="overflow-x: hidden;">
      <a-col flex="34px" v-if="renderData.length > 0">
        <a-button @click="toggleFilter" shape="circle">
          <template #icon><icon-filter title="筛选" /></template>
        </a-button>
      </a-col>
      <a-col flex="auto" v-if="renderData.length > 0">
        <TagList :tagid="props.tagid" :Api="props.Api" @change="handleTagChange" />
      </a-col>
    </a-row>

    <a-row :gutter="20" align="stretch" style="overflow-x: hidden;">
      <a-col :span="24" v-if="isFiltered">
        <a-input :style="{ width: '100%' }" placeholder="输入过滤的书名，按回车执行过滤" allow-clear @change="filterBookName">
          <template #prefix><icon-filter title="筛选" /></template>
        </a-input>
      </a-col>
      <a-divider />
      <a-col :span="24">
        <!-- 虚拟滚动容器 -->
        <div ref="scrollContainer" class="book-list-wrap virtual-scroll-container"
          :style="{ height: scrollHeight, overflowY: 'auto' }">
          <!-- 总占位 -->
          <div :style="{ height: virtualizer.getTotalSize() + 'px', position: 'relative' }">
            <!-- 只渲染可见行 -->
            <div v-for="virtualRow in virtualizer.getVirtualItems()" :key="String(virtualRow.key)" 
              :style="{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: `translateY(${virtualRow.start}px)`,
                height: ROW_HEIGHT + 'px',
                display: 'flex',
                flexWrap: 'nowrap',
                justifyContent: 'center',
                alignItems: 'center',
                boxSizing: 'border-box',
                gap: GAP + 'px',
              }">
              <!-- 迭代当前行的书籍 -->
              <div v-for="book in rowData[virtualRow.index]" :key="book.BookId" class="list-col"
                :style="{ flex: `0 0 ${CARD_WIDTH}px`, width: CARD_WIDTH + 'px' }" @click="goto(book.BookId)">
                <a-dropdown trigger="contextMenu" alignPoint :style="{ display: 'block' }" :popup-max-height="false"
                  class="book-context-menu">
                  <BookCover :loading="loading" :book-name="book.BookName" :cover-img="book.CoverImg"
                    class="book-cover" />
                  <template #content>
                    <a-dgroup title="标签">
                      <a-doption disabled>
                        <TagTool :book-id="book.BookId" />
                      </a-doption>
                    </a-dgroup>
                    <a-doption>
                      <template #icon> <icon-book /> </template>
                      <template #default>
                        <a-button type="text" long @click="curEditBookId = book.BookId">
                          修改元数据
                        </a-button>
                      </template>
                    </a-doption>
                    <a-doption>
                      <template #icon> <icon-export /> </template>
                      <template #default>
                        <a-button type="text" long @click="gotoExport(book.BookId)">
                          {{ $t('menu.workshop.export') }}
                        </a-button>
                      </template>
                    </a-doption>
                    <a-dsubmenu value="edit" trigger="hover">
                      <template #icon> <icon-edit /> </template>
                      <template #default><a-button type="text" long>　　修改内容</a-button></template>
                      <template #content>
                        <a-doption>
                          <template #default>
                            <a-button type="text" long @click="gotoReview(book.BookId)">
                              <template #icon> <icon-find-replace /> </template>
                              {{ $t('menu.workplace.correction') }}
                            </a-button>
                          </template>
                        </a-doption>
                        <a-doption>
                          <template #default>
                            <a-button type="text" long @click="gotoRevise(book.BookId)">
                              <template #icon> <icon-eraser /> </template>
                              {{ $t('menu.workplace.revise') }}
                            </a-button>
                          </template>
                        </a-doption>
                      </template>
                    </a-dsubmenu>
                    <a-doption>
                      <template #icon> <icon-bar-chart /> </template>
                      <template #default>
                        <a-button type="text" long @click="gotoAnalyticsText(book.BookId)">
                          统计
                        </a-button>
                      </template>
                    </a-doption>
                    <a-dgroup title="危险操作">
                      <a-doption>
                        <template #icon> <icon-delete /> </template>
                        <template #default>
                          <a-button type="text" status="danger" @click="DeleteABook(book.BookId, book.BookName)" long>
                            删除书本
                          </a-button>
                        </template>
                      </a-doption>
                    </a-dgroup>
                  </template>
                </a-dropdown>
              </div>
            </div>
          </div>
        </div>
      </a-col>
    </a-row>
  </a-spin>

  <EditBookInfo :visible="curEditBookId != 0" :bookId="curEditBookId" @cancel="curEditBookId = 0"
    @submit="onUpdateMeta" />
</template>

<script lang="ts" setup>
import { PropType, ref, onMounted, nextTick, onUnmounted, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useVirtualizer } from '@tanstack/vue-virtual';
import { ListQueryApi, deleteABook } from '@/api/library';
import { Book } from '@/types/book';
import useRequest from '../../hooks/request';
import BookCover from '../book-cover/index.vue';
import TagTool from '../tag-toolbar/index.vue';
import TagList from '../tag-toolbar/list.vue';
import EditBookInfo from '../book-info/edit.vue';
import NProgress from 'nprogress';
import { Modal } from '@arco-design/web-vue';

const props = defineProps({
  title: String,
  nextRouter: String,
  tagid: Number,
  Api: {
    type: Function as PropType<ListQueryApi>,
    required: true,
  },
});

// 常量
const CARD_WIDTH = 284;
const GAP = 24;
const ROW_HEIGHT = 380;//行高360 间距20
const DEFAULT_HEIGHT = 'calc(100vh - 350px)';

const defaultValue: Book[] = [];
const curEditBookId = ref(0);
const isFiltered = ref(false);
const defaultAllBooks = ref<Book[]>([]);
const scrollContainer = ref<HTMLElement | null>(null);
const columnCount = ref(5);
const scrollHeight = ref(DEFAULT_HEIGHT);

// 数据加载
const { loading, response: renderData } = useRequest<Book[]>(
  props.Api.bind(null, props.tagid, []),
  defaultValue
);

// 将数据按列数分组为二维数组（行）
const rowData = computed(() => {
  const data = renderData.value || [];
  const cols = columnCount.value;
  const rows: Book[][] = [];
  for (let i = 0; i < data.length; i += cols) {
    rows.push(data.slice(i, i + cols));
  }
  return rows;
});

// 虚拟滚动器（返回 Ref<Virtualizer>）
const virtualizer = useVirtualizer(
  computed(() => ({
    count: rowData.value.length,
    getScrollElement: () => scrollContainer.value,
    estimateSize: () => ROW_HEIGHT,
    overscan: 6,//数值越大缓存越大，效果越好但更占资源
  }))
);

// 计算列数
function updateColumnCount() {
  if (!scrollContainer.value) return;
  const containerWidth = scrollContainer.value.clientWidth;
  const availableWidth = containerWidth - 24;
  const cols = Math.floor((availableWidth + GAP) / (CARD_WIDTH + GAP));
  const newCount = Math.max(1, cols);
  if (newCount !== columnCount.value) {
    columnCount.value = newCount;
  }
}

// 监听容器尺寸变化
let resizeObserver: ResizeObserver | null = null;
onMounted(() => {
  nextTick(() => {
    if (scrollContainer.value) {
      updateColumnCount();
      virtualizer.value?.measure();

      resizeObserver = new ResizeObserver(() => {
        updateColumnCount();
        nextTick(() => virtualizer.value?.measure());
      });
      resizeObserver.observe(scrollContainer.value);
    }
  });
});
onUnmounted(() => { resizeObserver?.disconnect(); });

// 数据变化时重新测量
watch(
  () => renderData.value,
  () => { nextTick(() => virtualizer.value?.measure()); },
  { deep: false }
);

// 业务函数
const router = useRouter();
const goto = (bookid: number) => router.push({ path: `/${props.nextRouter}/${bookid}` });
const gotoExport = (bookid: number) => router.push({ path: `/workshop/export/${bookid}` });
const gotoRevise = (bookid: number) => router.push({ path: `/workplace/revise/book/${bookid}` });
const gotoReview = (bookid: number) => router.push({ path: `/workplace/correction/reviewbook/${bookid}` });
const gotoAnalyticsText = (bookid: number) => router.push({ path: `/workplace/analytics/text/${bookid}` });

function onUpdateMeta(form: any) {
  const curBook = renderData.value.find((item) => item.BookId == form.id);
  if (curBook) {
    curBook.BookName = form.name;
    curBook.Author = form.author;
    curBook.CoverImg = form.bookCover;
  }
}

function DeleteABook(bookid: number, BookName: string) {
  Modal.warning({
    title: '删除书籍',
    content: `确定要删除书籍《${BookName}》吗？ `,
    okText: '确认删除',
    cancelText: '取消',
    hideCancel: false,
    onOk() {
      NProgress.start();
      deleteABook(bookid)
        .then(() => {
          const idx = renderData.value.findIndex((b) => b.BookId === bookid);
          if (idx !== -1) renderData.value.splice(idx, 1);
        })
        .catch(() => { })
        .finally(() => NProgress.done());
    },
  });
}

function filterBookName(name: string) {
  renderData.value = defaultAllBooks.value.filter((item) =>
    item.BookName.includes(name)
  );
}

function toggleFilter() {
  isFiltered.value = !isFiltered.value;
  if (defaultAllBooks.value.length === 0) {
    defaultAllBooks.value = renderData.value;
  }
  if (!isFiltered.value) {
    filterBookName('');
  }
}

function handleTagChange(newData: Book[]) {
  renderData.value = newData;
}
</script>

<style scoped lang="less">
.list-col {
  cursor: pointer;
  overflow: hidden;
}

.virtual-scroll-container {
  padding: 0;
}

.book-list-wrap .book-cover {
  @media (max-width: 576px) {
    margin: 5px auto;
  }
}

.book-context-menu {
  .arco-dropdown-option {
    width: 100%;

    :deep(.arco-dropdown-option-content) {
      width: 100%;
      box-sizing: border-box;
    }

    .arco-dropdown-option-content button {
      width: 100%;
      box-sizing: border-box;
    }
  }
}
</style>