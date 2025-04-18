<template>
  <BookWrap v-if="curCover && !curCover?.startsWith('#')" :loading="loading" :title="bookName" :cover-img="curCover"
    @error="CoverImgError">
    <a-descriptions style="margin-top: 16px" layout="inline-horizontal" :column="2" />
  </BookWrap>
  <BookClassical v-else :loading="loading" :title="bookName" :title-show="bookName.replace(/[\(（)].*$/, '')"
    :conver-color="curCover?.startsWith('#') ? curCover : undefined">
  </BookClassical>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import BookWrap from './components/book-wrap.vue'; // 带封面图书
import BookClassical from './components/book-classical.vue'; // 古典线装书风格封面

// 定义组件入参
const props = defineProps({
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

const curCover = ref(props.coverImg);

// 新增监听coverImg变化的逻辑
watch(() => props.coverImg, (newVal) => {
  curCover.value = newVal;
});

/**
 * 当图片出错时，切换为线装本样式显示
 * @param event 
 */
function CoverImgError(event: Event) {
  // 添加判断，仅当当前封面不是颜色值时才进行切换
  if (!curCover.value?.startsWith('#')) {
    curCover.value = "#2e2e2e";
  }
}
</script>
