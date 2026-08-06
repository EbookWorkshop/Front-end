<template>
  <div class="main-board">
    <Task class="taskinfo" v-for="item of data" :data="item"></Task>
  </div>
</template>

<script setup>
import Task from "./task.vue"
const props = defineProps({
  data: {
    type: Array
  }
})

</script>

<style lang="less" scoped>
.main-board {
  min-height: 120px;
  max-height: 50dvh;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  padding: 15px 15px;
  box-sizing: border-box;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-content: flex-start;
  align-items: flex-start;  overflow-y: auto;

  .taskinfo {
    margin: 1px 1px;
    border-radius: 4px;
    opacity: 0.8;
    overflow: hidden;
  }
}
</style>