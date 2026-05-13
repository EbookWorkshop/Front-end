<template>
  <div>
    <a-divider orientation="center">数据存储</a-divider>
    <SettingForm :form="settingData" :value="value" @update="save" />
  </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import SettingForm from './settingform.vue'
import type { SettingFormType } from './types'


const settingData: SettingFormType[] = [{
  dataId: 'dataPath',
  title: '用户数据存储',
  controlType: 'text',
  status:'disabled',
}, {
  dataId: 'databasePath',
  title: '数据库路径',
  controlType: 'text',
  status:'disabled',
}, {
  dataId: 'databaseCompress',
  title: '数据库压缩',
  controlType: 'button',
  buttonText: '压缩',
  status:'warning',
  callback: () => {
    console.log('压缩数据库');
  },
}]

const value = reactive({
  dataPath: '',
  databasePath: '',
});

// 加载初始值


function save(dataId: string) {
  const newValue = (value as any)[dataId];
  switch (dataId) {
    case 'dataPath':
      break;
    case 'databasePath':
      break;
  }
}
</script>