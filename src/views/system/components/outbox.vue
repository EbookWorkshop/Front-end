<template>
  <div>
    <a-divider orientation="center">发件箱</a-divider>
    <SettingForm :form="settingData" :value="value" @update="save" />
  </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import SettingForm from './settingform.vue'
import { getSMTPServer, saveSMTPServer } from '@/api/system';
import type { SettingFormType } from './types'


const settingData: SettingFormType[] = [{
  dataId: 'outbox_address',
  title: '发件箱',
  description: '用于向收件箱发出邮件，可通过免费的邮箱服务获得，如 Gmail、163 等。',
  controlType: 'text',
}, {
  dataId: 'outbox_password',
  title: '密码',
  controlType: 'password',
}]

const value = reactive({
  outbox_address: '',
  outbox_password: '',
});

// 加载初始值
getSMTPServer().then((rsl: any) => {
  value.outbox_address = rsl.data?.address || '';
  value.outbox_password = rsl.data?.password || '';
})


function save(dataId: string) {
  const newValue = (value as any)[dataId];
  switch (dataId) {
    case 'outbox_address':
      saveSMTPServer(newValue, value.outbox_password);
      break;
    case 'outbox_password':
      saveSMTPServer(value.outbox_address, newValue);
      break;
  }
}
</script>