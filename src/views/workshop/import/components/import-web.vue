<template>
  <a-modal
    v-model:visible="visible"
    title="从网址导入"
    :on-before-ok="handleBeforeOk"
    unmount-on-close
  >
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
    emits: ['check'],
    setup(props: any, ctx: any) {
      const visible = ref(false);
      const form = reactive({
        indexUrl: '',
      });

      const handleBeforeOk = (done: any) => {
        ctx.emit('check', form.indexUrl);
        done(false);
      };

      return {
        visible,
        form,
        handleBeforeOk,
      };
    },
  };
</script>
