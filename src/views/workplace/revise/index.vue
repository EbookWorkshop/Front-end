<!--  修订 -->
<template>
  <div class="container">
    <Breadcrumb :items="['menu.workplace', 'menu.workplace.revise']" />
    <div class="wrapper">
      <BookList :title="$t('menu.workplace.revise')" next-router="workplace/revise/book" :Api="queryBookList"></BookList>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import BookList from '@/components/book-list/index.vue';
  import { queryBookList } from '@/api/library';
</script>
