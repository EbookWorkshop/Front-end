<template>
    <a-row align="end" justify="center">
        <a-space direction="vertical">
            <a-space>
                <a-button-group type="primary">
                    <a-button shape="round" @click="onCheckAll(true)"> 全选 </a-button>
                    <a-button shape="round" @click="onCheckAll(false)"> 清空 </a-button>
                    <a-button shape="round" @click="onCheckNot()"> 反选 </a-button>
                </a-button-group>
                <a-button-group type="primary">
                    <a-button @click="onCheckEmpty" shape="round"> 选空章节 </a-button>
                    <a-button @click="onCheckNotEmpty"> 选非空章节 </a-button>
                    <a-dropdown @select="onCheckVolume" v-if="Volumes.length > 0">
                        <a-button shape="round" > 选择卷 </a-button>
                        <template #content>
                            <a-doption v-for="volume in Volumes" :key="volume.VolumeId" :value="volume.VolumeId">{{ volume.Title }}</a-doption>    
                        </template>
                    </a-dropdown>
                    <a-button @click="isShow = true" shape="round"> 区段选择 </a-button>
                </a-button-group>
                <a-button-group type="primary">
                    <a-button shape="round" @click="showHiddenChapters(bookid ?? 0)"> 已隐藏章节 </a-button>
                    <a-button @click="checkDescriptions = true">查重</a-button>
                    <a-button shape="round" status="warning">来源管理</a-button>
                </a-button-group>
            </a-space>
            <a-space>
                <a-button-group type="primary">
                    <a-button shape="round" title="查看目录页面" @click="openDefaultIndex"> <icon-eye /> </a-button>
                    <a-button :loading="isMerging" @click="mergeIndex"> 更新目录 </a-button>
                    <a-button status="success" @click="isMustUpdate = !isMustUpdate">
                        <a-checkbox :model-value="isMustUpdate">强制更新</a-checkbox>
                    </a-button>
                    <a-button shape="round" status="success" @click="UpdateChapter" :loading="btStatusGettingData">
                        <template #icon><icon-robot /></template>
                        <a-badge :count="chapterHasCheckedNum" :max-count="99999" :offset="[15, -10]">
                            抓取选中章节
                        </a-badge>
                    </a-button>
                </a-button-group>
                <a-button-group type="primary">
                    <a-button shape="round" @click="isEditBookInfo = true"> <icon-pen /> 元数据 </a-button>
                    <a-button shape="round" @click="() => router.push(`/workplace/revise/book/${bookid}`)">修订</a-button>
                </a-button-group>
            </a-space>
        </a-space>
    </a-row>

    <a-modal v-model:visible="isShow" title="区段选择" @ok="onSetChapter" draggable unmount-on-close>
        <a-form :model="data" layout="vertical">
            <a-form-item field="cBegin" label="开始章节:" required>
                <SelectChapter v-model="data.cBegin" :volume="Volumes" :chapters="Chapters" />
            </a-form-item>
            <a-form-item field="cLength" label="按数量选：">
                <a-select placeholder="需要先选择【开始章节】" allow-create @change="onSetChapterLength">
                    <a-option v-for="item of [10, 50, 250, 500, 1000]" :value="item" :key=item :label="`${item}`" />
                </a-select>
            </a-form-item>
            <a-form-item field="cEnd" label="结束章节:" required>
                <SelectChapter v-model="data.cEnd" :volume="Volumes" :chapters="Chapters" :is-reverse="true" />
            </a-form-item>
        </a-form>
    </a-modal>

    <EditBookInfo :visible="isEditBookInfo" :bookId="bookid ?? 0" @cancel="isEditBookInfo = false" />
    <Descriptions :bookId="bookid ?? 0" :show="checkDescriptions" @close="checkDescriptions = false" />
</template>
<script setup lang="ts">
import { ref, reactive } from 'vue';
import type { Volume, Chapter } from '@/types/book';
import { ApiResultCode } from '@/types/global';
import { HeatABook } from '@/api/library';
import { mergeWebBookIndex, updateChapter, queryBookDefaultSourcesById } from '@/api/book';
import { Message } from '@arco-design/web-vue';
import useChapterHiddenHelper from "@/hooks/chapter-hidden";
import { useRouter } from 'vue-router';

import EditBookInfo from '@/components/book-info/edit.vue';
import Descriptions from '@/components/book-tool/duplicates.vue';
import SelectChapter from '@/components/chapter/select.vue';

const chapterHasCheckedNum = ref(0);    // 已选中的章节数
const isMerging = ref(false);       //合并章节状态
const isShow = ref(false);
const isMustUpdate = ref(false);    //强制更新-覆盖更新
const isEditBookInfo = ref(false);
const btStatusGettingData = ref(false);
const checkDescriptions = ref(false);
const router = useRouter();

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
    Volumes: {
        type: Array as () => Volume[],
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
const emit = defineEmits(["ToggleCheck", "StartUpdateChapter"]);
const { showHiddenChapters } = useChapterHiddenHelper();

//定义回调函数
defineExpose({
    updateChecked: () => {
        chapterHasCheckedNum.value = 0;
        props.ChapterStatus?.forEach((value, key) => { if (value) chapterHasCheckedNum.value++; });
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
function onSetChapterLength(value: any) {
    if (!data.cBegin) {
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
 * 更新目录-从网站重新更新目录，合并到当前书目
 * @param bookid
 */
function mergeIndex() {
    Message.info('已启动章节更新合并');
    isMerging.value = true;
    return mergeWebBookIndex(props.bookid || -1)
        .then((result) => {
            isMerging.value = false;
            Message.normal('已启动章节合并任务，请稍后');
            HeatABook(props.bookid ?? 0);
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
    btStatusGettingData.value = true;
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
        if (res?.code == ApiResultCode.Success) {
            HeatABook(props.bookid ?? 0);
            Message.info("已启动下载。");
            emit("StartUpdateChapter", 0);
        } else Message.error("启动失败，原因：" + res.msg)
    }).finally(() => {
        btStatusGettingData.value = false;
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
        if (c.IsHasContent) {
            emit("ToggleCheck", c.IndexId, false);
            return;
        }
        props.ChapterStatus.set(c.IndexId, true);
        chapterHasCheckedNum.value++;

        emit("ToggleCheck", c.IndexId, true);
    });
}

/**
 * 反选
 */
function onCheckNot() {
    chapterHasCheckedNum.value = 0;
    props.Chapters.forEach(c => {
        let isChecked = props.ChapterStatus.get(c.IndexId) ?? false;
        props.ChapterStatus.set(c.IndexId, !isChecked);
        if (!isChecked) chapterHasCheckedNum.value++;
        emit("ToggleCheck", c.IndexId, !isChecked);
    })
}

/**
 * 选择整卷
 */
function onCheckVolume(volumeId: number) {
    // chapterHasCheckedNum.value = 0;
    props.Chapters.forEach(c => {
        if (c.VolumeId === volumeId) {
            props.ChapterStatus.set(c.IndexId, true);
            chapterHasCheckedNum.value++;
            emit("ToggleCheck", c.IndexId, true);
        }
    })
}

/**
 * 查看目录页面
 */
function openDefaultIndex() {
    queryBookDefaultSourcesById(props.bookid ?? 0).then((res) => {
        if (res.code == ApiResultCode.Success) {
            window.open(res.data.Path);
        }
    });
}

</script>