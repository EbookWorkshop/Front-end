<template>
  <div>
    <a-divider orientation="center">数据存储</a-divider>
    <SettingForm :form="settingData" :value="value" @update="save">
      <template #databaseCompress>
        <div v-if="dbCompressResultShow">
          <a-spin v-if="dbCompressing" />
          <a-progress v-else :percent="dbSizePercent" size="large" trackColor="rgb(var(--danger-6))"
            :show-text="false" />
        </div>
        <a-button type="primary" @click="compressDatabase">压缩</a-button>
      </template>
    </SettingForm>
  </div>
</template>

<script lang="ts" setup>
import type { HttpResponse } from '@/types/global';
import type { SettingFormType } from './types'

import { reactive, ref } from 'vue'
import { getDataSetting, compressDB } from '@/api/system'
import SettingForm from './settingform.vue'

const dbCompressing = ref(false);
const dbCompressResultShow = ref(false);
const dbSizePercent = ref(1);

const settingData: SettingFormType[] = [{
  dataId: 'dataPath',
  title: '用户数据存储',
  controlType: 'text',
  status: 'disabled',
}, {
  dataId: 'databasePath',
  title: '数据库路径',
  controlType: 'text',
  status: 'disabled',
}, {
  dataId: 'databaseCompress',
  title: '数据库压缩',
  controlType: 'VNode',
}]

const value = reactive({
  dataPath: '',
  databasePath: '',
});

// 加载初始值
getDataSetting().then((response) => {
  const { dataPath, databasePath, dataPathAbsolute, databasePathAbsolute } = response.data;
  value.dataPath = dataPath;
  value.databasePath = databasePath;

  settingData.find(item => item.dataId === 'dataPath')!.message = `实际路径：  ${dataPathAbsolute}`;
  settingData.find(item => item.dataId === 'databasePath')!.message = `实际路径：  ${databasePathAbsolute}`;
});

function save(dataId: string) {
  const newValue = (value as any)[dataId];
  switch (dataId) {
    case 'dataPath':
      break;
    case 'databasePath':
      break;
  }
}

function compressDatabase() {
  const compressInfo = settingData.find(item => item.dataId === 'databaseCompress');
  compressInfo!.message = '压缩中...';
  dbCompressing.value = true;
  dbCompressResultShow.value = true;

  compressDB().then((response: HttpResponse<any>) => {
    dbCompressing.value = false;
    const result = response.data;
    dbSizePercent.value = result.NewSize / result.OldSize;

    let delSize = NumberToString((result.OldSize - result.NewSize) / 1024 / 1024, 1);
    compressInfo!.message = `压缩后大小： ${NumberToString(result.NewSize / 1024 / 1024, 1)} MB，共释放 ${delSize} MB。`;
  });
}

function NumberToString(num: number, fixed: number) {
  let str = num.toFixed(fixed).toString();
  if (str.endsWith('.' + "0".repeat(fixed))) {
    str = str.slice(0, -(fixed + 1));
  }
  return str;
}
</script>