<script lang="ts" setup>
import { ref } from 'vue';
import { ApiResultCode } from '@/types/global';
import useRequest from '@/hooks/request';
import { queryTagByBookId, addTagForBook, removeTagForBook, getAllTag } from '@/api/tag';
import type { Tag } from '@/api/tag';
interface Props {
  bookId: number;  // 新增bookId prop
}

const props = defineProps<Props>();

// 内部状态管理
const { response: tags } = useRequest<Array<Tag>>(
  () => queryTagByBookId(props.bookId), []
);
const { response: allTags } = useRequest<Array<Tag>>(getAllTag);

const delMode = ref(false);
const showInput = ref(false);
const inputValue = ref("");

// 标签操作逻辑
const handleAddTag = () => {
  if (inputValue.value) {
    const exist = tags.value?.some(t => t.Text === inputValue.value);
    if (!exist) {
      addTagForBook(props.bookId, inputValue.value).then(result => {
        if (result.code === ApiResultCode.Success) {
          tags.value?.push(result.data);
        }
      });
    }
    inputValue.value = '';
  }
  showInput.value = false;
};

const handleDeleteTag = (tagId: number) => {
  removeTagForBook(props.bookId, tagId).then(() => {
    tags.value = tags.value?.filter(t => t.id !== tagId) || [];
  });
};
</script>

<template>
  <a-space direction="horizontal" wrap>
    <a-tag v-for="t in tags" :key="t.id" :color="t.Color" :closable="delMode" @close="handleDeleteTag(t.id)">
      {{ t.Text }}
    </a-tag>
    <a-select v-if="showInput" v-model="inputValue" placeholder="请选择/输入并创建标签。" @change="handleAddTag" allow-create
      style="width: 210px; margin-left: 8px;" @blur="showInput = false" size="small">
      <a-option v-for="tag in allTags.filter(t => !tags.find(bt => bt.id == t.id))" :key="tag.id" :value="tag.Text">
        <a-tag :color="tag.Color" :style="{ width: '100%' }">{{ tag.Text }}</a-tag>
      </a-option>
    </a-select>
    <span v-else>
      <a-tag class="action-tag" @check="showInput = true" :checkable="true">
        <template #icon><icon-plus /></template>
      </a-tag>
      <a-tag class="action-tag" @check="delMode = !delMode" :color="delMode ? '#f53f3f' : ''" :checkable="true">
        <template #icon><icon-delete /></template>
      </a-tag>
    </span>
  </a-space>
</template>
<style lang="css">
.arco-select-option-content {
  width: 100%;
}
</style>