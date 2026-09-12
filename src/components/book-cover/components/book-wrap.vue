<template>
  <div class="book-wrap">
    <a-card v-if="loading" :bordered="false" hoverable>
      <slot name="skeleton" />
    </a-card>
    <a-card v-else :bordered="false" hoverable>
      <template #cover>
        <div class="cover">
          <img :src="coverUrl" :alt="title" @load="emit('load')" @error="emit('error', $event)" />
        </div>
      </template>

      <a-space v-if="showBookName" align="start">
        <a-card-meta>
          <template #title>
            <a-typography-text :class="titleClasses">{{ title }}</a-typography-text>
          </template>
        </a-card-meta>
      </a-space>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

const props = defineProps({
  loading: { type: Boolean, default: false },
  title: { type: String, default: '' },
  /** 已解析为可直接使用的绝对地址 */
  coverUrl: { type: String, default: '' },
  /** 是否在图片上叠加书名 */
  showBookName: { type: Boolean, default: true },
});

const emit = defineEmits<{
  (e: 'load'): void;
  (e: 'error', event: Event): void;
}>();

const titleClasses = computed(() =>
  props.title.length <= 9 ? 'book-title' : `book-title-${props.title.length}`,
);
</script>

<style scoped lang="less">
.book-wrap {
  width: 264px;
  height: 360px;
  margin: 20px 20px;
  border: 1px solid var(--color-neutral-3);
  border-radius: 4px;
  transition: all 0.3s;

  &:hover {
    transform: translateY(-4px);
    cursor: pointer;
  }

  .cover {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 264px;
    height: 360px;
    overflow: hidden;
    box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.22);

    img {
      display: block;
      width: 100%;
    }
  }

  :deep(.arco-card) {
    height: 100%;
    overflow: hidden;
    border-radius: 4px;

    .arco-card-body:has(div) {
      /* 标题遮罩 */
      position: absolute;
      bottom: 0;
      width: 100%;
      padding: 0;
      font-weight: bold;
      background-color: rgba(0, 0, 0, 0.9);
      opacity: 0.6;

      .arco-space {
        width: 100%;
        height: 100%;

        .arco-space-item {
          justify-content: center;
          width: 100%;
        }
      }
    }

    &:hover .arco-card-body {
      opacity: 1;
    }
  }

  .book-title {
    font-size: 28px;
  }

  .book-title-10 {
    font-size: 25px;
  }

  .book-title-11 {
    font-size: 25px;
  }

  .book-title-12 {
    font-size: 22px;
  }

  .book-title-13 {
    font-size: 22px;
  }

  .book-title-14 {
    font-size: 22px;
  }

  .book-title-15 {
    font-size: 22px;
  }

  .book-title-16 {
    font-size: 21px;
  }

  .book-title-17 {
    font-size: 20px;
  }

  .book-title-18 {
    font-size: 19px;
  }

  :deep(.arco-card-meta-title) {
    line-height: 28px;
    text-align: center;

    .arco-typography {
      color: white;
    }
  }

  :deep(.arco-skeleton-line) {
    &:last-child {
      display: flex;
      justify-content: flex-end;
      margin-top: 20px;
    }
  }
}
</style>