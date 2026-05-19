<template>
  <div>
    <a-divider orientation="center">本地书库</a-divider>
    <SettingForm :form="settingData" :value="value" @update="save" />
  </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import SettingForm from './settingform.vue'
import type { SettingFormType } from './types'


const settingData: SettingFormType[] = [{
  dataId: 'inventoryPath',
  title: '库存图书路径',
  description: '用于存储文件型图书，如 PDF、EPUB 等。',
  controlType: 'text',
  status:'disabled',
// }, {

}]

const value = reactive({
  inventoryPath: '',
});

// 加载初始值


function save(dataId: string) {
  const newValue = (value as any)[dataId];
  switch (dataId) {

  }
}
</script>