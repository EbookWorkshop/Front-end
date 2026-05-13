<template>
  <div>
    <a-divider orientation="center">默认收件箱</a-divider>
    <SettingForm :form="settingData" :value="value" @update="save" />
  </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import SettingForm from './settingform.vue'
import { getKindleInbox, saveKindleInbox } from '@/api/system';
import type { SettingFormType } from './types'


const settingData: SettingFormType[] = [{
  dataId: 'inbox',
  title: '默认收件箱',
  description: '接收导出数据用的邮箱地址，如 Kindle 等设备可以通过邮箱同步书籍。',
  controlType: 'text',
}]

const value = reactive({
  inbox: '',
});

// 加载初始值
getKindleInbox().then((rsl: any) => {
  value.inbox = rsl.data?.address || '';
})


function save(dataId: string) {
  const newValue = (value as any)[dataId];
  switch (dataId) {
    case 'inbox':
      saveKindleInbox(newValue);
      break;
  }
}
</script>