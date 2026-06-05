<template>
  <div class="reader-container">
    <vue-reader ref="reader" :url="bookUrl" @on-ready="onReaderReady" @on-location-change="onLocationChange"  />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import VueReader from 'vue-reader'

import { useRoute } from 'vue-router'
import { useAppStore } from '@/store'

const route = useRoute()
const appStore = useAppStore()

const reader = ref(null)
const bookUrl = ref(route.params.path) //epub 文件地址
appStore.updateSettings({menu: false}) // 阅读时隐藏菜单

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