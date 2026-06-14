<template>
  <div class="container about-me">
    <Breadcrumb :items="['menu.about']" />
    <div class="wrapper">
      <div class="content">
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
const appInfo = __CONST_INFO__;
import { getSystemVersion, getUIPackVersion } from '@/api/system';
import { formatFileSize } from '@/utils/units'


const appData = reactive([]) as DescData[];
const dependData = reactive([]) as any;   //UI依赖信息
const serverData = reactive([]) as any;


const app = appInfo?.appinfo;
appData.push(...[{
  label: "项目名称",
  value: app.name,
  span: 2
}, {
  label: "系统版本",
  value: ""
}, {
  label: "UI版本",
  value: app.version
}, {
  label: "Nodejs版本",
  value: ""
}, {
  label: "UI更新时间",
  value: appInfo?.lastBuildTime
}, {
  label: "书库资料目录",
  value: ""
}, {
  label: "数据库大小",
  value: ""
}]);

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


const appDataMap = new Map(appData.map(item => [item.label, item]));  // 创建一个映射表，用于快速查找
const updateValue = (label: string, value: any) => {
  const item = appDataMap.get(label);
  if (item) item.value = value;
};

getSystemVersion().then((result: any) => {
  const data = result.data;
  let dbSize = formatFileSize(data.databaseSize);//数据库单位转换

  updateValue("系统版本", data.version);
  updateValue("Nodejs版本", data.nodeVersion);
  updateValue("书库资料目录", data.dataPath);
  updateValue("数据库大小", h(Statistic, { start: true, value: dbSize.fileSize, animation: true, precision: 0.01 }, { suffix: () => dbSize.unit }));

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