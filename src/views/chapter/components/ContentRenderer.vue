<template>
  <div class="content-renderer">
    <a-typography-paragraph v-for="(item, index) in content" :key="index" class="paragraph" :style="item.style"
      v-html="item.text" />
  </div>
</template>

<script lang="ts" setup>
export interface ContentItem {
  text: string
  style: {
    color: string
    fontSize: string
    fontFamily: string
  }
}
defineProps<{ content: ContentItem[] }>()

</script>

<style scoped>
.content-renderer {
  line-height: 1.8;
  letter-spacing: 0.05em;
}

.paragraph {
  text-indent: 2em;
}
/* 
.paragraph::before {
  content: '　　';
} */
</style>
