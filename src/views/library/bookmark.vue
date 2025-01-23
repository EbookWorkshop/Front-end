<template>
  <div>
    <div class="container">
      <Breadcrumb :items="['menu.library', 'menu.library.tagmanage']" />
      <div class="wrapper">
        <a-grid :cols="{ xs: 1, sm: 2, md: 3, lg: 4, xl: 5, xxl: 5 }" :colGap="20" :rowGap="16">
          <a-grid-item v-for="item of renderData" :key="item.id">
            <a-card :style="{ width: '360px' }" :title="`《${item.BookName}》`">
              <template #extra>
                <a-link>打开</a-link>
                <a-link>删除</a-link>
              </template>
              <a-typography-text>
                <icon-subscribe :style="{ color: 'red' }" />
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
import { reactive, ref } from 'vue';
import useRequest from '@/hooks/request';
import { queryBookmark } from '@/api/bookmark';
// import { Message } from '@arco-design/web-vue';

const { loading: tableLoading, response: renderData } = useRequest<any[]>(queryBookmark);



</script>