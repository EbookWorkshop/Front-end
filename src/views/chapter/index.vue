<template>
  <div class="container">
    <Breadcrumb :items="['menu.library', 'menu.library.list']" />
    <div class="wrapper">
      <!-- loading用的骨架页 -->
      <a-row v-if="loading" :gutter="[0, 32]">
        <a-col :span="6" :offset="9">
          <a-skeleton :animation="true">
            <a-skeleton-line :rows="1" :line-height="42" :line-spacing="10" />
          </a-skeleton>
        </a-col>
        <a-col></a-col>
      </a-row>
      <a-row v-if="loading" :gutter="160">
        <a-col :span="20" :offset="2">
          <a-skeleton :animation="true">
            <a-skeleton-line :rows="20" :line-height="24" :line-spacing="10" />
          </a-skeleton>
        </a-col>
      </a-row>

      <a-row class="grid-chapter" :gutter="[0, 26]">
        <a-col :span="20" class="content" :offset="2">
          <a-typography :style="{ marginTop: '-40px' }">
            <a-typography-title class="title"
              >{{ renderData.Title }}
            </a-typography-title>
            <a-typography-paragraph
              v-for="(p, index) in renderData.Content?.split('\n')"
              :key="index"
            >
              {{ p }}
            </a-typography-paragraph>
          </a-typography>
        </a-col>
      </a-row>
      <a-row :gutter="[8, 32]">
        <a-col :span="2" :offset="9"
          ><a-button
            long
            :disabled="!adjChap.pre"
            @click="gotoChapter(adjChap?.pre?.id)"
            >上一章</a-button
          ></a-col
        >
        <a-col :span="2"
          ><a-button long @click="gotoIndex">目录</a-button></a-col
        >
        <a-col :span="2"
          ><a-button
            long
            :disabled="!adjChap.next"
            @click="gotoChapter(adjChap?.next?.id)"
            >下一章</a-button
          ></a-col
        >
      </a-row>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { Chapter } from '@/types/book'; 
  import {
    queryChapterById,
    queryAdjacentChapterInfo,
  } from '@/api/book';
  import useRequest from '@/hooks/request';
  import useBookHelper from '@/hooks/book-helper';

  const { chapterId, gotoChapter, gotoIndex } = useBookHelper();
  const { loading, response: renderData } = useRequest<Chapter>(
    queryChapterById.bind(null, chapterId)
  );
  const { response: adjChap } = useRequest<any>(
    queryAdjacentChapterInfo.bind(null, chapterId)
  );
</script>

<style>
  .title {
    color: var(--color-neutral-10);
    text-align: center;
  }

  .content {
    color: var(--color-neutral-10);
    font-size: var(--font-size-body-3);
  }

  .showBord {
    border: 1px solid red;
  }

  .chapter {
    height: 48px;
    font-size: 1.2rem;
    text-align: left;
  }
</style>
