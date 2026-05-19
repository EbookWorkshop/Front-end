<template>
    <div class="container">
        <Breadcrumb :items="['menu.system', 'menu.system', 'menu.system.setting']" />
        <div class="">
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
                        <a-menu :style="{ width: '200px', height: '100%' }" auto-open :default-selected-keys="['0_0']">
                            <a-sub-menu key="0">
                                <!-- <template #icon><icon-apps></icon-apps></template> -->
                                <template #title>常规设置</template>
                                <a-menu-item @click="scrollToMenu('0_0')" key="0_0">界面设置</a-menu-item>
                                <a-menu-item @click="scrollToMenu('0_1')" key="0_1">阅读偏好</a-menu-item>
                                <!-- <a-menu-item @click="scrollToMenu('0_0')" key="0_3">文本转语音</a-menu-item> -->
                            </a-sub-menu>
                            <a-sub-menu key="1">
                                <template #title>存储设置</template>
                                <a-menu-item @click="scrollToMenu('1_0')" key="1_0">数据存储</a-menu-item>
                                <a-menu-item @click="scrollToMenu('1_1')" key="1_1">本地书库</a-menu-item>
                                <a-menu-item @click="scrollToMenu('1_2')" key="1_2">临时缓存</a-menu-item>
                                <a-menu-item @click="scrollToMenu('1_3')" key="1_3">封面</a-menu-item>
                            </a-sub-menu>
                            <a-sub-menu key="2">
                                <template #title>调试设置</template>
                                <a-menu-item @click="scrollToMenu('2_0')" key="2_0">调试输出</a-menu-item>
                            </a-sub-menu>
                            <a-sub-menu key="3">
                                <template #title>邮箱设置</template>
                                <a-menu-item @click="scrollToMenu('3_0')" key="3_0">默认收件箱</a-menu-item>
                                <a-menu-item @click="scrollToMenu('3_1')" key="3_1">发件箱</a-menu-item>
                            </a-sub-menu>
                        </a-menu>
                    </div>
                </template>
                <template #second>
                    <div class="wrapper" style="height: 100%;">
                        <a-scrollbar ref="scrollBarRef" style="height:80vh;overflow-y: auto;">
                            <div>
                                <UISetting class="scroll-to-unit" scroll-key="0_0" />
                                <ReadingSetting class="scroll-to-unit" scroll-key="0_1" />
                                <Data class="scroll-to-unit" scroll-key="1_0" />
                                <Inventory class="scroll-to-unit" scroll-key="1_1" />
                                <Temp class="scroll-to-unit" scroll-key="1_2" />
                                <Cover class="scroll-to-unit" scroll-key="1_3" />
                                <Debug class="scroll-to-unit" scroll-key="2_0" />
                                <Inbox class="scroll-to-unit" scroll-key="3_0" />
                                <Outbox class="scroll-to-unit" scroll-key="3_1" />
                            </div>
                        </a-scrollbar>
                    </div>
                </template>
            </a-split>
            <!-- -->
        </div>
    </div>
</template>
<style lang="less">
.arco-menu-icon-suffix {
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