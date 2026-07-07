<template>
    <a-popover v-once title="Title">
        <div :class="showClass" @click="showTaskInfo"></div>
        <template #content>
            <p v-if="data?.taskType">分类：{{ data?.taskType }}</p>
            <p>程序：{{ data?.taskfile }}</p>
            <p>参数：{{ data?.param }}</p>
        </template>
    </a-popover>
</template>


<script setup lang="ts">
import { computed } from 'vue';

/**
(property) taskParam: {
    taskfile: any;
    param: any;
    taskType: any;
    maxThreadNum: any;
}
 */

const props = defineProps({
    data: {
        type: Object
    }
});

const showClass = computed(() => {
    if (props.data?.status === "fail") return "gem gem-ruby";
    else if (props.data?.status === "running") return "gem gem-citrine";
    else if (props.data?.status === "success") return "gem gem-emerald";
    return "gem gem-sapphire";
});

function showTaskInfo() {
    console.log(props.data?.taskfile);
}

</script>


<style lang="less" scoped>
.waiting {
    opacity: 0.65;
}

.gem {
    width: 12px;
    height: 12px;
    border-radius: 1.5px;
    flex-shrink: 0;
    box-sizing: border-box;
    position: relative;

    /* 合并所有高光到背景，移除伪元素 */
    background:
        /* ① 左上角强高光（模拟 ::before） */
        linear-gradient(145deg,
            rgba(255, 255, 255, 0.9) 0%,
            rgba(255, 255, 255, 0.1) 20%,
            transparent 40%),
        /* ② 右下角环境光斑（模拟 ::after） */
        radial-gradient(circle at 85% 80%,
            rgba(255, 255, 255, 0.25) 0%,
            transparent 60%),
        /* ③ 宝石核心色彩 */
        radial-gradient(circle at 25% 20%,
            var(--gem-light) 0%,
            var(--gem-base) 40%,
            var(--gem-dark) 70%,
            var(--gem-deep) 100%);

    background-blend-mode: normal, normal, normal;

    /* 简化阴影（去掉模糊外发光，仅保留内阴影和简洁外光） */
    box-shadow:
        inset 0 0.5px 1px rgba(255, 255, 255, 0.6),
        inset -0.5px -0.5px 1px rgba(0, 0, 0, 0.5),
        0 0 4px var(--gem-glow, rgba(30, 100, 200, 0.3));

    border: 0.5px solid rgba(255, 255, 255, 0.1);
}

.gem-sapphire {
    --gem-light: #7abfff;
    --gem-base: #1a7acc;
    --gem-dark: #0a3d7a;
    --gem-deep: #041530;
    --gem-glow: rgba(30, 100, 200, 0.45);
}

.gem-ruby {
    --gem-light: #ff7a7a;
    --gem-base: #cc0000;
    --gem-dark: #800000;
    --gem-deep: #330000;
    --gem-glow: rgba(200, 0, 0, 0.45);
}

.gem-emerald {
    --gem-light: #7dffb3;
    --gem-base: #00b359;
    --gem-dark: #006633;
    --gem-deep: #002612;
    --gem-glow: rgba(0, 200, 100, 0.45);
}

.gem-citrine {
    --gem-light: #ffb366;
    --gem-base: #cc5500;
    --gem-dark: #803300;
    --gem-deep: #331400;
    --gem-glow: rgba(200, 80, 0, 0.45);
}

.gem-amethyst {
    --gem-light: #c299ff;
    --gem-base: #7300e6;
    --gem-dark: #4d0099;
    --gem-deep: #1a0033;
    --gem-glow: rgba(100, 0, 200, 0.45);
}
</style>