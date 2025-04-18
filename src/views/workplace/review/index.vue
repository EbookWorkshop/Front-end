<template>
    <div class="container">
        <Breadcrumb :items="['menu.workplace', 'menu.workplace.correction.reviewbook']" />
        <div class="wrapper">
            <a-form :model="form">
                <a-row :gutter="16">
                    <a-col :span="8">
                        <a-form-item field="bookId" label="要校阅的书" label-col-flex="90px" required>
                            <SelectBook v-model="form.bookId" @change="onChangeBook" />
                        </a-form-item>
                    </a-col>
                    <a-col :span="16">
                        <a-form-item field="chapterId" label="预览章节" label-col-flex="100px" required
                            tooltip="挑几章在下面看看效果">
                            <a-select v-model="form.chapterId" :options="Chapters" default-value=""
                                :field-names="{ value: 'IndexId', label: 'Title' }" allow-search multiple
                                :virtual-list-props="{
                                    height: 500,
                                    threshold: 80,
                                }" />
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
                                                    @click="form.curRegex = ruleItem.Rule;form.curReplace = ruleItem.Replace" style="cursor: pointer;">{{
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
                        <a-form-item label="匹配规则" label-col-flex="80px" required>
                            <a-textarea v-model="form.curRegex"> </a-textarea>
                        </a-form-item>
                    </a-col>
                    <a-col :span="10">
                        <a-form-item label="替换为" label-col-flex="80px">
                            <a-textarea v-model="form.curReplace"> </a-textarea>
                        </a-form-item>
                    </a-col>
                    <a-col :span="4">
                        <a-space direction="horizontal" wrap>
                            <a-button type="primary" @click="onTryIt" :loading="visBtLoading">更新预览</a-button>
                            <a-button type="primary" status="success" @click="onSave">应用到所有章节</a-button>
                            <a-dropdown @select="" :popup-max-height="false">
                                <a-button>更多 <icon-down /></a-button>
                                <template #content>
                                    <a-doption @click="onViewChapter">章节载入预览（已校阅的结果）</a-doption>
                                    <a-doption>只应用到预览章节</a-doption>
                                    <a-doption></a-doption>
                                </template>
                            </a-dropdown>
                        </a-space>
                    </a-col>
                </a-row>
            </a-form>

            <a-divider class="divider">结果预览（未更新到数据库）</a-divider>
            <div style="height: 100vh; overflow: scroll">
                <div v-for="item in diffResult" :key="item.id">
                    <a-typography-title :heading="3">{{ item.title }}</a-typography-title>
                    <Diff mode="split" :theme="theme" language="text" :prev="item.content" :current="item.newText"
                        style="height: 100%; width: 100%; overflow: scroll" />
                </div>
                <a-typography-paragraph v-for="(item, index) in saveResult" :key="index">
                    <a-typography-text>章节标题： {{ item.title }} </a-typography-text>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <a-typography-text>更新结果： {{ item.updateRsl }} </a-typography-text>
                </a-typography-paragraph>
                <a-typography v-if="viewChapter?.id != 0">
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
import "vue-diff/dist/index.css";
import { ref, reactive, computed } from 'vue';
import SelectBook from '@/components/select-book/index.vue';
import type { Rule } from '@/api/workplace';
import { ApiResultCode } from "@/types/global"
import { queryReviewRuleOnBook, RuleAndBook, queryReviewRuleList, tryARuleOnBook, saveReviewOnBook, deleteReviewRuleForBook } from '@/api/workplace';
import { queryBookById, queryChapterById } from '@/api/book';
import useRequest from '@/hooks/request';
import { useAppStore } from '@/store';

const appStore = useAppStore();
const theme = computed<any>(() => {
    return appStore.theme;
});

const form = reactive({
    bookId: undefined as number | undefined,
    chapterId: [] as number[],
    curRegex: '' as string,
    curReplace: '' as string,
});
const Chapters = ref([]);       //已选中的书所有的章节
const ruleData = ref<RuleAndBook[]>([]);    //已选中的书所有的规则
// const ruleTempAdd = ref<RuleAndBook[]>([]);    //临时添加的规则
let { response: ruleAll } = useRequest<Rule[]>(queryReviewRuleList);    //所有已存在的规则
const ruleItem = ref<Rule>();    //规则详情
const diffResult = ref<{
    id: number;
    title: string;
    content: string;
    newText: string;
}[]>([]);//对比的结果
const saveResult = ref<{
    title: string;
    updateRsl: any;
}[]>();    //保存结果
const viewChapter = ref<{
    id: number;
    title: string;
    content: string;
}>({ id: 0, title: "", content: "" });    //预览的章节
//控件状态
const visBtLoading = ref<boolean>(false);

/**
 * 清空所有预览数据
 */
function CleanView() {
    diffResult.value = [];
    saveResult.value = [];
    viewChapter.value = { id: 0, title: "", content: "" };
}


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
    if (form.chapterId.length == 0 || form.curRegex == '') {
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
 * 保存
 */
async function onSave() {
    if (!form.bookId || form.curRegex == '') {
        return;
    }
    let result = await saveReviewOnBook({
        bookid: form.bookId,
        chapterids: form.chapterId,
        regex: form.curRegex,
        replace: form.curReplace,
    });
    if (result.code != ApiResultCode.Success) return;
    CleanView();
    saveResult.value = result.data;
}

/**
 * 载入一个章节预览
 */
async function onViewChapter() {
    if (!form.chapterId || form.chapterId?.length == 0) return;
    const chapterId = form.chapterId[0];

    queryChapterById(chapterId).then((result: any) => {
        if (result.code != ApiResultCode.Success) return;
        CleanView();
        viewChapter.value = {
            id: chapterId,
            title: result.data.Title,
            content: result.data.Content,
        };
    })
}

async function onDeleteRule(ruleUseId: number) {
    await deleteReviewRuleForBook(ruleUseId).then((result: any) => {
        if (result.code != ApiResultCode.Success) return;
        ruleData.value = ruleData.value.filter((item: RuleAndBook) => item.id !== ruleUseId);
    });
}

</script>