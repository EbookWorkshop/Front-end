<template>
    <a-row align="end" justify="center" style="height: 150px;">
        <a-space direction="vertical">
            <a-space>
                <a-button-group type="primary">
                    <a-button @click="() => { isOrdering = !isOrdering; emit('EditChapterOrdering', isOrdering); }"
                        :status="isOrdering ? 'success' : 'normal'"> {{ isOrdering ? "保存并退出排序" : "章节排序" }} </a-button>
                    <a-button @click="isEditBookInfo = true"> <icon-pen /> 元数据 </a-button>
                    <a-button> 标题格式化 </a-button>
                    <a-button> 内容重复检查 </a-button>

                </a-button-group>
            </a-space>

        </a-space>
    </a-row>
    <EditBookInfo :visible="isEditBookInfo" :bookId="bookid ?? 0" @cancel="isEditBookInfo = false" />

</template>

<script lang="ts" setup>
import { ref } from 'vue';
import EditBookInfo from '@/components/book-info/edit.vue';



const isEditBookInfo = ref(false);      //是否正在编辑书籍信息


defineProps<{
    bookid: number | undefined;
}>();


//状态区
const isOrdering = ref(false);//是否正在排序


//定义消息
const emit = defineEmits(["EditChapterOrdering"]);


</script>
