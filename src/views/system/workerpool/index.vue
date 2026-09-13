<template>
  <div class="container">
    <Breadcrumb :items="['menu.system', 'menu.system.workerpool']" />
    <div class="wrapper workerboard">
      <div>
        <a-button @click="Refresh"> 刷新 </a-button>
        <a-descriptions :data="workerData" :column="workerData.length" />
      </div>
      <a-layout style="min-height: 66dvh;">
        <a-layout-content>
          <a-typography-title :heading="6" :style="{ textAlign: 'center' }">线程池</a-typography-title>
          <a-card v-if="WorkerPool.length" :bordered="false" :style="{ width: '98%', marginLeft: '1%' }">
            <a-card-grid v-for="(worker, index) in WorkerPool" :key="index" :hoverable="index % 2 === 0"
              :style="{ width: '25%' }">
              <a-card :title="`ID：&nbsp;${worker.workerId}`" :bordered="false">
                <template #extra>
                  <p>{{ worker.task ? "运行中" : "空闲" }}</p>
                </template>
                &nbsp;
                <div v-if="worker.task">
                  <div style="text-align: right;">
                    <a-statistic title="运行时间" :value="worker.runTime / 1000" :precision="2" :animation="true"
                      :value-style="{ color: 'rgb(var(--red-5))' }" :value-from="(worker.runTime / 1000) - 3"
                      :animation-duration="3000">
                      <template #suffix>秒</template>
                    </a-statistic>
                  </div>
                  <a-descriptions :align="{ label: 'left', value: 'right' }" :data="[{
                    label: '任务类型',
                    value: worker.task?.taskType
                  }, {
                    label: '启用数据库',
                    value: worker.withDB ? `是` : `否`
                  }, {
                    label: '参数',
                    value: JSON.stringify(worker.task?.param)
                  }]" title="任务细节" layout="inline-horizontal" :column="1"
                    content-class="custom-descriptions-content" />
                </div>
                <div v-else>
                  <div style="text-align: right;">
                    <a-statistic title="空闲时间" :value="worker?.feeTime / 1000" :precision="2" :animation="true"
                      :value-style="{ color: 'rgb(var(--green-5))' }" :value-from="(worker.feeTime / 1000) - 3"
                      :animation-duration="3000">
                      <template #suffix>秒</template>
                    </a-statistic>
                  </div>
                  <a-list size="small" :data="worker.history" :virtualListProps="{ height: 100, }">
                    <template #item="{ item, index }">
                      <a-list-item :key="index">{{ item }}</a-list-item>
                    </template>
                  </a-list>
                </div>
              </a-card>
            </a-card-grid>
          </a-card>
          <a-empty v-else/>
        </a-layout-content>
        <a-layout-footer resize-directions="bottom">
          <TaskBoard :data="WaitingTask" />
        </a-layout-footer>
      </a-layout>


    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue';
import TaskBoard from './components/taskboard.vue';
import { useSocket } from '@/hooks/socket';
const { io: socket } = useSocket();

const workerData = ref<any[]>([]);    // 线程信息
const WorkerPool = ref<any[]>([]);    // 线程池
const WaitingTask = ref<any[]>([]);    // 等待的任务

function subscribeWorkerDashboard() { socket.emit('subscribe:worker.dashboard'); }
function unsubscribeWorkerDashboard() { socket.emit('unsubscribe:worker.dashboard'); }

onMounted(() => {
  // socket.emit("WorkerPool.Status.On", { type: 'initial' });
  subscribeWorkerDashboard();
});
onUnmounted(() => {
  // socket.emit("WorkerPool.Status.Off");
  // socket.disconnect();
  unsubscribeWorkerDashboard();
});

socket.on("WorkerPool.Status", (data) => {
  // if (Date.now() - data.timestamp > 4000) {
  //   socket.emit("WorkerPool.Status.WakeUp");
  // }

  setWorkerPool(data);
});

function Refresh() {
  subscribeWorkerDashboard()
}

function setWorkerPool(data: any) {
  WaitingTask.value = data.taskList;
  WorkerPool.value = data.worker;
  workerData.value = [{
    label: '最大线程数',
    value: data.pool.max
  }, {
    label: '最低驻守线程数',
    value: data.pool.min
  }, {
    label: '空闲超时',
    value: `${data.pool.idle / 1000} 秒`
  }, {
    label: '扫描间隔',
    value: `${data.pool.scan / 1000} 秒`
  }, {
    label: '激活线程数',
    value: data.worker.length
  }, {
    label: '空闲线程数',
    value: data.feeWorkerNum
  }];

}
</script>
<style>
.custom-descriptions-content .arco-descriptions-item-value,
.arco-descriptions-item-value {
  max-width: 320px;
  /* 设置一个最大宽度 */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
<style lang="less" scoped>
.workerboard {
  padding-bottom: 0px;
}
</style>