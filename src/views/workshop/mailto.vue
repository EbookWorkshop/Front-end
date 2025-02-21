<template>
  <div class="container">
    <Breadcrumb :items="['menu.library', 'menu.workshop.mailto']" />
    <div class="wrapper">
      <a-spin dot :loading="dataLoading" style="width: 100%;">
        <a-row>
          <a-col :span="20" :offset="2">
            <a-form :model="emailForm" size="large" :style="{ width: '100%' }" auto-label-width @submit="handleSubmit">

              <a-form-item field="from" label="发出邮箱" :required="true">
                <a-input v-model="emailForm.from" placeholder="请先到【系统设置】→【邮箱配置】设置发件用邮箱账号和密码" disabled />
              </a-form-item>
              <a-form-item field="to" label="接收邮箱" :required="true">
                <a-input v-model="emailForm.to" placeholder="接收设备上开通邮件推送服务的邮箱" />
              </a-form-item>
              <a-form-item v-for="(book, index) of emailForm.bookList" :key="index">
                <a-form-item label="书">
                  <a-select v-model="book.bookid" placeholder="请选择" @change="OnAddABook" allow-search>
                    <a-option v-for="item of allBookList" :value="item.BookId" :label="item.BookName" />
                  </a-select>
                  <a-radio-group style="width:280px;" v-model:model-value="book.filetype">
                    <a-radio value="pdf">PDF</a-radio>
                    <a-radio value="txt">TXT</a-radio>
                    <a-radio value="epub">Epub</a-radio>
                  </a-radio-group>
                </a-form-item>
              </a-form-item>
              <a-form-item label="上传书籍">
                <a-upload v-model:file-list="emailForm.fileList" :show-file-list="true" :auto-upload="false"
                  :multiple="true" class="fileUpload"></a-upload>
              </a-form-item>

              <a-form-item>
                <a-button html-type="submit" status="success" type="primary">{{
                  $t('workshop.mailto.send')
                }}</a-button>
              </a-form-item>
            </a-form>
          </a-col>
        </a-row>
      </a-spin>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
import { queryBookList } from '@/api/library'
import { getSMTPServer, getKindleInbox } from '@/api/system';
import useRequest from '@/hooks/request';
import { FileItem, Message } from '@arco-design/web-vue';
import { sendAEMail } from '@/api/system'
import { Book } from '@/types/book'

const dataLoading = ref(false);

const { response: allBookList } = useRequest<Book[]>(queryBookList);
// const {response:SendMail} = useRequest<any>(getSMTPServer);
getSMTPServer().then((response) => {
  emailForm.from = response.data?.address
});
getKindleInbox().then((response) => {
  emailForm.to = response.data?.address
});

/**
 * 邮件表单
 */
const emailForm = reactive({
  from: "",//发件人
  to: "",//收件人
  bookList: [{
    bookid: '请选择' as string | number,
    filetype: "pdf"
  }],
  fileList: [] as FileItem[]
})

function OnAddABook() {
  if (emailForm.bookList[emailForm.bookList.length - 1].bookid == "请选择") return;
  emailForm.bookList.push({ bookid: '请选择', filetype: "pdf" });
}


/**
 * 发邮件
 */
function handleSubmit() {
  const formData = new FormData();
  emailForm.fileList.map(t => formData.append("bookFiles", t.file as File));
  formData.append("sender", emailForm.from);
  formData.append("mailto", emailForm.to);
  formData.append("bookList", JSON.stringify(emailForm.bookList.filter(f => f.bookid != "请选择")));

  sendAEMail(formData as any).then((rsl) => {
    Message.success("已发送邮件：" + rsl);
  }).catch(err => {
    Message.error("发送邮件失败：" + err);
  });
}

</script>

<style lang="less">
.fileUpload {
  div.arco-upload-list {
    .arco-upload-progress {
      display: none;
      /* 文件进度条上的开始按钮 不做独立上传，不要开始按钮 */
    }
  }
}
</style>