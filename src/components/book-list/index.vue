<template>
  <a-empty v-if="renderData != null && renderData.length == 0 && !loading" />
  
  <a-spin v-else :loading="loading" tip="加载中..." :size="64" style="width: 100%; height: 100%;min-height: 200px;">
    <a-row :gutter="20" align="stretch" style="overflow-x: hidden">
      <!-- 标签工具栏 -->
      <a-col :span="24" v-if="renderData.length > 0">
        <a-space direction="horizontal" wrap :v-if="tagsData.length > 0">
          <span :style="{color:'var(--color-neutral-8)'}">标签：</span>
          <template v-if="tagId ?? 0 > 0">
            <a-tag :color="curTag?.Color" :style="{ cursor: 'pointer' }">
              {{ curTag?.Text }}({{ curTag?.Count }})
            </a-tag>
            <a-tag @click="CheckTag(undefined)"><template #icon><icon-close /></template> </a-tag>
          </template>
          <template v-else>
            <a-tag v-for="t of tagsData" :color="t.Color" :key="t.id" :style="{ cursor: 'pointer' }"
              @click="CheckTag(t.id)">
              {{ t.Text }}({{ t.Count }})
            </a-tag>
          </template>
        </a-space>
      </a-col>
      <a-divider />
      <a-col :span="24">
        <a-card class="general-card">
          <div class="book-list-wrap">
            <a-row class="list-row" :gutter="24">
              <!-- 一行 -->
              <a-col v-for="item in renderData" :key="item.BookId" class="list-col" :xs="24" :sm="12" :md="12" :lg="6"
                :xl="6" :xxl="4" @click="goto(item.BookId)">
                <BookCover :loading="loading" :book-name="item.BookName" :cover-img="item.CoverImg">
                </BookCover>
              </a-col>
            </a-row>
          </div>
        </a-card>
      </a-col>
    </a-row>
  </a-spin>
</template>

<script lang="ts" setup>
import { PropType, ref } from 'vue';
import { useRouter } from 'vue-router';
import { ListQueryApi } from '@/api/library';
import { getTagHasBook, Tag } from '@/api/tag';
import { Book } from '@/types/book';
import useRequest from '../../hooks/request';
import BookCover from '../book-cover/index.vue';


// 入参
const props = defineProps({
  title: String,
  nextRouter: String,
  tagid: Number,
  Api: {
    type: Function as PropType<ListQueryApi>,
    required: true
  }
});
const tagId = ref(props.tagid);
const curTag = ref<Tag>();
const defaultValue: Book[] = new Array().fill({});

/**
 * renderData --实际的数据
 */
const { loading, response: renderData } = useRequest<Book[]>(
  props.Api.bind(null, props.tagid),
  defaultValue
);

//标签相关逻辑
const { response: tagsData } = useRequest<Tag[]>(getTagHasBook);
function CheckTag(id: number | undefined) {
  tagId.value = id;
  loading.value = true;
  props.Api(id).then(result => {
    loading.value = false;
    renderData.value = result.data as any;
    curTag.value = tagsData.value.filter(t => t.id === tagId.value)[0];
  })
}

const router = useRouter();
const goto = (bookid: number) => {
  router.push({
    path: `/${props.nextRouter}/${bookid}`,
  });
};
</script>

<style scoped lang="less">
.list-col {
  min-width: 302px;
}

.empty-wrap {
  height: 200px;
  border-radius: 4px;

  :deep(.arco-card) {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    border-radius: 4px;

    .arco-result-title {
      color: rgb(var(--gray-6));
    }
  }
}
</style>
