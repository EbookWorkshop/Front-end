<template>
  <BookWrap
    v-if="CoverImg"
    :loading="loading"
    :title="BookName"
    :cover-img="CoverImg"
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
    :title="BookName"
    :title-show="BookName.replace(/[\(（)].*$/, '')"
  >
  </BookClassical>
</template>

<script lang="ts" setup>
  import BookWrap from './components/book-wrap.vue'; // 带封面图书
  import BookClassical from './components/book-classical.vue'; // 古典线装书风格封面

  const props = defineProps({
    loading: {
      type: Boolean,
      default: true,
    },
    BookName: {
      type: String,
      default: '',
    },
    CoverImg: {
      type: String,
      default: '',
    },
  });
</script>
