<template>
  <BookWrap
    v-if="coverImg && !coverImg?.startsWith('#')"
    :loading="loading"
    :title="bookName"
    :cover-img="coverImg"
  >
    <a-descriptions
      style="margin-top: 16px"
      layout="inline-horizontal"
      :column="2"
    />
  </BookWrap>
  <BookClassical
    v-else
    :loading="loading"
    :title="bookName"
    :title-show="bookName.replace(/[\(（)].*$/, '')"
    :conver-color="coverImg?.startsWith('#') ? coverImg : undefined"
  >
  </BookClassical>
</template>

<script lang="ts" setup>
  import BookWrap from './components/book-wrap.vue'; // 带封面图书
  import BookClassical from './components/book-classical.vue'; // 古典线装书风格封面

  // 定义组件入参
  defineProps({
    loading: {
      type: Boolean,
      default: false,
    },
    bookName: {
      type: String,
      default: '',
    },
    coverImg: {
      type: String,
      default: '',
    },
  });
</script>
