<template>
  <div class="container">
    <Breadcrumb :items="['menu.about']" />
    <div class="wrapper">
      <a-card title="项目信息" :bordered="false">
        <a-descriptions :data="data" bordered />
      </a-card>
      <a-card title="生产环境依赖" :bordered="false">
        <a-descriptions :data="data" bordered />
      </a-card>
    </div>
  </div>
</template>

<script lang="ts" setup>
  const data = [
    {
      label: '信息1',
      value: 'xxxx',
    },
    {
      label: '信息2',
      value: 'xxxx',
    },
    {
      label: '信息3',
      value: 'xxxx',
    },
    {
      label: '信息4',
      value: 'xxxx',
    },
    {
      label: '信息5',
      value: 'xxxx',
    },
    {
      label: '信息6',
      value: 'xxxx',
    },
    {
      label: '信息7',
      value: 'xxxx',
    },
  ];
</script>
