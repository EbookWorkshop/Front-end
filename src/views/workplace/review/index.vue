<!-- 校阅、着重评估 -->
<template>
    <div class="container">
        <Breadcrumb :items="['menu.workplace', 'menu.workplace.correction.reviewbook']" />
        <div class="wrapper">
            <a-form :model="form" ref="formRef">
                <a-row :gutter="16">
                    <a-col :span="8">
                        <a-form-item field="bookId" label="要校阅的书" label-col-flex="90px"
                            :rules="[{ required: true, message: '请选择要校阅的书' }]">
                            <SelectBook v-model="form.bookId" @change="onChangeBook" />
                        </a-form-item>
                    </a-col>
                    <a-col :span="16">
                        <a-form-item field="chapterId" label="章节" label-col-flex="100px" :rules="chapterIdRules"
                            tooltip="部分功能可不选，不选则应用到所有章节">
                            <SelectChapter v-model="form.chapterId" :volume="Volumes" :chapters="Chapters" multiple/>
                        </a-form-item>
                    </a-col>
                </a-row>
                <a-row :gutter="16">
                    <a-col :span="24">
                        <a-form-item label="已配置规则" label-col-flex="90px" tooltip="预览的结果不会包含这些规则">
                            <a-space direction="horizontal" wrap>
                                <a-popover v-for="(item, index) in ruleData" :key="item.id" title="规则详情">
                                    <a-tag class="tag">
                                        {{ item.ruleName }}
                                    </a-tag>
                                    <template #content>
                                        <div
                                            v-if="(ruleItem = ruleAll.find((ruleItem: Rule) => ruleItem.id === item.ruleId))">
                                            <p>规则名称：{{ ruleItem.Name }}</p>
                                            <p>校阅内容：<a-typography-text code copyable
                                                    @click="form.curRegex = ruleItem.Rule; form.curReplace = ruleItem.Replace"
                                                    style="cursor: pointer;">{{
                                                        ruleItem.Rule
                                                    }}</a-typography-text></p>
                                            <p>替换结果：{{ ruleItem.Replace }}</p>
                                            <a-divider margin="5px" />
                                            <p style="color: #999">规则ID：{{ ruleItem.id }} &nbsp;
                                                <a-button type="primary" status="danger" size="small"
                                                    @click="onDeleteRule(item.id)">删除引用</a-button>
                                            </p>
                                        </div>
                                        <div v-else>未知规则</div>
                                    </template>
                                </a-popover>
                            </a-space>
                        </a-form-item>
                    </a-col>
                </a-row>
                <a-row :gutter="16">
                    <a-col :span="10">
                        <a-form-item label="匹配规则" label-col-flex="80px" field="curRegex"
                            :rules="[{ required: true, message: '请输入匹配规则' }]">
                            <a-textarea v-model="form.curRegex"> </a-textarea>
                        </a-form-item>
                    </a-col>
                    <a-col :span="10">
                        <a-form-item label="替换为" label-col-flex="80px" field="curReplace">
                            <a-textarea v-model="form.curReplace"> </a-textarea>
                        </a-form-item>
                    </a-col>
                    <a-col :span="4">
                        <a-space direction="horizontal" wrap>
                            <a-button type="primary" @click="onTryIt"
                                :loading="visBtLoading || isLoading">对比校阅</a-button>
                            <a-button type="primary" status="success" @click="onSave"
                                :loading="isLoading">应用到所有章节</a-button>
                            <a-dropdown @select="" :popup-max-height="false" :loading="isLoading">
                                <a-button>更多 <icon-down /></a-button>
                                <template #content>
                                    <a-doption @click="onViewChapter">预览选中的第一章</a-doption>
                                    <a-doption @click="onSaveWithChapter">只应用到选中的章节</a-doption>
                                    <a-doption @click="onSuspiciousCharsAnalysis">特殊字符分析</a-doption>
                                </template>
                            </a-dropdown>
                        </a-space>
                    </a-col>
                </a-row>
            </a-form>

            <div style="height: 100vh; overflow: scroll">
                <a-spin dot style="display: block;text-align: center;" v-if="isLoading" />
                <a-empty v-if="diffResult.length == 0 && saveResult?.length == 0 && viewChapter?.id == 0" />
                <div v-for="item in diffResult" :key="item.id" title="替换规则执行效果的对比预览">
                    <a-divider class="divider">结果预览（未更新到数据库）</a-divider>
                    <a-typography-title :heading="3">{{ item.title }}</a-typography-title>
                    <Diff mode="split" :theme="theme" language="text" :left="item.content" :right="item.newText"
                        style="height: 100%; width: 100%; overflow: scroll" />
                </div>
                <a-row v-if="(saveResult?.length || 0) > 0">
                    <a-col :span="8">
                        <div>
                            <a-typography-paragraph v-for="(item, index) in saveResult" :key="index"
                                @click="viewSaveResult = item">
                                <a-typography-text>章节标题： {{ item.title }} </a-typography-text>
                                &nbsp;&nbsp;&nbsp;&nbsp;
                                <a-typography-text>更新结果： {{ item.updateRsl }} </a-typography-text>
                            </a-typography-paragraph>
                        </div>
                    </a-col>
                    <a-col :span="16">
                        <a-space>
                            <a-button type="primary" size="small" @click="onUndoChapter">撤销本章修改</a-button>
                            <a-button type="primary" status="warning" size="small" @click="onUndoAll">撤销全部修改</a-button>
                        </a-space>
                        <a-typography-text style="text-align:center;display:block;">章节标题： {{ viewSaveResult?.title }}
                        </a-typography-text>
                        <div>
                            <Diff mode="split" :theme="theme" language="text" :left="viewSaveResult?.content || ''"
                                :right="viewSaveResult?.newText || ''"
                                style="height: 100%; width: 100%; overflow: scroll" />
                        </div>
                    </a-col>
                </a-row>

                <a-typography v-if="viewChapter?.id != 0" title="阅读效果的预览">
                    <a-typography-title :heading="3"> {{ viewChapter?.title }} </a-typography-title>
                    <a-typography-paragraph v-for="(item, index) in viewChapter?.content.split('\n')" :key="index">
                        {{ item }}
                    </a-typography-paragraph>
                </a-typography>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { Chapter } from "@/types/book";
