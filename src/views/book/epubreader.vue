<template>
  <div class="reader-container">
    <component :is="VueReader" :url="bookUrl" @on-ready="onReaderReady" @on-location-change="onLocationChange"  />
  </div>
</template>

<script setup>
import { ref, defineAsyncComponent } from 'vue'

import { useRoute } from 'vue-router'
import { useAppStore } from '@/store'

const route = useRoute()
const appStore = useAppStore()

const bookUrl = ref(route.params.path) //epub 文件地址
appStore.updateSettings({menu: false}) // 阅读时隐藏菜单

// 动态导入 vue-reader，实现真正的按需加载
const VueReader = defineAsyncComponent(() => import('vue-reader'))

const onReaderReady = () => {
//   console.log('阅读器已就绪')
}

const onLocationChange = (location) => {
//   console.log('当前位置：', location)
}

// // 程序化控制
// const nextPage = () => {  reader.value?.nextPage()}
// const prevPage = () => {  reader.value?.prevPage()}
// const goToPage = (page) => {  reader.value?.gotoPage(page)}
</script>

<style scoped>
.reader-container {
  width: 100%;
  height: 98vh;
}
</style>