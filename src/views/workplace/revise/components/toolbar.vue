<template>
    <a-row align="end" justify="center">
        <a-space direction="vertical">
            <a-space>
                <a-button-group type="primary">
                    <a-button @click="() => { isOrdering = !isOrdering; emit('EditChapterOrdering', isOrdering); }"
                        :status="isOrdering ? 'success' : 'normal'"> {{ isOrdering ? "保存并退出排序" : "章节排序" }} </a-button>
                    <a-button @click="isEditBookInfo = true"> <icon-pen /> 元数据 </a-button>
                    <a-button @click="isFormatTitle = true"> 标题格式化 </a-button>
                    <a-button @click="checkDescriptions = true"> 内容重复检查 </a-button>
                    <a-button @click="showHiddenChapters(bookid ?? 0)"> 已隐藏章节 </a-button>

                </a-button-group>
            </a-space>
        </a-space>
    </a-row>
    <EditBookInfo :visible="isEditBookInfo" :bookId="bookid ?? 0" @cancel="isEditBookInfo = false" />
    <Descriptions :bookId="bookid ?? 0" :show="checkDescriptions" @close="checkDescriptions = false" />
    <FormatTitle v-model:visible="isFormatTitle" :bookId="bookid ?? 0" :chapters="chapters" />
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import EditBookInfo from '@/components/book-info/edit.vue';
import Descriptions from '@/components/book-tool/duplicates.vue';
import FormatTitle from './FormatTitle.vue';
import type { Chapter } from "@/types/book";
import useChapterHiddenHelper from "@/hooks/chapter-hidden";


const isEditBookInfo = ref(false);      //是否正在编辑书籍信息
const checkDescriptions = ref(false);
const isFormatTitle = ref(false);

const props = defineProps<{
    bookid: number | undefined;
    chapters: Array<Chapter>;
}>();


//状态区
const isOrdering = ref(false);//是否正在排序


//定义消息
const emit = defineEmits(["EditChapterOrdering"]);


const { showHiddenChapters } = useChapterHiddenHelper();

</script>
