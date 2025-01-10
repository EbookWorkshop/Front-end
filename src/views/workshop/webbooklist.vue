<template>
  <div class="container">
    <Breadcrumb :items="['menu.library', 'menu.workshop.webbook']" />
    <div class="wrapper">
      <BookList :title="$t('menu.workshop.webbook')" next-router="workshop/webbook/edit" :Api="queryWebBookList" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import BookList from '@/components/book-list/index.vue';
  import { queryWebBookList } from '@/api/library';
</script>F

<style scoped lang="less"></style>
