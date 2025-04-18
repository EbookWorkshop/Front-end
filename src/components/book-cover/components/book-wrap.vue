<template>
  <div class="book-wrap">
    <a-card v-if="loading" :bordered="false" hoverable>
      <slot name="skeleton"></slot>
    </a-card>
    <a-card v-else :bordered="false" hoverable>
      <template #cover>
        <div :style="{
          overflow: 'hidden',
        }">
          <img :style="{ width: '100%' }" :alt="title" :src=showImageUrl @error="imgError" />
        </div>
      </template>
      <a-space align="start">
        <a-card-meta>
          <template #title>
            <a-typography-text>
              {{ title }}
            </a-typography-text>
          </template>
        </a-card-meta>
      </a-space>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { getApiBaseUrl } from '@/utils/config';
const ASSETS_HOST = getApiBaseUrl();
const props = defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: '',
  },
  coverImg: {
    type: String,
    default: '',
  },
});
const emiter = defineEmits(["error"]);

const showImageUrl = computed<string>(() => {
  if (props.coverImg.startsWith('blob:')) {
    return props.coverImg;
  } else {
    return ASSETS_HOST + props.coverImg;
  }
});

function imgError(event: Event) {
  emiter("error", event);
}
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
    // box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.1);
  }

  :deep(.arco-card) {
    height: 100%;
    overflow: hidden;
    border-radius: 4px;

    .arco-card-body {
      /* 标题部分 */
      position: absolute;
      width: 100%;
      background-color: rgba(0, 0, 0, 0.9);
      bottom: 0;
      opacity: 0.6;
      font-weight: bold;

      .arco-space {
        width: 100%;
        height: 100%;

        .arco-space-item {
          justify-content: center;
          width: 100%;
        }
      }
    }

    &:hover {
      .arco-card-body {
        opacity: 1;
      }
    }
  }

  :deep(.arco-card-meta-title) {
    // To prevent the shaking
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
