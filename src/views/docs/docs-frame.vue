<template>
  <iframe :src="fullSrc" frameborder="0" width="100%" height="100%"></iframe>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useAppStore } from '@/store';

const props = defineProps(['src', 'useTheme']);
const appStore = useAppStore();

const fullSrc = computed(() => {
  if (!props.useTheme) return props.src;
  return `${props.src}${appStore.theme === "dark" ? "?theme=dark" : ""}`;
});
</script>
