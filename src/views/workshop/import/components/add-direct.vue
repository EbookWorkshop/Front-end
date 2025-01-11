<template>
  <a-modal  v-model:visible="visible" title="直接录入" :on-before-ok="handleBeforeOk" unmount-on-close @cancel="emit('close')">
    <Step4 ref="Step4Ref"></Step4>
  </a-modal>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import Step4 from './import-text-step4.vue';

const visible = ref(false);
const Step4Ref = ref(null) as any;

const emit = defineEmits(["close"]);

const handleBeforeOk = (done: any) => {

  console.log(Step4Ref.value.submit());

  emit("close")
};

</script>
