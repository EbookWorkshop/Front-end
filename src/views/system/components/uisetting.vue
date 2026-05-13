<template>
  <div>
    <a-divider orientation="center">界面设置</a-divider>
    <SettingForm :form="settingData" :value="value" @update="save" />
  </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import SettingForm from './settingform.vue'
import type { SettingFormType } from './types'
import { LOCALE_OPTIONS } from '@/locale';

import { queryFontList, getUIFont, setUIFont } from "@/api/font";
import { useAppStore } from '@/store';
import useLocale from '@/hooks/locale';
import { useDark, useToggle } from '@vueuse/core';

const appStore = useAppStore();
const { changeLocale, currentLocale } = useLocale();

const settingData: SettingFormType[] = [{
  dataId: 'language',
  title: '显示语言',
  controlType: 'select',
  options: [...LOCALE_OPTIONS],
}, {
  dataId: 'theam',
  title: '深色主题',
  controlType: 'switch',
  options: [
    { label: '深色', value: 'dark' },
    { label: '浅色', value: 'light' },
  ],
}, {
  dataId: 'defaultUIFont',
  title: '界面字体',
  description: '设置系统界面字体',
  controlType: 'select',
  options: [],
}]

const value = reactive({
  theam: appStore.theme,
  defaultUIFont: '',
  language: currentLocale.value,
});

// 获取字体列表并设置到选项中
queryFontList().then(rsl => {
  let fontSet = settingData.find(item => item.dataId === 'defaultUIFont') || {} as SettingFormType;
  fontSet.options = rsl.map((font) => ({
    label: font.name,
    value: font.name,
  }));
});

//加载初始值
getUIFont().then((rsl: any) => {
  if (!rsl.data) return;
  const { name, url } = rsl.data;
  value.defaultUIFont = name;
})

function save(dataId: string) {
  const newValue = (value as any)[dataId];
  switch (dataId) {
    case 'language':
      if (newValue === currentLocale.value) return;
      changeLocale(newValue);
      break;
    case 'theam':
      useToggle(useDark({
        selector: 'body',
        attribute: 'arco-theme',
        valueDark: 'dark',
        valueLight: 'light',
        storageKey: 'arco-theme',
        onChanged(dark: boolean) {
          appStore.toggleTheme(dark);
        },
      }))();
      break;
    case 'defaultUIFont':
      setUIFont(newValue);
      break;
  }
}
</script>