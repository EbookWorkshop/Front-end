<template>
  <a-select
    :style="{ width: '100%' }"
    size="large"
    placeholder="请选一本书"
    :loading="loading"
    allow-search
  >
    <a-option v-for="b in renderData" :key="b.BookId" :value="b.BookId">{{
      b.BookName
    }}</a-option>
  </a-select>
</template>

<script lang="ts" setup>
  import type { Book } from '@/types/book';
  import { queryBookList } from '@/api/library';
  import useRequest from '@/hooks/request';

  const { loading, response: renderData } = useRequest<Book[]>(queryBookList);
</script>
