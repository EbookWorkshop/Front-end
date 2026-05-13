<template>
  <div>
    <a-divider orientation="center">阅读偏好</a-divider>
    <SettingForm :form="settingData" :value="value" @update="save" />
  </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';
import SettingForm from './settingform.vue'
import type { SettingFormType } from './types'
import { queryFontList, getDefaultReadingFont, setDefaultReadingFont } from '@/api/font';

const settingData: SettingFormType[] = [{
  dataId: 'defaultReadingFont',
  title: '字体',
  description: '设置默认的阅读字体，将应用到网页阅读，PDF格式导出等场景',
  controlType: 'select',
  options: [],
}, {
  dataId: 'fontSize',
  title: '字体大小',
  description: '设置默认的阅读字体，将应用到网页阅读，PDF格式导出等场景',
  controlType: 'number',
  status: 'warning',
}, {
  dataId: 'readingBackground',
  title: '背景颜色',
  description: '设置默认的阅读背景颜色，仅网页阅读生效',
  controlType: 'color',
  status: 'warning',
}]

const value = reactive({
  defaultReadingFont: '',
  fontSize: 24,
  readingBackground: '#f5f5f5',
});



// 获取字体列表并设置到选项中
queryFontList().then(rsl => {
  let fontSet = settingData.find(item => item.dataId === 'defaultReadingFont') || {} as SettingFormType;
  fontSet.options = rsl.map((font) => ({
    label: font.name,
    value: font.name,
  }))
})

getDefaultReadingFont().then((rsl: any) => {
  if (!rsl.data) return;
  value.defaultReadingFont = rsl.data;;
});


function save(dataId: string) {
  const newValue = (value as any)[dataId];
  console.log(value, dataId, newValue);
  switch (dataId) {
    case 'defaultReadingFont':
      setDefaultReadingFont(newValue).catch((err) => {
        console.error('保存默认字体失败:', newValue, err);
      });
      break;
    default:
      break;

  }
}
</script>