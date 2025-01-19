<template>
  <a-empty v-if="renderData != null && renderData.length == 0" />
  <a-spin :loading="loading">
    <a-row :gutter="20" align="stretch" style="overflow-x: hidden">
      <a-col :span="24">
        <a-space direction="horizontal" wrap :v-if="tagsData.length > 0">
          标签：
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

const { response: tagsData } = useRequest<Tag[]>(getTagHasBook);

const router = useRouter();
const goto = (bookid: number) => {
  router.push({
    path: `/${props.nextRouter}/${bookid}`,
  });
};

function CheckTag(id: number | undefined) {
  tagId.value = id;
  loading.value = true;
  props.Api(id).then(result => {
    loading.value = false;
    renderData.value = result.data as any;
    curTag.value = tagsData.value.filter(t => t.id === tagId.value)[0];
  })
}
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
