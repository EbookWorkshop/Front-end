<template>
    <a-row align="end" justify="center" style="height: 150px;">
        <a-space direction="vertical">
            <a-space>
                <a-button-group type="primary">
                    <a-button shape="round" @click="onCheckAll(true)"> 全选 </a-button>
                    <a-button shape="round" @click="onCheckAll(false)"> 清空 </a-button>
                    <a-button @click="onCheckEmpty"> 选空章节 </a-button>
                    <a-button @click="onCheckNotEmpty"> 选非空章节 </a-button>
                    <a-button @click="isShow = true"> 区段选择 </a-button>
                    <a-button> 已隐藏章节 </a-button>
                    <a-button shape="round">来源管理</a-button>
                </a-button-group>
            </a-space>
            <a-space>
                <a-button-group type="primary">
                    <a-button shape="round"> <icon-eye title="查看目录页面"/> </a-button>
                    <a-button :loading="isMerging" @click="mergeIndex"> 更新目录 </a-button>
                    <a-button status="success" @click="isMustUpdate = !isMustUpdate">
                        <a-checkbox :model-value="isMustUpdate">强制更新</a-checkbox>
                    </a-button>
                    <a-button status="success" @click="UpdateChapter">
                        <template #icon><icon-robot /></template>
                        <a-badge :count="chapterHasCheckedNum" :max-count="99999" :offset="[15, -10]">
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
            <a-form-item field="cBegin" label="开始章节:" required>
                <a-select v-model="data.cBegin" :options="Chapters" :field-names="{ value: 'IndexId', label: 'Title' }"
                    :virtual-list-props="{ height: 200 }" allow-search/>
            </a-form-item>
            <a-form-item field="cLength" label="按数量选：">
                <a-select placeholder="需要先选择【开始章节】" allow-create @change="onSetChapterLength">
                    <a-option v-for="item of [10,50,250,500,1000]" :value="item" :key=item :label="`${item}`" />
                </a-select>    
            </a-form-item>
            <a-form-item field="cEnd" label="结束章节:" required>
                <a-select v-model="data.cEnd" :options="[...Chapters].reverse()"
                    :field-names="{ value: 'IndexId', label: 'Title' }" :virtual-list-props="{ height: 200 }" allow-search/>
            </a-form-item>
        </a-form>
    </a-modal>


</template>
<script setup lang="ts">
import { ref, reactive } from 'vue';
import { Chapter } from '@/types/book';
import { ApiResultCode } from '@/types/global';
import { mergeWebBookIndex, updateChapter } from '@/api/book';
import { Message } from '@arco-design/web-vue';

const chapterHasCheckedNum = ref(0);    // 已选中的章节数
const isMerging = ref(false);       //合并章节状态
const isShow = ref(false);
const isMustUpdate = ref(false);    //强制更新-覆盖更新

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
    ChapterStatus: {
        type: Map,
        default: new Map()
    },
    ChapterOptMap: {
        type: Map,
        default: new Map()
    }
});
const emit = defineEmits(["ToggleCheck","StartUpdateChapter"]);

//定义回调函数
defineExpose({
    updateChecked: () => {
        chapterHasCheckedNum.value = 0;
        props.ChapterStatus?.forEach((value,key)=>{if(value)chapterHasCheckedNum.value++;});
    },
});

/**
 * 设置选中的区段
 */
function onSetChapter() {
    let hasBegin = false;
    let result = [];
    for (let i = 0; i < props.Chapters.length; i++) {
        let curIndex = props.Chapters[i].IndexId;
        if ((!hasBegin && curIndex === data.cBegin) || hasBegin) {
            hasBegin = true;

            let ctrl = props.ChapterOptMap.get(curIndex) as any;
            if (!ctrl) break;
            result.push(curIndex);
            emit("ToggleCheck", curIndex, true);
            if (curIndex === data.cEnd) break;
        }
    }
    chapterHasCheckedNum.value = result.length;
}

/**
 * 设置章节区段
 */
function onSetChapterLength(value:any){
    if(!data.cBegin) {
        Message.error("需要先选择【开始章节】");
        return false;
    }
    let hasBegin = false;
    let curIndex = 0;
    for (let i = 0; i < props.Chapters.length && value > 0; i++) {
        curIndex = props.Chapters[i].IndexId;
        if ((!hasBegin && curIndex === data.cBegin) || hasBegin) {
            hasBegin = true;
            value--;
            curIndex = props.Chapters[i].IndexId;
        }
    }
    data.cEnd = curIndex;
}

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
            Message.normal('已启动章节合并任务，请稍后');
        })
        .catch((err) => {
            isMerging.value = false;
            Message.error(`合并、更新章节失败${err}`)
        });
}

/**
 * 启动更新选中的章节
 */
function UpdateChapter() {
    // console.log(props.CheckedChapter);
    let hasCheckChapter = [] as Array<number>;
    props.ChapterStatus?.forEach((value, key) => {
        if (value) hasCheckChapter.push(key as number)
    });

    if (hasCheckChapter.length == 0) {
        Message.error("没有选中章节");
        return;
    }

    updateChapter(props.bookid as number, hasCheckChapter, isMustUpdate.value).then((res: any) => {
        if (res?.code == ApiResultCode.Success){
             Message.info("已启动下载。");
             emit("StartUpdateChapter",0);
        } else Message.error("启动失败，原因：" + res.msg)
    });

}


/**
 * 全选
 */
function onCheckAll(isCheck: boolean) {
    chapterHasCheckedNum.value = 0;
    props.Chapters.forEach(c => {
        props.ChapterStatus.set(c.IndexId, isCheck);
        if (isCheck) chapterHasCheckedNum.value++;
        emit("ToggleCheck", c.IndexId, isCheck);
    });
}

/**
 * 选非空章节
 */
function onCheckNotEmpty() {
    chapterHasCheckedNum.value = 0;
    props.Chapters.forEach(c => {
        // let ctrl = props.ChapterOptMap.get(c.IndexId) as any;
        if (!c.IsHasContent) {
            emit("ToggleCheck", c.IndexId, false);
            return;
        }
        props.ChapterStatus.set(c.IndexId, true);
        chapterHasCheckedNum.value++;

        emit("ToggleCheck", c.IndexId, true);
    });
}


/**
 * 选空章节
 */
function onCheckEmpty() {
    chapterHasCheckedNum.value = 0;
    props.Chapters.forEach(c => {
        // let ctrl = props.ChapterOptMap.get(c.IndexId) as any;
        if (c.IsHasContent) {
            emit("ToggleCheck", c.IndexId, false);
            return;
        }
        props.ChapterStatus.set(c.IndexId, true);
        chapterHasCheckedNum.value++;

        emit("ToggleCheck", c.IndexId, true);
    });
}

</script>