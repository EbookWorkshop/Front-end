<template>
  <div class="container">
    <Breadcrumb :items="['menu.about']" />
    <div class="wrapper">
      <a-card title="项目信息" :bordered="false">
        <a-descriptions :data="appData" bordered :column="2"/>
      </a-card>
      <a-card title="UI环境依赖" :bordered="false">
        <a-descriptions :data="dependData" bordered />
      </a-card>
      <a-card title="服务器环境依赖" :bordered="false">
        <a-descriptions :data="serverData" bordered />
      </a-card>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';

declare const __CONST_INFO__: object | any;
const appInfo = __CONST_INFO__;
import { getSystemVersion } from '@/api/system';

const serverData = reactive([]) as any;
const appData = reactive([]) as any;

const app = appInfo?.appinfo;
appData.push(...[{
  label: "项目名称",
  value: app.name,
  span:2
}, {
  label: "Nodejs版本",
  value: ""
}, {
  label: "系统版本",
  value: ""
}, {
  label: "UI版本",
  value: app.version
}, {
  label: "UI更新时间",
  value: appInfo?.lastBuildTime
}]);


const ddc = appInfo?.package?.dependencies;
const dependData = [] as any;
for (let d in ddc) {
  dependData.push({
    label: d,
    value: ddc[d]
  });
}

getSystemVersion().then((result: any) => {
  const data = result.data;
  // serverVersion.value = data.version;
  appData.filter((item: any) => item.label === "系统版本")[0].value = data.version;
  appData.filter((item: any) => item.label === "Nodejs版本")[0].value = data.nodeVersion;
  for (let d in data.dependencies) {
    serverData.push({
      label: d,
      value: data.dependencies[d]
    });
  }
});

</script>
