<template>
  <a-modal
    v-model:visible="visible"
    title="从网址导入"
    :on-before-ok="handleBeforeOk"
    :width="520"
    unmount-on-close
  >
    <a-alert type="info">请输入要导入的书籍目录页的网址。</a-alert>
    <a-form :model="form" style="margin-top: 20px;">
      <a-form-item field="indexUrl" label="网址" required>
        <a-input v-model="form.indexUrl" placeholder="例如: https://example.com/book/123" allow-clear />
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
        if(form.indexUrl.trim() === ''){
          done(false);
          return;
        }
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
