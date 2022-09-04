<template>
  <a-modal v-model:visible="visible" title="从网址导入">
    <a-form :model="form">
      <a-form-item field="indexUrl" label="网址">
        <a-textarea v-model="form.indexUrl" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts">
  import { reactive, ref } from 'vue';

  export default {
    setup() {
      const visible = ref(false);
      const form = reactive({
        indexUrl: '',
      });

      const handleClick = () => {
        visible.value = true;
      };
      const handleBeforeOk = (param: string) => {
        console.log('组件内部', param);
        window.setTimeout(() => {
          // done(true)
          // prevent close
          // done(false)
        }, 1000);
      };
      const handleCancel = () => {
        visible.value = false;
      };

      return {
        visible,
        form,
        handleClick,
        handleBeforeOk,
        handleCancel,
      };
    },
  };
</script>
