<template>
  <div class="container">
    <Breadcrumb :items="['menu.library', 'menu.library.list']" />
    <div class="wrapper">
      <BookList :title="$t('menu.library.list')" next-router="book" :Api="queryBookList" :tagid="tagid"/>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import BookList from '@/components/book-list/index.vue';
  import { queryBookList } from '@/api/library';
  import { useRoute } from 'vue-router';

  const route = useRoute();
  const tagid = Number(route.params.tagid);
  
</script>

<style scoped lang="less"></style>
