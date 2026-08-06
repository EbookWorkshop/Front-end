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
import { getInventorySetting } from '@/api/system'



const settingData: SettingFormType[] = [{
  dataId: 'inventoryPath',
  title: '库存图书路径',
  description: '用于存储文件型图书，如 PDF、EPUB 等。',
  controlType: 'text',
  status: 'disabled',
}, {
  dataId: 'viewInventory',
  title: '查看库存图书',
  controlType: 'button',
  buttonText: '查看',
  callback: () => {
    window.open('/workshop/inventory', '_blank');
  },
}]

const value = reactive({
  inventoryPath: '',
});

// 加载初始值
getInventorySetting().then((response) => {
  const { path: inventoryPath, pathAbsolute } = response.data;
  value.inventoryPath = inventoryPath;
  settingData.find(item => item.dataId === 'inventoryPath')!.message = `实际路径：  ${pathAbsolute}`;
});

function save(dataId: string) {
  const newValue = (value as any)[dataId];
  switch (dataId) {

  }
}
</script>