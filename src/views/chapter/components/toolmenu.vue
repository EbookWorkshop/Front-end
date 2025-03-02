<template>
    <a-trigger :trigger="['click', 'hover']" clickToClose position="top" v-model:popupVisible="popupOver">
        <a-button shape="round" type="primary" size="large" class="tool-bt" title="阅读偏好">
            <template #icon>
                <a-progress type="circle" :percent="scrollProgress" :stroke-width="10" :show-text="false"
                    :track-color="'var(--color-neutral-3)'" />
            </template>
        </a-button>
        <template #content>
            <a-menu :style="{ marginBottom: '-8px' }" mode="popButton" :tooltipProps="{ position: 'left' }"
                showCollapseButton>
                <a-menu-item key="1" @click="handleAddBookmark">
                    <template #icon>
                        <icon-subscribe-add style="color:rgb(var(--orange-7))" />
                    </template>
                    添加书签
                </a-menu-item>
                <a-menu-item key="2" @click="emit('togglePdfModel')">
                    <template #icon>
                        <icon-file-pdf style="color:rgb(var(--red-7))" />
                    </template>
                    PDF模式打开
                </a-menu-item>
                <a-menu-item key="3">
                    <template #icon>
                        <icon-bg-colors></icon-bg-colors>
                    </template>
                    <a-color-picker v-model="bgColor" @change="emit('changeBgColor', toRaw(bgColor))">
                        <a-tag :color="bgColor">
                            <span style="color:gray;">背景颜色</span>
                        </a-tag>
                    </a-color-picker>
                </a-menu-item>
                <a-menu-item key="4.1">
                    <template #icon>
                        <icon-language></icon-language>
                    </template>
                    字体
                    <a-select v-model="selectedFont as string" @change="onChangeFont">
                        <a-option v-for="font in fontData" :key="font.name" :value="font.name">
                            {{ font.name }}
                        </a-option>
                    </a-select>
                </a-menu-item>
                <a-menu-item key="4.2">
                    <template #icon>
                        <icon-font-colors></icon-font-colors>
                    </template>
                    <a-color-picker v-model="fontColor" @change="emit('changeFontColor', toRaw(fontColor))">
                        <a-tag :color="fontColor">
                            字体颜色
                        </a-tag>
                    </a-color-picker>
                </a-menu-item>
                <a-menu-item key="4.3">
                    <template #icon>
                        <icon-zoom-in></icon-zoom-in>
                    </template>
                    <a-slider v-model:model-value="fontSize as number" :style="{ width: '200px' }"
                        @change="emit('changeFontSize', toRaw(fontSize))" :max="50" />
                </a-menu-item>
            </a-menu>
        </template>
    </a-trigger>
</template>
<script lang="ts" setup>
import { ref, toRaw, onMounted, onBeforeUnmount } from 'vue';
import { ApiResultCode, HttpResponse } from '@/types/global'
import { addBookmarkForChapter } from '@/api/bookmark'
import { queryFontList, ASSETS_HOST, } from '@/api/font';

import { Message } from '@arco-design/web-vue';


const scrollProgress = ref(0);
const selectedFont = ref("");
const popupOver = ref(false);
const bgColor = ref("#fff");
const fontColor = ref("#000");
const fontSize = ref(20);
let fontData: Array<any> = [];

const emit = defineEmits(['togglePdfModel', 'changeFontColor', 'changeFontSize', 'changeBgColor', 'changeFontFamily']);
const props = defineProps({
    chapterId: {
        type: Number,
        required: true
    }
});

//字体加载、切换部分
let fontDataMap = new Map();
async function InitFont() {
    fontData = await queryFontList();
    fontDataMap = new Map(fontData.map(t => [t.name, t]));
}
InitFont();
function onChangeFont() {
    emit('changeFontFamily', fontDataMap.get(selectedFont.value));
}


//阅读进度条逻辑相关
const handleScroll = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;
    scrollProgress.value = Math.floor((scrollTop / (scrollHeight - clientHeight)) * 100) / 100;
};
onMounted(() => {
    window.addEventListener('scroll', handleScroll);
});
onBeforeUnmount(() => {
    window.removeEventListener('scroll', handleScroll);
});

//书签相关功能
function handleAddBookmark() {
    addBookmarkForChapter(props.chapterId).then((result: HttpResponse<any>) => {
        if (result.code == ApiResultCode.Success) {
            Message.success("已添加书签");
        } else {
            Message.error("添加书签失败：" + result.msg);
        }
    })
}


</script>
<style scoped>
.tool-bt {
    position: fixed;
    bottom: 120px;
    right: 5%;
}
</style>