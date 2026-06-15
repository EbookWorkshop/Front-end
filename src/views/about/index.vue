<template>
  <div class="container about-me">
    <Breadcrumb :items="['menu.about']" />
    <div class="wrapper">
      <div class="content">
        <a-card title="系统信息" :bordered="false">
          <a-descriptions :data="sysData" bordered :column="2" />
        </a-card>
        <a-card title="项目信息" :bordered="false">
          <a-descriptions :data="appData" bordered :column="2" />
        </a-card>
        <a-card title="UI环境依赖" :bordered="false">
          <a-descriptions :data="dependData" bordered />
        </a-card>
        <a-card title="服务器环境依赖" :bordered="false">
          <a-descriptions :data="serverData" bordered />
        </a-card>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, h } from 'vue';
import { Statistic, DescData, Space, Tooltip } from '@arco-design/web-vue';

type VersionCompare = { version: string, wanted: string | undefined, latest: string | undefined };
declare const __CONST_INFO__: object | any;
const APP_INFO = __CONST_INFO__;
import { getSystemVersion, getUIPackVersion } from '@/api/system';
import { formatFileSize } from '@/utils/units';
import { appInfo, sysInfo } from './data';


const appData = reactive(appInfo) as DescData[];
const sysData = reactive(sysInfo) as DescData[];
const dependData = reactive([]) as any;   //UI依赖信息
const serverData = reactive([]) as any;

const dataMap = new Map(appData.map(item => [item.label, item]));  // 创建一个映射表，用于快速查找
sysData.forEach(item => { dataMap.set(item.label, item) });

const updateValue = (label: string, value: any) => {
  const item = dataMap.get(label);
  if (item) item.value = value;
};

updateValue("项目名称", APP_INFO?.appinfo.name);
updateValue("UI版本", APP_INFO?.appinfo.version);
updateValue("UI更新时间", APP_INFO?.lastBuildTime);


/** 
 * 设置版本对比控件
 * @param param0 
 */
function ShowOutdatedVersion({ version, wanted, latest }: VersionCompare) {
  const versions = [
    { content: "当前版本", version: version, style: "inherit" },
    { content: "可升级版本", version: wanted, style: "rgb(var(--green-5))" },
    { content: "最新版本", version: latest, style: "rgb(var(--red-5))" },
  ];
  const renderVersion = (version: string, color: string, tips: string) => h(Tooltip, { content: tips }, () => h("span", { style: "color:" + color }, version));
  return h(Space, () => versions.map(t => renderVersion(t.version || "", t.style, t.content)));
}



getSystemVersion().then((result: any) => {
  const data = result.data;
  let dbSize = formatFileSize(data.databaseSize);//数据库单位转换

  updateValue("程序版本", data.version);
  updateValue("书库资料目录", data.dataPath);
  updateValue("数据库大小", h(Statistic, { start: true, value: dbSize.fileSize, animation: true, precision: 0.01 }, { suffix: () => dbSize.unit }));

  updateValue("系统内核", `${data.osType} ${data.osRelease}`);
  updateValue("Nodejs版本", data.nodeVersion);
  updateValue("可用内存", `${data.memFree}/${data.memTotal}GB ${(data.memFree * 100 / data.memTotal).toFixed(2)}%`);

  const modelCount = {} as any;
  data.cpu?.forEach((item: any) => {
    const model = item?.model;
    modelCount[model] = (modelCount[model] || 0) + 1;
  });
  updateValue("CPU", Object.keys(modelCount).map(key => `${key} x ${modelCount[key]}`).join("\n"));

  Object.entries(data.packageVersion).forEach(([label, data]) => {
    const value = ShowOutdatedVersion({ ...data as VersionCompare });
    serverData.push({ label, value });
  });
});

getUIPackVersion().then((result: any) => {
  Object.entries(result).forEach(([label, data]) => {
    const value = ShowOutdatedVersion({ ...data as VersionCompare });
    dependData.push({ label, value });
  });
});

</script>
<style lang="less">
.wrapper {
  overflow: auto !important;

  .content.about-me {
    min-width: 880px;
  }
}
</style>