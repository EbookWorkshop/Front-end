<template>
  <div class="container">
    <Breadcrumb :items="['menu.system', 'menu.system.workerpool']" />
    <div class="wrapper">
      <div>
        <a-button @click="Reflush"> 刷新 </a-button>
        <a-descriptions :data="workerData" />
      </div>
      <a-layout style="min-height: 600px;">
        <a-layout-content>
          <a-typography-title :heading="6" :style="{ textAlign: 'center' }">线程池</a-typography-title>
          <a-card :bordered="false" :style="{ width: '98%', marginLeft: '1%' }">
            <a-card-grid v-for="(worker, index) in WorkerPool" :key="index" :hoverable="index % 2 === 0"
              :style="{ width: '25%' }">
              <a-card :title="`ID：&nbsp;${worker.ID}`" :bordered="false">
                <template #extra>
                  <p>{{ worker.RunTime == 0 ? "空闲" : "运行中" }}</p>
                </template>
                &nbsp;
                <div v-if="worker.RunTime > 0">
                  <div style="text-align: right;">
                    <a-statistic title="运行时间" :value="worker.RunTime / 1000" :precision="2"
                      :value-style="{ color: 'rgb(var(--red-5))' }">
                      <template #suffix>秒</template>
                    </a-statistic>
                  </div>
                  <a-descriptions :align="{ label: 'left', value: 'right' }" :data="[{
                    label: '任务类型',
                    value: worker.Param?.taskType
                  }, {
                    label: '线程任务',
                    value: worker.Param?.taskfile
                  }, {
                    label: '参数',
                    value: worker.Param?.param?.url || worker.Param?.param
                  }]" title="任务细节" layout="inline-horizontal" :column="1" />
                </div>
                <div v-else>
                  <div style="text-align: right;">
                    <a-statistic title="空闲时间" :value="worker.WaitTime / 1000" :precision="2"
                      :value-style="{ color: 'rgb(var(--green-5))' }">
                      <template #suffix>秒</template>
                    </a-statistic>
                  </div>
                </div>
              </a-card>
            </a-card-grid>
          </a-card>
        </a-layout-content>
        <a-layout-sider :resize-directions="['left']" :width="400">
          <a-typography-title :heading="6" :style="{ textAlign: 'center' }">等待线程</a-typography-title>
          <a-collapse v-if="WaitingTask.length > 0" :style="{ marginLeft: '5%' }" :default-active-key="['1']">
            <a-collapse-item v-for="task of WaitingTask" :header="`${task.type} &nbsp; (${task.list.length})`" key="1">
              <div style="max-height: 100vh;overflow-y: auto;">
                <div v-for="(t, index) of task.list" :key="index">
                  <div style="overflow-x: hidden; width: 140%;margin-bottom: 4px;">
                    任务：{{ t.taskParam?.taskfile }}
                    <br />
                    参数：{{ t.taskParam?.param?.url || t.taskParam?.param }}
                  </div>
                </div>
              </div>
            </a-collapse-item>
          </a-collapse>
        </a-layout-sider>
      </a-layout>


    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue';

import { useSocket } from '@/hooks/socket';
const { io: socket } = useSocket();

const workerData = ref<any[]>([]);    // 线程信息
const WorkerPool = ref<any[]>([]);    // 线程池
const WaitingTask = ref<any[]>([]);    // 等待的任务

onMounted(() => {
  socket.emit("WorkerPool.Status.On", { type: 'initial' });
});
onUnmounted(() => {
  socket.emit("WorkerPool.Status.Off");
  // socket.disconnect();
});

socket.on("WorkerPool.Status", (data) => {
  if (Date.now() - data.timestamp > 4000) {
    socket.emit("WorkerPool.Status.WakeUp");
  }

  setWorkerPool(data.data);
});

function Reflush() {
  socket.emit("WorkerPool.Status.On", { type: 'reflush' });
  console.log('WorkerPool.Status.On');
}

function setWorkerPool(data: any) {
  WaitingTask.value = data.WaitingTask;
  WorkerPool.value = data.WorkerPool;
  workerData.value = [{
    label: '最大线程数',
    value: data.MaxThread
  }, {
    label: '激活线程数',
    value: data.NowWorker
  }, {
    label: '空闲线程数',
    value: data.FreeWorker.length
  }];

  // if(data.WaitingTask[0].list.length) console.log(data.WaitingTask);
}
</script>

<style></style>