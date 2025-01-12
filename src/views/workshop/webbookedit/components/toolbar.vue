<template>
    <a-row align="end" justify="center" style="height: 150px;">
        <a-space direction="vertical">
            <a-space>
                <a-button-group type="primary">
                    <a-button shape="round" @click="emit('CheckAll')"> 全选 </a-button>
                    <a-button @click="emit('CheckEmpty')"> 选空章节 </a-button>
                    <a-button @click="emit('CheckNotEmpty')"> 选非空章节 </a-button>
                    <a-button @click="isShow = true"> 区段选择 </a-button>
                    <a-button> 已隐藏章节 </a-button>
                    <!-- <a-button> <template #icon><icon-heart-fill /></template> </a-button>
<a-button> <template #icon><icon-star-fill /></template> </a-button>-->
                    <a-button shape="round">来源管理</a-button>
                </a-button-group>
            </a-space>
            <a-space>
                <a-button-group type="primary">
                    <a-button shape="round"> 更新目录 </a-button>
                    <a-button status="success">
                        <template #icon><icon-robot /></template>
                        <a-badge :count="hasCheckedNum" :max-count="99999" :offset="[15, -10]">
                            抓取选中章节
                        </a-badge>
                    </a-button>
                    <a-button status="success" shape="round"><template #icon><icon-email /></template>发到默认邮箱</a-button>
                </a-button-group>
            </a-space>
        </a-space>
    </a-row>

    <a-modal v-model:visible="isShow" title="区段选择" @ok="onSetChapter">
        <a-form :model="data" layout="vertical">
            <a-form-item field="cBegin" label="开始章节:">
                <a-select v-model="data.cBegin" :options="Chapters" :field-names="{ value: 'IndexId', label: 'Title' }"
                    :virtual-list-props="{ height: 200 }" />
            </a-form-item>
            <a-form-item field="cEnd" label="结束章节:">
                <a-select v-model="data.cEnd" :options="[...Chapters].reverse()"
                    :field-names="{ value: 'IndexId', label: 'Title' }" :virtual-list-props="{ height: 200 }" />
            </a-form-item>
        </a-form>
    </a-modal>


</template>
<script setup lang="ts">
import { defineEmits, ref, reactive } from 'vue';
import { Chapter } from '@/types/book';

const isShow = ref(false);
const data = reactive<{
    cBegin: any,
    cEnd: any
}>({
    cBegin: null, cEnd: null
});
const props = defineProps({
    Chapters: {
        type: Array as () => Chapter[],
        default: []
    },
    hasCheckedNum: {
        type: Number
    }
});
const emit = defineEmits(["CheckAll", "CheckEmpty", "CheckNotEmpty", "SetChapter"]);


/**
 * 设置选中的区段
 */
function onSetChapter() {
    let hasBegin = false;
    let result = [];
    for (let i = 0; i < props.Chapters.length; i++) {
        if (!hasBegin) {
            if (props.Chapters[i].IndexId === data.cBegin) {
                hasBegin = true;
                result.push(props.Chapters[i].IndexId);
            }
            continue;
        }
        result.push(props.Chapters[i].IndexId);
        if (props.Chapters[i].IndexId === data.cEnd) break;
    }

    emit("SetChapter", result);
}


</script>