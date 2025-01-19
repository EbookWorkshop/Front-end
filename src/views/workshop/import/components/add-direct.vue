<template>
  <a-modal v-model:visible="visible" title="直接录入" :on-before-ok="handleBeforeOk" unmount-on-close
    @cancel="emit('close')">
    <Step4 ref="Step4Ref"></Step4>
  </a-modal>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { addEmptyBook } from '@/api/library';
import Step4 from './import-text-step4.vue';
import { Message } from '@arco-design/web-vue';

const visible = ref(false);
const Step4Ref = ref(null) as any;

const emit = defineEmits(["close"]);


const handleBeforeOk = async (done: any) => {
  const result = await Step4Ref.value.submit();
  if (!result) return;

  result.type = "txt";
  await addEmptyBook(result).then(ok => {
    Message.success("已创建空书");
    emit("close");
  });
};

</script>
