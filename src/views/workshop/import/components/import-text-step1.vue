<template>
  <a-space :style="{ marginTop: '20px' }"> &nbsp; </a-space>
  <a-alert v-if="status !== undefined" :type="status"
    >需要先选择导入用的文件。</a-alert
  >
  <a-upload
    draggable
    accept=".txt"
    :auto-upload="false"
    @change="onFileChange"
  />
</template>

<script lang="ts" setup>
  import { PropType } from 'vue';
  import { FileItem } from '@arco-design/web-vue';

  // 传入参数
  defineProps({
    status: String as PropType<
      'normal' | 'error' | 'success' | 'warning' | 'info'
    >,
  });

  const emit = defineEmits(['setFile']);

  const onFileChange = (fileList: FileItem[], curFile: FileItem) => {
    emit('setFile', fileList);
  };
</script>
