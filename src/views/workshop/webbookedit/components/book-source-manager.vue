<template>
  <SourceManagerModal
    v-model:visible="innerVisible"
    :title="`来源管理-【${bookName}】`"
    :source-id="bookId"
    :columns="[`source`,`type`]"
    :load-fn="queryBookSourcesById"
    :update-fn="updateWebBookSourcesById"
    :create-fn="createWebBookSource"
    :delete-fn="deleteWebBookSourceById"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import SourceManagerModal from '@/components/source-manager/modal.vue';
import {
  queryBookSourcesById,
  updateWebBookSourcesById,
  createWebBookSource,
  deleteWebBookSourceById,
} from '@/api/book';

const props = defineProps<{
  visible: boolean;
  bookId: number;
  bookName: string;
}>();

const emit = defineEmits<{ (e: 'update:visible', v: boolean): void }>();

const innerVisible = computed({
  get: () => props.visible,
  set: (v) => emit('update:visible', v),
});
</script>