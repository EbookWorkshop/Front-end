<template>
    <a-row align="end" justify="center">
        <a-space direction="vertical">
            <a-space>
                <a-button-group type="primary">
                    <a-button @click="isEditBookInfo = true"> <icon-pen /> 元数据 </a-button>
                    <a-button @click="() => { isOrdering = !isOrdering; emit('EditChapterOrdering', isOrdering); }" :status="isOrdering ? 'success' : 'normal'"> {{ isOrdering ? "保存并退出排序" : "章节排序" }} </a-button>
                    <a-button @click="isFormatTitle = true"> 标题格式化 </a-button>
                    <a-button @click="showHiddenChapters(bookid ?? 0)"> 已隐藏章节 </a-button>
                    <a-button @click="isVolumeSetting = true"> 分卷设置 </a-button>
                </a-button-group>
            </a-space>
            <a-space>
                <a-button-group type="primary">
                    <a-button @click="checkDescriptions = true"> 内容重复检查 </a-button>
                    <a-button @click="isPairedPunctuation = true"> 标点配对检查 </a-button>
                    <a-button @click="openSuspiciousCharsPage" title="统计分析文字，探测章节中可能存在的错用文字。"> 特殊字符分析 </a-button>
                    <a-button @click="openStatisticsPage"> 统计 </a-button>
                </a-button-group>
            </a-space>
            <a-space>
                <TagTool :bookId="bookid ?? 0" />
            </a-space>
        </a-space>
    </a-row>
    <EditBookInfo :visible="isEditBookInfo" :bookId="bookid ?? 0" @cancel="isEditBookInfo = false" />
    <Descriptions :bookId="bookid ?? 0" :show="checkDescriptions" @close="checkDescriptions = false" />
    <FormatTitle v-model:visible="isFormatTitle" :bookId="bookid ?? 0" :chapters="chapters" />
    <PairedPunctuation v-model:visible="isPairedPunctuation" :bookId="bookid ?? 0" />
    <VolumeSetting 
        v-model:visible="isVolumeSetting" 
        :bookId="bookid ?? 0" 
        :volumes="volumes" 
        :chapters="chapters" 
        @update="reloadBook"
    />
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
// 导入所需的图标组件
import EditBookInfo from '@/components/book-info/edit.vue';
import Descriptions from '@/components/book-tool/duplicates.vue';
import TagTool from '@/components/tag-toolbar/index.vue';
import FormatTitle from './FormatTitle.vue';
import PairedPunctuation from './PairedPunctuation.vue';
import VolumeSetting from './VolumeSetting.vue';
import type { Chapter, Volume } from "@/types/book";
import useChapterHiddenHelper from "@/hooks/chapter-hidden";

const router = useRouter();

const isEditBookInfo = ref(false);      //是否正在编辑书籍信息
const checkDescriptions = ref(false);
const isFormatTitle = ref(false);
const isPairedPunctuation = ref(false);
const isVolumeSetting = ref(false);

const props = defineProps<{
    bookid: number | undefined;
    chapters: Array<Chapter>;
    volumes: Array<Volume>;
}>();


//状态区
const isOrdering = ref(false);//是否正在排序


//定义消息
const emit = defineEmits(["EditChapterOrdering", "reload"]);

// 重新加载书籍数据
const reloadBook = () => {
  emit('reload');
};

const { showHiddenChapters } = useChapterHiddenHelper();

// 打开特殊字符分析页面
const openSuspiciousCharsPage = () => {
    if (props.bookid) {
        // 在新窗口打开特殊字符分析页面，并传递bookId参数
        window.open(`/workplace/suspiciouschars?bookId=${props.bookid}`, '_blank');
    }
};

const openStatisticsPage = () => {
    if (props.bookid) {
        // 在新窗口打开统计分析页面，并传递bookId参数
        window.open(`/workplace/analytics/text/${props.bookid}`, '_blank');
    }
};
</script>