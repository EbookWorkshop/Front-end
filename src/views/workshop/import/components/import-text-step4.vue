<template>
  <a-form ref="formRef" :model="form" @submit="handleSubmit">
    <a-form-item field="bookCover" tooltip="" label="封面">
      <a-upload v-model="form.bookCover" :show-file-list="false" :auto-upload="false" @change="onFileChange">
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
    <a-form-item field="bookName" label="书名" required>
      <a-input v-model="form.bookName" placeholder="输入书名" :default-value="bookName" />
    </a-form-item>
    <a-form-item field="author" label="作者">
      <a-input v-model="form.author" />
    </a-form-item>
  </a-form>
</template>

<script lang="ts" setup>
import {ref} from 'vue';
import { FileItem } from '@arco-design/web-vue';
import { reactive, toRaw } from 'vue';

const prop = defineProps({
  bookName: String,
});
const form = reactive({
  bookName: prop.bookName,
  author: '',
  bookCover: undefined as File | undefined,
});
const formRef = ref();

const onFileChange = (fileList: FileItem[], curFile: FileItem) => {
  form.bookCover = curFile.file;
};

const handleSubmit =async (data: any) => {
  let result = await formRef.value.validate();
  if(result?.bookName?.isRequiredError) return false;

  return toRaw(form);
};

const init = (firstChapter: string) => {
  let author = firstChapter.match(/(?:作者[：:\s]+(?:\s+)?([^\n]+))|(?:\s+(\S+)著)\r?\n/);
  console.log(author)
  form.author = author ? (author[1] || author[2]) : '佚名';
  form.bookName = form.bookName?.replace(/[《》]/g, "");
}

defineExpose({ submit: handleSubmit, init });
</script>
