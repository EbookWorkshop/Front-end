<template>
  <div class="container">
    <Breadcrumb :items="['menu.library', 'menu.library.list']" />
    <BookList :title="$t('menu.library.list')" next-router="book" />
  </div>
</template>

<script lang="ts" setup>
  import BookList from '@/components/book-list/index.vue';
</script>

<style scoped lang="less"></style>
