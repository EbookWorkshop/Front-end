<template>
  <a-select default-value="" :style="{ width: '100%', minWidth: '180px' }" size="large" :placeholder="`请选一${isMultiple ? '些' : '本'}书`"
    :loading="loading" allow-search :multiple="isMultiple" :allowCreate="false">
    <a-option v-for="b in renderData" :key="b.BookId" :value="b.BookId">{{
      b.BookName
    }}</a-option>
  </a-select>
</template>

<script lang="ts" setup>
import type { Book } from '@/types/book';
import { queryBookList } from '@/api/library';
import useRequest from '@/hooks/request';

const props = defineProps<{ isMultiple?: boolean; }>();

const { loading, response: renderData } = useRequest<Book[]>(queryBookList);
</script>
