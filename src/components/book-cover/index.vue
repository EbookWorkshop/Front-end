<template>
  <BookWrap v-if="curCover && !curCover?.startsWith('#')" :loading="loading" :title="curBookName" :cover-img="curCover"
    @error="CoverImgError">
    <a-descriptions style="margin-top: 16px" layout="inline-horizontal" :column="2" />
  </BookWrap>
  <BookClassical v-else :loading="loading" :title="curBookName" :title-show="curBookName.replace(/[\(（)].*$/, '')"
    :conver-color="curCover?.startsWith('#') ? curCover : undefined">
  </BookClassical>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import BookWrap from './components/book-wrap.vue'; // 带封面图书
import BookClassical from './components/book-classical.vue'; // 古典线装书风格封面

import { queryBookInfo } from '@/api/book';

// 定义组件入参
const props = defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
  bookId: {
    type: Number,
    default: 0
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

const emit = defineEmits(['complete']);

const curCover = ref(props.coverImg);
const curBookName = ref(props.bookName);

function LoadFromBookId(newId: number) {
  queryBookInfo(newId).then(result => {
    // console.log(result.data);
    curCover.value = result.data.CoverImg;
    curBookName.value = result.data.BookName;

    emit("complete");
  });
}

if (props.bookId > 0) LoadFromBookId(props.bookId);

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

// 新增监听coverImg变化的逻辑
watch(() => props.coverImg, (newVal) => {
  curCover.value = newVal;
});

watch(() => props.bookId, (newVal) => {
  // console.log(newVal);
  if (newVal <= 0 || newVal === undefined) return;
  LoadFromBookId(newVal);
})

</script>
