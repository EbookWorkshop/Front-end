<template>
  <a-affix :offset-top="80" style="text-align: center;">
    <a-progress :percent="status.percent" :style="{ width: '95%' }" :color="pbarStatu" size="large" :animation="true" />
  </a-affix>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
const props = defineProps<{
  status: { total: number, done: number, success: number, fail: number, percent: number }
}>();

const pbarStatu = computed(() => {
  if (props.status.done == props.status.success) return 'rgb(var(--success-6))';
  if (props.status.done == props.status.fail) return 'rgb(var(--danger-6))';

  const successEnd = Math.floor(props.status.success / (props.status.done | 1) * 100);
  return {
    '0%': 'rgb(var(--success-6))',
    [`${successEnd}%`]: 'rgb(var(--success-6))',
    [`${successEnd + 0.1}%`]: 'rgb(var(--danger-6))',
    '100%': 'rgb(var(--danger-6))',
  }
})

</script>
