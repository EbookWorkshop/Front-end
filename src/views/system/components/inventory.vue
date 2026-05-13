<template>
  <div>
    <a-divider orientation="center">制品存储</a-divider>
    <SettingForm :form="settingData" :value="value" @update="save" />
  </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import SettingForm from './settingform.vue'
import type { SettingFormType } from './types'


const settingData: SettingFormType[] = [{
  dataId: 'inventoryPath',
  title: '制品存储路径',
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