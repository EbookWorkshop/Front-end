<template>
  <a-drawer
    :width="340"
    :height="340"
    :visible="visible"
    placement="right"
    unmount-on-close
    @cancel="hide"
  >
    <template #title> 已存方案 </template>
    <div v-if="loading">
      <a-skeleton :animation="true">
        <a-skeleton-line :rows="10" :line-height="48" :line-spacing="10" />
      </a-skeleton>
    </div>
    <div v-else>
      <a-list :loading="loading">
        <a-list-item v-for="host in renderData" :key="host">
          <a-button long type="primary" :value="host" @click="loadThisHost">{{
            host
          }}</a-button>
        </a-list-item>
      </a-list>
    </div>
  </a-drawer>
</template>

<script lang="ts" setup>
  import { reactive, ref } from 'vue';
  import { queryHostList, queryHostSetting, Rule } from '@/api/webbot';
  import useRequest from '@/hooks/request';

  const visible = ref(false);

  const show = () => {
    visible.value = true;
  };
  const hide = () => {
    visible.value = false;
  };
  defineExpose({
    show,
  });
  const emit = defineEmits(['setForm']);

  const loadThisHost = (ev: MouseEvent | any) => {
    const myHost = ev?.target?.value;
    if (!myHost) return;
    queryHostSetting(myHost).then((result) => {
      // console.log(result.data);
      emit('setForm', result.data);
      hide();
    });
  };

  const { loading, response: renderData } = useRequest<string[]>(queryHostList);
</script>

<style></style>
