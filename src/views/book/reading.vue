<template>
  <div class="container">
    <Breadcrumb :items="['menu.library', 'menu.library.list']" />
    <div class="wrapper">
      <BookIndex @click-chapter="gotoChapter" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from "vue";
import BookIndex from "@/components/book-index/index.vue"
import useBookHelper from '@/hooks/book-helper';
const { bookId, gotoChapter, gotoIndex } = useBookHelper();


</script>
