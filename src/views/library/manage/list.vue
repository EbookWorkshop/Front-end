<template>
  <div class="container">
    <Breadcrumb :items="['menu.library', 'menu.library.manage']" />
    <BookList :title="$t('menu.library.manage')" :is-edit="true" />
  </div>
</template>

<script lang="ts" setup>
  import BookList from '../components/booklist.vue';
</script>

<style scoped lang="less"></style>
