<template>
  <a-breadcrumb class="container-breadcrumb" v-show="appStore.device !== 'mobile'">
    <a-breadcrumb-item>
      <icon-apps />
    </a-breadcrumb-item>
    <a-breadcrumb-item v-for="item in items" :key="item">
      {{/^\w+(\.\w+)+?/.test(item)? $t(item) : item }}<!-- 非xxx.yyy格式的文本就尝试国际化，直接显示文本 -->
    </a-breadcrumb-item>
  </a-breadcrumb>
</template>

<script lang="ts" setup>
  import { PropType } from 'vue';
  import { useAppStore, useUserStore } from '@/store';
  const appStore = useAppStore();

  defineProps({
    items: {
      type: Array as PropType<string[]>,
      default() {
        return [];
      },
    },
  });
</script>

<style scoped lang="less">
  .container-breadcrumb {
    margin: 16px 0;
    :deep(.arco-breadcrumb-item) {
      color: rgb(var(--gray-6));
      &:last-child {
        color: rgb(var(--gray-8));
      }
    }
  }
</style>
