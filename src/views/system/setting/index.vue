<template>
    <div class="container">
        <Breadcrumb :items="['menu.system', 'menu.system', 'menu.system.setting']" />
        <div class="myMenu">
            <!-- -->
            <a-split :style="{
                height: '85vh',
                width: '100%',
                minWidth: '500px',
                border: '1px solid var(--color-border)'
            }" v-model:size="bsize" min="206px" max="500px">
                <template #first>
                    <div style="height: 100%;width: 100%;background: var(--color-bg-2);">
                        <!-- 左侧菜单 -->
                        <a-menu :style="{ width: '200px', height: '100%' }" auto-open :default-selected-keys="['ui']">
                            <a-sub-menu key="0">
                                <template #title>常规设置</template>
                                <a-menu-item @click="scrollToMenu('ui')" key="ui">界面设置</a-menu-item>
                                <a-menu-item @click="scrollToMenu('reading')" key="reading">阅读偏好</a-menu-item>
                                <!-- <a-menu-item @click="scrollToMenu('ui')" key="0_3">文本转语音</a-menu-item> -->
                            </a-sub-menu>
                            <a-sub-menu key="1">
                                <template #title>存储设置</template>
                                <a-menu-item @click="scrollToMenu('data')" key="data">数据存储</a-menu-item>
                                <a-menu-item @click="scrollToMenu('inventory')" key="inventory">本地书库</a-menu-item>
                                <a-menu-item @click="scrollToMenu('cover')" key="cover">封面</a-menu-item>
                                <a-menu-item @click="scrollToMenu('temp')" key="temp">临时文件</a-menu-item>
                            </a-sub-menu>
                            <a-sub-menu key="2">
                                <template #title>系统设置</template>
                                <a-menu-item @click="scrollToMenu('autowork')" key="autowork">自动任务</a-menu-item>
                                <a-menu-item @click="scrollToMenu('debug')" key="debug">调试设置</a-menu-item>
                            </a-sub-menu>
                            <a-sub-menu key="4">
                                <template #title>邮箱设置</template>
                                <a-menu-item @click="scrollToMenu('inbox')" key="inbox">默认收件箱</a-menu-item>
                                <a-menu-item @click="scrollToMenu('outbox')" key="outbox">发件箱</a-menu-item>
                            </a-sub-menu>
                        </a-menu>
                    </div>
                </template>
                <template #second>
                    <div class="wrapper" style="height: 100%;">
                        <a-scrollbar ref="scrollBarRef" style="height:80vh;overflow-y: auto;">
                            <div>
                                <UISetting class="scroll-to-unit" scroll-key="ui" />
                                <ReadingSetting class="scroll-to-unit" scroll-key="reading" />
                                
                                <Data class="scroll-to-unit" scroll-key="data" />
                                <Inventory class="scroll-to-unit" scroll-key="inventory" />
                                <Cover class="scroll-to-unit" scroll-key="cover" />
                                <Temp class="scroll-to-unit" scroll-key="temp" />

                                <AutoWork class="scroll-to-unit" scroll-key="autowork" />
                                <Debug class="scroll-to-unit" scroll-key="debug" />

                                <Inbox class="scroll-to-unit" scroll-key="inbox" />
                                <Outbox class="scroll-to-unit" scroll-key="outbox" />
                            </div>
                        </a-scrollbar>
                    </div>
                </template>
            </a-split>
            <!-- -->
        </div>
    </div>
</template>
<style lang="less" scoped>
.myMenu ::v-deep .arco-menu-icon-suffix {
    display: none;
}
</style>
<script lang="ts" setup>
import { ref } from 'vue';

import UISetting from '../components/uisetting.vue';
import ReadingSetting from '../components/readingsetting.vue';
import Data from '../components/data.vue';
import Inventory from '../components/inventory.vue';
import Temp from '../components/temp.vue';
import Cover from '../components/cover.vue';
import AutoWork from '../components/autowork.vue'
import Debug from '../components/debug.vue';
import Inbox from '../components/inbox.vue';
import Outbox from '../components/outbox.vue';

const scrollBarRef = ref();
const bsize = ref(0.1);//左侧菜单默认宽度

function scrollToMenu(key: string) {

    const targetElement = document.querySelector(`.scroll-to-unit[scroll-key="${key}"]`) as any;
    if (!targetElement) return;

    scrollBarRef.value?.scrollTo({ top: (targetElement?.offsetTop - 10) || 0 });

}
</script>