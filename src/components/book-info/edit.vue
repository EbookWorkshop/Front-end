<template>
    <a-modal :visible="visible" title="修改元数据" @before-ok="handleBeforeOk" @cancel="emit('cancel')" width="auto"
        @before-open="LoadData" draggable>
        <a-form :model="form">
            <a-split :style="{
                width: '100%',
                minWidth: '800px',
            }" min="80px" max="Infinity">
                <template #first>
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
                    <a-form-item field="introduction" label="简介">
                        <a-textarea v-model="form.introduction" :auto-size="{ minRows: 4, maxRows: 13 }"></a-textarea>
                    </a-form-item>
                </template>

                <template #second>
                    <a-form-item field="bookCover" label="封面模式">
                        <a-radio-group v-model="form.coverType" type='button'>
                            <a-radio value="默认">默认</a-radio>
                            <a-radio value="线装本">线装本</a-radio>
                            <a-radio value="图片">图片</a-radio>
                        </a-radio-group>
                    </a-form-item>
                    <a-form-item v-if="form.coverType == '线装本'" field="bookCover" tooltip="">
                        <a-color-picker v-model="form.bookCover" size="mini" showHistory :historyColors="history">
                            <BookCover :book-name="form.name" :cover-img="form.bookCover" />
                        </a-color-picker>
                    </a-form-item>
                    <a-form-item v-if="form.coverType == '图片'" field="bookCover" tooltip="">
                        <a-upload v-model="form.bookCover" :show-file-list="false" :auto-upload="false"
                            :on-before-upload="onSetConverFile">
                            <template #upload-button>
                                <BookCover :book-name="form.name" :cover-img="form.bookCover"
                                    :show-embed-book-name="form.embelBookName" />
                            </template>
                        </a-upload>
                    </a-form-item>
                    <a-form-item v-if="form.coverType == '图片'" label="嵌入书名">
                        <a-switch v-model="form.embelBookName"></a-switch>
                    </a-form-item>
                </template>
            </a-split>
        </a-form>
    </a-modal>
</template>
<script lang="ts" setup>
import { reactive, ref } from 'vue';
import { queryFontList, } from '@/api/font';
import { queryBookInfo, patchBookInfo } from '@/api/book';
import { Message } from '@arco-design/web-vue';

import BookCover from "@/components/book-cover/index.vue";
import { fromPairs } from 'lodash';

const SHOW_BOOKNAME = "#showname";

// let fontDataMap = new Map();
let fontData: Array<any> = [];      //系统已安装字体
const prop = defineProps<{
    visible: boolean,
    bookId: number,
}>();
let oldBookMeta = {} as any;       // 保存旧的书籍元数据
const history = ref(['#0b3154', '#cb1f2f', '#f2e3a4', '#212f30', '#034934', '#9B4B8C', '#E0873A']); // 封面预设色
let tempConverFile = ref<File>(); // 临时封面文件

const emit = defineEmits(["submit", "cancel"]);

const form = reactive<any>({
    id: prop.bookId,
    name: '',
    author: '',
    font: '',
    introduction: '',
    bookCover: '',
    coverType: "线装本",
    embelBookName: false,
});

/**
 * 加载数据
 */
async function LoadData() {
    if (prop.bookId !== 0) {
        const result = await queryBookInfo(prop.bookId);
        const bookInfo = result.data;
        form.id = bookInfo.id;
        form.name = bookInfo.BookName;
        form.author = bookInfo.Author ?? '佚名';
        form.font = bookInfo.FontFamily;
        form.introduction = bookInfo.Introduction;
        form.bookCover = bookInfo.CoverImg;
        if(!bookInfo.CoverImg || bookInfo.CoverImg==="") form.coverType = "默认";
        else if(bookInfo.CoverImg.startsWith("#")) form.coverType = "线装本";
        else form.coverType = "图片";

        oldBookMeta = { ...form };
        form.embelBookName = bookInfo.CoverImg?.includes("#showname");
    }
    if (fontData.length == 0) {
        await InitFont();
    }
};

/**
 * 提交修改
 * @param callback 
 */
async function handleBeforeOk(callback: any) {
    let metaForm = new FormData();
    metaForm.append('id', form.id);
    if (form.bookCover?.startsWith("blob:")) {          //新上传的封面图片情况
        metaForm.append('coverFile', tempConverFile.value ?? "");
        form.bookCover = oldBookMeta.bookCover;//还原，跳过设置，直接用文件
        if (form.embelBookName) form.bookCover = SHOW_BOOKNAME;
    }
    if(form.coverType == "默认") form.bookCover = "";

    //在文件末尾加入标签用于识别是否嵌入标题
    if (!form.bookCover?.startsWith("#")) {//线装本模式
        if (form.embelBookName && !form.bookCover?.includes(SHOW_BOOKNAME)) form.bookCover += SHOW_BOOKNAME;
        else if (!form.embelBookName && form.bookCover?.includes(SHOW_BOOKNAME)) form.bookCover = form.bookCover.replace(SHOW_BOOKNAME, '');
    }

    for (let key in form) {
        if (form[key] !== oldBookMeta[key]) {
            metaForm.append(key, form[key]);
        }
    }

    patchBookInfo(metaForm).then(async () => {
        Message.success('修改成功');
        callback(true); // 
        await LoadData();
        emit('submit', form); // 提交数据
    }).catch((err) => {
        Message.error('修改失败：' + err.message);
        callback(false);
    }).finally(() => {
        emit('cancel');
    });
}

async function InitFont() {
    fontData = await queryFontList();
    // fontDataMap = new Map(fontData.map(t => [t.name, t]));
}

/**
 * 设置修改了封面图片
 * @param {File} file 
 */
function onSetConverFile(file: File) {
    if (!file) return false;

    let tempFileUrl = URL.createObjectURL(file);
    setTimeout(() => {
        URL.revokeObjectURL(form.bookCover);
    }, 1000);
    tempConverFile.value = file;
    form.bookCover = tempFileUrl;
    return true;
}

</script>