<template>
  <div class="book-wrap bookstyle-classical">
    <a-card v-if="loading" :bordered="false" hoverable>
      <slot name="skeleton" />
    </a-card>
    <a-card v-else :bordered="false" hoverable :body-style="{ backgroundColor: coverColor }">
      <a-space align="start">
        <a-card-meta>
          <template #title>
            <template v-if="titleParts">
              <a-typography-text class="book-title sub-title sub-title-s">
                {{ titleParts.second }}
              </a-typography-text>
              <div></div>
              <a-typography-text class="book-title sub-title sub-title-f">
                {{ titleParts.first }}
              </a-typography-text>
            </template>
            <a-typography-text v-else :class="titleClasses">
              {{ titleShow }}
            </a-typography-text>
          </template>

          <template #description>
            <div :class="bindingLineClasses">
              <div class="binding-line-cross"></div>
              <div class="binding-line-cross"></div>
            </div>
          </template>
        </a-card-meta>
      </a-space>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

/** 白锦底色需要配红色装订线 */
const WHITE_BROCADE = '#f2e3a4';
/** 书名分割符号 */
const TITLE_SPLIT_PATTERN = /[:—：、，-]+/;

const props = defineProps({
  loading: { type: Boolean, default: false },
  /** 用于展示的书名（已去除括号后缀） */
  titleShow: { type: String, default: '' },
  /** 封面底色，如 #0b3154 / #cb1f2f / #f2e3a4 / #212f30 */
  coverColor: { type: String, default: '#0b3154' },
});

/** 主标题过长时拆成上下两行竖排 */
const titleParts = computed(() => {
  const title = props.titleShow;
  if (title.length < 11) return null;
  if (TITLE_SPLIT_PATTERN.test(title)) {
    const [first, second] = title.split(TITLE_SPLIT_PATTERN);
    return { first, second };
  }
  return { first: title.slice(0, 6), second: title.slice(6) };
});

const titleClasses = computed(() => [
  'book-title',
  props.titleShow.length >= 8 ? 'large-text' : '',
  `title-word-count-${props.titleShow.length}`,
]);

const bindingLineClasses = computed(() => [
  'binding-line',
  props.coverColor.toLowerCase() === WHITE_BROCADE ? 'binding-line-red' : '',
]);
</script>

<style scoped lang="less">
/* 样式与原文件一致，仅将 .book-title 的 class 拼接改由 titleClasses 输出 */
.book-wrap {
  width: 264px;
  height: 360px;
  margin: 20px 20px;
  border: 1px solid var(--color-neutral-5);
  border-radius: 4px;
  transition: all 0.3s;

  &:hover {
    transform: translateY(-4px);
    cursor: pointer;
  }

  :deep(.arco-card) {
    height: 100%;
    border-radius: 4px;

    .arco-card-body {
      height: 100%;

      .arco-space {
        width: 100%;
        height: 100%;

        .arco-space-item {
          height: 100%;

          &:last-child {
            flex: 1;
          }

          .arco-card-meta {
            display: flex;
            flex-flow: column;
            height: 100%;
          }
        }
      }
    }
  }

  :deep(.arco-card-meta-title) {
    display: flex;
    align-items: center;
    line-height: 28px;
  }

  :deep(.arco-skeleton-line) {
    &:last-child {
      display: flex;
      justify-content: flex-end;
      margin-top: 20px;
    }
  }
}

.bookstyle-classical {
  :deep(.arco-card-meta-title) {
    position: absolute;
    top: 50px;
    right: 40px;
    box-sizing: border-box;
    width: 45px;
    height: 180px;
    min-height: 180px;
    padding: 2px 2px;
    overflow: hidden;
    background-color: white;
    border: 1px solid black;

    &::before {
      position: absolute;
      width: 33px;
      height: 168px;
      border: 3px solid darkred;
      content: ' ';
    }

    .book-title {
      position: absolute;
      color: black;
      font-size: 1.5rem;
      line-height: 1.5rem;
      font-family: "微软雅黑";
      text-align: center;
    }

    .title-word-count-2 {
      line-height: 5rem;
    }

    .title-word-count-3 {
      line-height: 3rem;
    }

    .title-word-count-4 {
      line-height: 2.5rem;
    }

    .title-word-count-5 {
      line-height: 2rem;
    }

    .title-word-count-6 {
      line-height: 1.6rem;
    }

    .large-text {
      top: 20px;
      left: 1rem;
      width: 1rem;
      margin-left: 0;
      font-size: 1rem;
      line-height: 1rem;
    }

    .title-word-count-8 {
      line-height: 1.1rem !important;
    }

    .title-word-count-11 {
      top: 13px;
    }

    .sub-title {
      width: 0.7rem;
      font-size: 0.7rem;
      line-height: 0.8rem;
    }

    .sub-title-f {
      position: absolute;
      top: 1rem;
      right: 0.7rem;
    }

    .sub-title-s {
      position: absolute;
      bottom: 1rem;
      left: 0.7rem;
    }
  }

  .binding-line {
    position: absolute;
    top: 0;
    left: 0;
    width: 30px;
    height: 100%;
    border-right: 3px solid lightblue;

    .binding-line-cross {
      position: absolute;
      top: 35px;
      width: 100%;
      height: 28%;
      border-top: 2px solid lightblue;
      border-bottom: 2px solid lightblue;

      &:last-child {
        top: unset;
        bottom: 35px;
      }
    }
  }

  .binding-line-red {
    border-right: 3px solid #a1151e;

    .binding-line-cross {
      border-top: 2px solid #a1151e;
      border-bottom: 2px solid #a1151e;
    }
  }
}
</style>