<template>
  <div>
    <a-divider orientation="center">临时文件</a-divider>
    <SettingForm :form="settingData" :value="value" @update="save" />
  </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import SettingForm from './settingform.vue'
import type { SettingFormType } from './types'
import { getTempSetting } from '@/api/system'

const settingData: SettingFormType[] = [{
  dataId: 'outputPath',
  title: '输出路径',
  controlType: 'text',
  status: 'disabled',
}, {
  dataId: 'tempPath',
  title: '临时缓存路径',
  controlType: 'text',
  status: 'disabled',
}, {
  dataId: 'tempClean',
  title: '清理临时文件',
  controlType: 'button',
  buttonText: '清理',
  status: 'warning',
  callback: () => {
    console.log('清理');
  },
}]

const value = reactive({
  tempPath: '',
  outputPath: '',
});

// 加载初始值
getTempSetting().then((response) => {
  const { tempPath, tempPathAbsolute, outputPath, outputPathAbsolute, } = response.data;
  value.tempPath = tempPath;
  settingData.find(item => item.dataId === 'tempPath')!.message = `实际路径：  ${tempPathAbsolute}`;
  value.outputPath = outputPath;
  settingData.find(item => item.dataId === 'outputPath')!.message = `实际路径：  ${outputPathAbsolute}`;
});

function save(dataId: string) {
  const newValue = (value as any)[dataId];
  switch (dataId) {

  }
}
</script>