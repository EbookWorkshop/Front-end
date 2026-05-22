<template>
  <div>
    <a-divider orientation="center">调试输出</a-divider>
    <SettingForm :form="settingData" :value="value" @update="save" />
  </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import SettingForm from './settingform.vue'
import type { SettingFormType } from './types'
import { getDebugSetting, saveDebugSetting } from '@/api/system'



const settingData: SettingFormType[] = [{
  dataId: 'debug',
  title: '开启调试',
  description: "开启调试后，会在程序控制台打印出调试信息。",
  controlType: 'switch',
}, {
  dataId: 'init',
  title: '是否监控模块装载情况',
  controlType: 'switch',
}, {
  dataId: 'database',
  title: '是否开启数据库调试',
  controlType: 'switch',
}, {
  dataId: 'workerPool',
  title: '是否开启线程池调试',
  controlType: 'switch',
}, {
  dataId: 'email',
  title: '是否开启邮件服务调试',
  controlType: 'switch',
}, {
  dataId: 'puppeteer',
  title: '是否开启爬虫调试',
  controlType: 'switch',
}, {
  dataId: 'router',
  title: '是否开启路由调试',
  controlType: 'switch',
}, {
  dataId: 'pdf',
  title: '是否开启PDF制作调试',
  controlType: 'switch',
}, {
  dataId: 'bookIndex',
  title: '是否开启书籍目录更新调试',
  controlType: 'switch',
}, {
  dataId: 'bookChapter',
  title: '是否开启书籍章节抓取调试',
  controlType: 'switch',
}, {
  dataId: 'saveBookCover',
  title: '是否开启书书籍封面抓取调试',
  controlType: 'switch',
}]

const value = reactive({
  debug: false,
  init: false,
  database: false,
  workerPool: false,
  email: false,
  puppeteer: false,
  router: false,
  pdf: false,
  bookIndex: false,
  bookChapter: false,
  saveBookCover: false,
});

getDebugSetting().then(res => {
  const data = Object.assign({ debug: res.data.debug }, res.data.debugSwitcher);
  for (const item of settingData) {
    (value as any)[item.dataId] = data[item.dataId];
  }
})
updateSwitch();

function save(dataId: string) {
  const newValue = (value as any)[dataId];
  let setting = {
    [dataId]: newValue
  };

  saveDebugSetting(setting).then(() => {
    // 成功提示
  }).catch(() => {
    // 失败提示
    (value as any)[dataId] = !newValue;
  });

  updateSwitch();
}

function updateSwitch() {
  const debugControl = value.debug ? undefined : 'disabled';
  for (const item of settingData) {
    if (item.dataId === "debug") continue;
    item.status = debugControl;
  }
}
</script>