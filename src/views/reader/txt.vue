<template>
  <div class="container">
    <Breadcrumb :items="['menu.library', 'menu.library.list', fileName]" />
    <div class="wrapper">
      <a-row class="grid-chapter" :gutter="[0, 120]">
        <a-col :span="20" class="content" :offset="2">
          <a-typography :style="{ marginTop: '-40px' }">
            <a-typography-title class="title">{{ fileName }}</a-typography-title>
            <a-skeleton v-if="loading" :animation="true">
              <a-skeleton-line :rows="20" :line-height="24" :line-spacing="10" />
            </a-skeleton>
            <ContentRender v-else :content="processedContent" />
          </a-typography>
        </a-col>
      </a-row>

    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import ContentRender, { type ContentItem } from '@/components/content-render/index.vue'
import { getArchiveBook } from '@/api/book'
const route = useRoute();

//变量
const fileName = ref(route.query.name || '');
const filePath = ref(route.query.path || '');
const processedContent = ref<ContentItem[]>([])
const loading = ref(true);
getArchiveBook(filePath.value as string).then(data => {
  const EmptyRowReg = new RegExp("^(\\s?)+$")
  processedContent.value = data.split('\n').filter((f: string) => !EmptyRowReg.test(f)).map((p: String) => ({
    text: p.trim(),
    style: {
      color: "var(--color-neutral-8)",
      fontSize: "24px",
    }
  }));
  if (processedContent.value[0].text.trim() === fileName.value) processedContent.value.shift();
  loading.value = false;
})

</script>

<style scoped>
.wrapper {
  overflow-y: hidden !important;
}

.title {
  color: var(--color-neutral-10);
  text-align: center;
}

.content {
  color: var(--color-neutral-10);
  font-size: var(--font-size-body-3);
}

.toolbar {
  margin: 48px auto;
}


.keyword {
  color: rgb(var(--red-6));
  background-color: cornsilk;
  font-weight: bold;
}

.content :deep(ul.arco-skeleton-line) {
  padding-left: 0;
  list-style: none;
  margin: 0;
}
</style>
