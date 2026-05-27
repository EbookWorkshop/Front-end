<template>
  <div>
    <a-divider orientation="center">封面</a-divider>
    <SettingForm :form="settingData" :value="value" @update="save" />
  </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import SettingForm from './settingform.vue'
import type { SettingFormType } from './types'
import { getCoverSetting } from '@/api/system'


const settingData: SettingFormType[] = [{
  dataId: 'coverPath',
  title: '封面存储路径',
  controlType: 'text',
  status: 'disabled',
}, {
  dataId: 'coverClean',
  title: '检查无用封面',
  controlType: 'button',
  buttonText: '检查',
  status: 'warning',
  callback: () => {
    console.log('检查无用封面');
  },
}]

const value = reactive({
  coverPath: '',
});

// 加载初始值
getCoverSetting().then((response) => {
  const { path, pathAbsolute } = response.data;
  value.coverPath = path;
  settingData.find(item => item.dataId === 'coverPath')!.message = `实际路径：  ${pathAbsolute}`;
});

function save(dataId: string) {
  const newValue = (value as any)[dataId];
  switch (dataId) {

  }
}
</script>