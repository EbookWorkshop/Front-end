<template>
    <a-modal :visible="visible" title="修改元数据" @before-ok="handleBeforeOk" @cancel="emit('cancel')">
        <a-form :model="form">
            <input type="hidden" :value="form.id" />
            <a-form-item field="name" label="书名">
                <a-input v-model="form.name" />
            </a-form-item>
            <a-form-item field="author" label="作者">
                <a-input v-model="form.author" />
            </a-form-item>
            <a-form-item field="defFont" label="默认字体">
                <a-select v-model="form.font as string">
                    <a-option v-for="font in fontData" :key="font.name" :value="font.name">
                        {{ font.name }}
                    </a-option>
                </a-select>
            </a-form-item>
            <a-form-item field="overview" label="简介">
                <a-textarea v-model="form.overview"></a-textarea>
            </a-form-item>
            <a-form-item field="bookCover" tooltip="" label="封面">
                <a-upload v-model="form.bookCover" :show-file-list="false" :auto-upload="false">
                    <template #upload-button>
                        <div>
                            <div class="arco-upload-picture-card">
                                <div class="arco-upload-picture-card-text">
                                    <IconPlus />
                                    <div style="margin-top: 10px; font-weight: 600">上传</div>
                                </div>
                            </div>
                        </div>
                    </template>
                </a-upload>
            </a-form-item>
        </a-form>
    </a-modal>
</template>
<script lang="ts" setup>
import { reactive, ref, watch } from 'vue';
import { queryFontList, ASSETS_HOST, } from '@/api/font';
import { queryBookInfo } from '@/api/book';


let fontDataMap = new Map();
let fontData: Array<any> = [];
const prop = defineProps<{
    visible: boolean,
    bookId: number,
}>();

watch(() => prop.bookId, async (newBookId) => {
    console.log('newBookId', newBookId);
    if (newBookId !== 0) {
        const result = await queryBookInfo(newBookId);
        const bookInfo = result.data;
        form.id = bookInfo.id;
        form.name = bookInfo.BookName;
        form.author = bookInfo.Author ?? '佚名';
        form.font = bookInfo.FontFamily;
        form.overview = bookInfo.overview;
        form.bookCover = bookInfo.CoverImg;
    }
});

const emit = defineEmits(["submit", "cancel"]);

const form = reactive({
    id: prop.bookId,
    name: '',
    author: '',
    font: '',
    overview: '',
    bookCover: '',
});

function handleBeforeOk(callback: any) {
    // emit('submit', form);
    // callback(true); // 关闭弹窗

}

async function InitFont() {
    fontData = await queryFontList();
    fontDataMap = new Map(fontData.map(t => [t.name, t]));
}
InitFont();


</script>