<template>
  <div>
    <a-split
      :style="{
        height: '75vh',
        width: '100%',
        minWidth: '500px',
        marginTop: '40px',
        // border: '1px solid var(--color-border)'
      }"
      min="80px"
      disabled
    >
      <template #first>
        <a-card
          hoverable
          :style="{
            overflow: 'hidden',
            marginBottom: '20px',
            height: '65vh',
            marginRight: '40px',
          }"
        >
          <a-scrollbar style="height: 64vh; overflow: auto">
            <div style="min-height: 64vh; width: 100%">
              <a-typography v-for="t in contents" :key="t.name">
                <a-typography-title>{{ t.name }}</a-typography-title>
                <a-typography-paragraph style="white-space: pre-wrap">{{
                  t.txt
                }}</a-typography-paragraph>
              </a-typography>
            </div>
          </a-scrollbar>
        </a-card>
      </template>
      <template #second>
        <a-typography-paragraph></a-typography-paragraph>
      </template>
    </a-split>
  </div>
</template>

<script lang="ts" setup>
  import { PropType } from 'vue';

  defineProps({
    contents: { type: Array as PropType<{ txt: string; name: string }[]> },
  });
</script>
