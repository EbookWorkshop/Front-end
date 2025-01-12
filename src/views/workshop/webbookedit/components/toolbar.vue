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
                    <a-button :loading="isMerging" shape="round" @click="mergeIndex"> 更新目录 </a-button>
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
import { mergeWebBookIndex } from '@/api/book';

import { Message } from '@arco-design/web-vue';

const isMerging = ref(false);       //合并章节状态
const isShow = ref(false);
const data = reactive<{
    cBegin: any,
    cEnd: any
}>({
    cBegin: null, cEnd: null
});
const props = defineProps({
    bookid: {
        type: Number
    },
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

//事件定义
/**
 * 合并当前章节
 * @param bookid
 */
function mergeIndex() {
    Message.info('已启动章节更新合并');
    isMerging.value = true;
    return mergeWebBookIndex(props.bookid || -1)
        .then((result) => {
            isMerging.value = false;
            Message.success('章节更新已完成');
        })
        .catch((err) => {
            isMerging.value = false;
            Message.error(`合并、更新章节失败${err}`)
        });
}
</script>