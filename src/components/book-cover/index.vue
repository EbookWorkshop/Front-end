<template>
  <BookClassical v-if="source.kind === 'classical'" :loading="loading" :title-show="classicalTitle"
    :cover-color="source.color" />
  <BookWrap v-else :loading="loading" :title="bookName" :cover-url="source.url" :show-book-name="source.showBookName"
    @error="markImageFailed" />
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue';
import BookWrap from './components/book-wrap.vue';
import BookClassical from './components/book-classical.vue';
import { queryBookInfo } from '@/api/book';
import { useCoverSource } from './use-cover-source';

const props = defineProps({
  loading: { type: Boolean, default: false },
  bookId: { type: Number, default: 0 },
  bookName: { type: String, default: '' },
  coverImg: { type: String, default: '' },
  showEmbedBookName: { type: Boolean, default: false },
});

const emit = defineEmits(['complete']);

/** 封面原始值：可能来自 props，也可能来自 bookId 查询 */
const rawCover = ref(props.coverImg);
const bookName = ref(props.bookName);
const showEmbedBookName = computed(() => props.showEmbedBookName);

const { source, markImageFailed } = useCoverSource(rawCover, showEmbedBookName);

/** 线装书标题去掉括号后缀，如图封面仍显示完整书名 */
const classicalTitle = computed(() => bookName.value.replace(/[\(（)].*$/, ''));

async function loadFromBookId(id: number) {
  if (!id || id <= 0) return;
  const { data } = await queryBookInfo(id);
  rawCover.value = data.CoverImg;
  bookName.value = data.BookName;
  emit('complete');
}

watch(() => props.bookId, loadFromBookId, { immediate: true });
watch(() => props.coverImg, (value) => { rawCover.value = value; });
watch(() => props.bookName, (value) => { bookName.value = value; });
</script>