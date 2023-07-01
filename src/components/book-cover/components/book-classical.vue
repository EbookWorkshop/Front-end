<template>
  <div class="book-wrap bookstyle-classical">
    <a-card v-if="loading" :bordered="false" hoverable>
      <slot name="skeleton"></slot>
    </a-card>
    <a-card
      v-else
      :bordered="false"
      hoverable
      :body-style="{
        backgroundColor: converColor,
      }"
    >
      <a-space align="start">
        <a-card-meta>
          <template v-if="isHasSubTitle" #title>
            <a-typography-text class="sub-title sub-title-s">
              {{ sTitle }}
            </a-typography-text>
            <div></div>
            <a-typography-text class="sub-title sub-title-f">
              {{ fTitle }}
            </a-typography-text>
          </template>
          <template v-else #title>
            <a-typography-text
              :class="titleShow.length >= 8 ? 'large-text' : ''"
            >
              {{ titleShow }}
            </a-typography-text>
          </template>

          <!-- 装订线 -->
          <template #description>
            <div class="binding-line">
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
  import { PropType } from 'vue';

  // import { ref } from 'vue';
  const props = defineProps({
    loading: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '',
    },
    titleShow: {
      type: String,
      default: '',
    },
    hasSubTitle: {
      type: Boolean,
      default: true,
    },
    /**
     * 封面颜色：
     * + [藏青：#0b3154]
     * + [红绸：#cb1f2f]
     * + [白锦：#f2e3a4]
     * + [青灰：#212f30]
     */
    converColor: {
      type: String, // as PropType<'#0b3154'|'#cb1f2f'|'#f2e3a4'|'#212f30'>,
      default: '#0b3154',
    },
  });
  let fTitle = '';
  let sTitle = '';
  const isHasSubTitle = (() => {
    if (props.titleShow.length <= 13) return false;
    if (props.titleShow.match(/[:—：]+/) !== null) {
      const rsl = props.titleShow.split(/[:—：]+/);
      [fTitle, sTitle] = rsl;
      return true;
    }
    return false;
  })();
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

      // To prevent the shaking
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
    // :deep(.arco-card-body) {
    //   background-color: #0b3154;
    // }
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

      .arco-typography {
        position: absolute;
        top: 20px;
        margin-left: 3px;
        color: black;
        font-size: 1.5rem;
        writing-mode: vertical-lr;
      }

      .large-text {
        margin-left: 8px;
        font-size: 1rem;
      }

      .sub-title {
        font-size: 0.5rem;
      }

      .sub-title-f {
        position: absolute;
        top: 20px;
        right: 5px;
      }

      .sub-title-s {
        position: absolute;
        top: inherit;
        bottom: 20px;
        left: 2px;
      }
    }

    .binding-line {
      position: absolute;
      top: 0;
      left: 0;
      width: 30px;
      height: 100%;
      border-right: 2px solid lightblue;

      .binding-line-cross {
        position: absolute;
        top: 35px;
        width: 100%;
        height: 28%;
        border-top: 1px solid lightblue;
        border-bottom: 1px solid lightblue;

        &:last-child {
          top: unset;
          bottom: 35px;
        }
      }
    }
  }
</style>
