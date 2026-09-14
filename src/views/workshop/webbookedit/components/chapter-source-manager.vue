<template>
  <SourceManagerModal
    v-model:visible="innerVisible"
    :title="`来源管理-【${chapterTitle}】`"
    :source-id="chapterId"
    :load-fn="getChapterSource"
    :update-fn="updateWebBookChapterSourcesById"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import SourceManagerModal from '@/components/source-manager/modal.vue';
import { getChapterSource, updateWebBookChapterSourcesById } from '@/api/book';

const props = defineProps<{
  visible: boolean;
  chapterId: number;
  chapterTitle: string;
}>();

const emit = defineEmits<{ (e: 'update:visible', v: boolean): void }>();

const innerVisible = computed({
  get: () => props.visible,
  set: (v) => emit('update:visible', v),
});
</script>