import type { Rule } from '@/api/workplace';

import { ref, reactive, computed, nextTick } from 'vue';
import SelectBook from '@/components/select-book/index.vue';
import SelectChapter from '@/components/chapter/select.vue';
import Diff from '@/components/diff/index.vue'
import { ApiResultCode } from "@/types/global"
import { queryReviewRuleOnBook, RuleAndBook, queryReviewRuleList, tryARuleOnBook, saveReviewOnBook, deleteReviewRuleForBook, ReviewResult } from '@/api/workplace';
import { HeatABook } from "@/api/library";
import { queryBookById, queryChapterById } from '@/api/book';
import useRequest from '@/hooks/request';
import { useAppStore } from '@/store';
import { Form, FieldRule, Message } from '@arco-design/web-vue';
import { editChapter } from '@/api/book';

const appStore = useAppStore();
const theme = computed<any>(() => {
    return appStore.theme;
});

const formRef = ref<Form>(null);
const form = reactive({
    bookId: undefined as number | undefined,
    chapterId: [] as number[],
    curRegex: '' as string,
    curReplace: '' as string,
});
const Volumes = ref([]);       //已选中的书所有的卷
const Chapters = ref([]);       //已选中的书所有的章节
const ruleData = ref<RuleAndBook[]>([]);    //已选中的书所有的规则
const chapterIdRules = ref<FieldRule[]>([]);

let { response: ruleAll } = useRequest<Rule[]>(queryReviewRuleList);    //所有已存在的规则
const ruleItem = ref<Rule>();    //规则详情
const diffResult = ref<ReviewResult[]>([]);//对比的结果
const viewSaveResult = ref<ReviewResult>();    //预览保存结果
const saveResult = ref<ReviewResult[]>([]);    //保存结果
const viewChapter = ref<{
    id: number;
    title: string;
    content: string;
}>({ id: 0, title: "", content: "" });    //预览的章节
//控件状态
const visBtLoading = ref<boolean>(false);
const isLoading = ref<boolean>(false);

/**
 * 清空所有预览数据
 */
function CleanView() {
    diffResult.value = [];
    saveResult.value = [];
    viewChapter.value = { id: 0, title: "", content: "" };
    viewSaveResult.value = {} as ReviewResult;
}

/**
 * 设置章节ID的校验规则
 */
function SetChapterRequire(isRequired: boolean) {
    if (isRequired) {
        chapterIdRules.value = [{
            required: true,
            message: '请至少选择一个章节'
        }];
    } else {
        chapterIdRules.value = [];
    }
}
SetChapterRequire(true);


/**
 * 切换书籍时加载对应的章节和规则
 */
function onChangeBook() {
    onChangeBookLoadChapter();
    onLoadRulefromBook();
}

/**
 * 切换书后加载对应的章节
 */
function onChangeBookLoadChapter() {
    if (!form.bookId) return;
    queryBookById(form.bookId ?? 0).then((result: any) => {
        form.chapterId = [] // 清空已选章节
        Chapters.value = result.data.Index.filter((i: any) => i.IsHasContent)
        Volumes.value = result.data.Volumes;
    })
}

