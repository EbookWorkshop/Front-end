<template>
  <div>
    <a-divider orientation="center">临时缓存</a-divider>
    <SettingForm :form="settingData" :value="value" @update="save" />
  </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import SettingForm from './settingform.vue'
import type { SettingFormType } from './types'


const settingData: SettingFormType[] = [{
  dataId: 'tempPath',
  title: '临时缓存路径',
  controlType: 'text',
  status:'disabled',
}, {
  dataId: 'tempClean',
  title: '清理缓存',
  controlType: 'button',
  buttonText: '清理缓存',
  status:'warning',
  callback: () => {
    console.log('清理缓存');
  },
}]

const value = reactive({
  tempPath: '',
});

// 加载初始值


function save(dataId: string) {
  const newValue = (value as any)[dataId];
  switch (dataId) {

  }
}
</script>