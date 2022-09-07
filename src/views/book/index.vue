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
      <a-col :span="14" :offset="1">
        <a-row :gutter="20" align="center" justify="center">
          <a-col :span="10" style="margin-top: 50px; text-align: center">
            <a-typography-title> {{ renderData.BookName }}</a-typography-title>
          </a-col>
          <a-col :span="14"> </a-col>
        </a-row>
        <a-row>
          <!-- 书详情页面 -->
          <a-col :offset="2">
            <a-typography-text>作者：</a-typography-text>
          </a-col>
          <a-col :offset="2">
            <a-typography-text>简介：</a-typography-text>
          </a-col>
          <a-col>&nbsp;</a-col>
        </a-row>
        <template v-if="isEdit">
          <!-- 管理按钮 -->
          <a-row justify="start">
            <a-col>
              <a-space wrap>
                <a-select
                  :style="{ width: '160px' }"
                  placeholder="指定其它数据来源"
                  :trigger-props="{ autoFitPopupMinWidth: true }"
                >
                  <a-option>http://www.qidian.com</a-option>
                </a-select>
                <a-button type="primary" size="large">
                  <icon-loop />同步目录
                </a-button>

                <a-badge :count="chapterHasCheckedNum">
                  <a-button-group status="warning" style="align-items: stretch">
                    <a-button type="primary" size="large">
                      <a-checkbox value="all-empty" @change="checkEmptyChapter"
                        >选中空章节</a-checkbox
                      >
                    </a-button>
                    <a-button
                      type="primary"
                      size="large"
                      style="height: unset !important"
                    >
                      <template #icon>
                        <icon-down />
                      </template>
                    </a-button>
                  </a-button-group>
                </a-badge>

                <a-button
                  type="primary"
                  size="large"
                  status="success"
                  @click="goToGetAllChapter"
                >
                  <icon-robot-add />获取选中章节内容
                </a-button>
                <a-button size="large">
                  <icon-ordered-list />章节排序
                </a-button>
              </a-space>
            </a-col>
          </a-row>
          <a-row justify="start">
            <a-col>
              <a-button type="outline" size="large">
                <icon-mobile />发送到默认邮箱账户
              </a-button>
            </a-col>
          </a-row>
        </template>
      </a-col>
    </a-row>
    <a-row class="grid-chapter" style="margin-bottom: 16px">
      <a-col :span="20" :offset="2">
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
                  <a-checkbox
                    :value="item.IndexId"
                    :model-value="indexOptionMap.get(item.IndexId)?.isCheck"
                    @change="changeChapterIsCheck"
                  >
                    {{ item.Title }}
                  </a-checkbox>
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
  import { ref, reactive } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import { queryBookById, updateChapter, Book, Chapter } from '@/api/book';
  import useRequest from '@/hooks/request';
  import BookCover from '@/components/book-cover/index.vue';

  const route = useRoute();
  const router = useRouter();

  // 已选中的章节数
  const chapterHasCheckedNum = ref(0);
  // 章节选项数据对象
  const indexOptionMap = new Map();

  /**
   * 编辑模式下页面的细节选项
   * [TODO]: 这玩意加上之后渲染明显变慢了
   * @param data
   */
  function InitEditModelOption(data: Book) {
    data.Index.map((i) => {
      const temOption = reactive({
        // indexId: i.IndexId,
        isCheck: false,
        isHasContent: i.IsHasContent,
      });
      indexOptionMap.set(i.IndexId, temOption);
      return i;
    });
  }

  // 每一个章节是否选中时触发
  const changeChapterIsCheck = (
    isChecked: boolean | (string | number | boolean)[],
    ev: any
  ) => {
    chapterHasCheckedNum.value += isChecked ? 1 : -1;
    indexOptionMap.get(Number(ev.target.value)).isCheck = isChecked; // DEBUG: 直觉这不是正常做法——当checkbox的选中绑定对象后，不能直接通过鼠标操作选中了，只能通过修改对应的绑定值实现
    return true;
  };

  // 是否编辑模式
  const isEdit = route.path.includes('/bookedit/');
  // 当前书的ID
  const bookid = Number(route.params.id);
  const queryBook = () => {
    return queryBookById(bookid).then((rsl: any) => {
      if (isEdit) {
        new Promise((ok: any) => {
          ok();
        }).then(() => {
          InitEditModelOption(rsl.data);
        });
      }
      return rsl;
    });
  };

  const { loading, response: renderData } = useRequest<Book>(queryBook);

  const showeditmenu = (chapterId: number) => {};

  // 切换是否选中空章节
  const checkEmptyChapter = (
    isChecked: boolean | (string | number | boolean)[]
  ) => {
    let count = 0;
    indexOptionMap.forEach((i: any) => {
      if (i.isHasContent) return;
      i.isCheck = isChecked;
      count += 1;
    });
    chapterHasCheckedNum.value += isChecked ? count : -count;
  };

  // 开始爬选中的章节
  const goToGetAllChapter = () => {
    const chapterOnCheck: number[] = [];
    indexOptionMap.forEach((i: any, key: any) => {
      if (i.isCheck) chapterOnCheck.push(key);
    });

    updateChapter(bookid, chapterOnCheck);
  };

  // 只读模式下的打开章节
  const goto = (chapterId: number) => {
    router.push({ path: `/book/${bookid}/chapter/${chapterId}` });
  };
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