function onLoadRulefromBook() {
    if (!form.bookId) return;
    queryReviewRuleOnBook(form.bookId).then((result: any) => {
        ruleData.value = result.data;
    });
}

/**
 * 更新预览
 */
async function onTryIt() {
    await formRef.value.validate();
    if (!form.bookId || form.chapterId.length == 0 || form.curRegex == '') {
        return;
    }
    visBtLoading.value = true;
    let result = await tryARuleOnBook({
        bookid: form.bookId,
        chapterids: form.chapterId,
        regex: form.curRegex,
        replace: form.curReplace,
    }).finally(() => {
        visBtLoading.value = false;
    });

    if (result.code != ApiResultCode.Success) return;
    CleanView();
    diffResult.value = result.data;
}

/**
 * 保存-应用到所有章节
 */
async function onSave() {
    SetChapterRequire(false);
    await nextTick();
    await formRef.value.validate();
    SetChapterRequire(true);

    if (!form.bookId || form.curRegex == '') {
        return;
    }
    CleanView();
    isLoading.value = true;
    let result = await saveReviewOnBook({
        bookid: form.bookId,
        chapterids: form.chapterId,
        regex: form.curRegex,
        replace: form.curReplace,
    }).finally(() => {
        isLoading.value = false;
    });
    if (result.code != ApiResultCode.Success) return;
    saveResult.value = result.data;
    HeatABook(form.bookId);
}

async function onSaveWithChapter() {
    await formRef.value.validate();
    if (!form.chapterId || form.chapterId?.length == 0) return;
    await onSave();
}

/**
 * 载入一个章节预览
 */
async function onViewChapter() {
    await formRef.value.validate();
    if (!form.chapterId || form.chapterId?.length == 0) return;
    const chapterId = form.chapterId[0];

    isLoading.value = true;
    queryChapterById(chapterId).then((result: any) => {
        if (result.code != ApiResultCode.Success) return;
        CleanView();
        viewChapter.value = {
            id: chapterId,
            title: result.data.Title,
            content: result.data.Content,
        };
    }).finally(() => {
        isLoading.value = false;
    })
}

async function onDeleteRule(ruleUseId: number) {
    await deleteReviewRuleForBook(ruleUseId).then((result: any) => {
        if (result.code != ApiResultCode.Success) return;
        ruleData.value = ruleData.value.filter((item: RuleAndBook) => item.id !== ruleUseId);
    });
}

async function onUndoChapter() {
    if (!viewSaveResult.value?.id) {
        Message.error(`请先点击章节结果选中需要恢复的章节。`);
        return;
    }
    let chapter = {
        IndexId: viewSaveResult.value?.id,
        Content: viewSaveResult.value?.content,
    } as Chapter;
    if (!chapter.Content || !chapter.IndexId) {
        Message.error(`章节${viewSaveResult.value?.title}恢复失败：章节信息缺失。`);
        return;
    }
    editChapter(chapter).then(rsl => {
        Message.success(`章节${viewSaveResult.value?.title}已恢复到校阅前状态`);
    }).catch((err: any) => {
        Message.error(`章节${viewSaveResult.value?.title}恢复失败：${err.message || err}`);
    });
}

async function onUndoAll() {
    if (saveResult.value?.length == 0) {
        Message.error(`没记录到已修改的章节信息。`);
        return;
    }
    let resultError = [] as string[];
    let count = 0;
    saveResult.value.forEach((item: ReviewResult) => {
        let chapter = {
            IndexId: item.id,
            Content: item.content,
        } as Chapter;
        editChapter(chapter).then(rsl => {
            // Message.success(`章节${item.title}已恢复到校阅前状态`);
        }).catch((err: any) => {
            resultError.push(`章节${item.title}恢复失败：${err.message || err}`);
        }).finally(() => {
            count++;
            if (count !== saveResult.value?.length) return;

            if (resultError.length > 0)
                Message.error(`以下章节恢复失败：\n${resultError.join("\n")}`);
            else
                Message.success(`所有章节已恢复到校阅前状态`);
        });
    });
}

function onSuspiciousCharsAnalysis() {
  if (!form.bookId) {
    Message.error('请先选择要校阅的书');
    return;
  }
  
  // 构建URL参数
  const params = new URLSearchParams();
  params.append('bookId', form.bookId.toString());
  
  if (form.chapterId && form.chapterId.length > 0) {
    params.append('chapterIds', form.chapterId.join(','));
  }
  
  // 在新标签页打开特殊字符分析页面
  window.open(`/workplace/suspiciouschars?${params.toString()}`, '_blank');
}
</script>