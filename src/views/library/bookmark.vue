<template>
  <div>
    <div class="container">
      <Breadcrumb :items="['menu.library', 'menu.library.tagmanage']" />
      <div class="wrapper">
        <a-grid :cols="{ xs: 1, sm: 2, md: 3, lg: 4, xl: 5, xxl: 5 }" :colGap="20" :rowGap="16">
          <a-grid-item v-for="item of renderData" :key="item.id">
            <a-card :style="{ width: '360px' }" :title="`《${item.BookName}》`">
              <template #extra>
                <a-link @click="gotoChapter(item.ChapterId)">打开</a-link>
                <a-link @click="handleDelete(item.id)">删除</a-link>
              </template>
              <a-typography-text>
                <a-avatar :size="32">
                  <icon-subscribe :style="{ color: 'red' }" />
                </a-avatar>
                {{ item.Title }}
              </a-typography-text>
              <a-card-meta>
                <template #avatar>
                  <a-typography-text>
                    {{ item.createdAt }}
                  </a-typography-text>
                </template>
              </a-card-meta>
            </a-card>
          </a-grid-item>
        </a-grid>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import useRequest from '@/hooks/request';
import { queryBookmark, deleteBookmark } from '@/api/bookmark';
import useBookHelper from '@/hooks/book-helper';
import { Message } from '@arco-design/web-vue';
import { ApiResultCode } from '@/types/global';

const { loading: tableLoading, response: renderData } = useRequest<any[]>(queryBookmark);
const { gotoChapter } = useBookHelper();

const reloadBookmarks = async () => {
  let result = await queryBookmark();
  renderData.value = result.data;
};

const handleDelete = async (id: number) => {
  deleteBookmark(id).then(result => {
    if (result.code = ApiResultCode.Success) {
      Message.success("书签删除成功。");
      reloadBookmarks();
    } else {
      Message.error("删除书签失败：" + result.msg);
    }

  })

};

</script>