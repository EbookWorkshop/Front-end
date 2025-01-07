<template>
    <div class="container">
      <Breadcrumb :items="['menu.library', 'menu.workshop.mailto']" />
      <div class="wrapper">
        <a-spin dot :loading="dataLoading" style="width: 100%;">
          <a-row>
            <a-col :span="20" :offset="2">
              <a-form :model="emailForm" size="large" :style="{ width: '100%' }" auto-label-width @submit="handleSubmit">
  
                <a-form-item field="from" label="发出邮箱">
                  <a-input v-model="emailForm.from" placeholder="请先到【系统设置】→【邮箱配置】设置发件用邮箱账号和密码" disabled />
                </a-form-item>
                <a-form-item field="to" label="接收邮箱">
                  <a-input v-model="emailForm.to" placeholder="接收设备上开通邮件推送服务的邮箱" />
                </a-form-item>
                <a-form-item v-for="(book, index) of emailForm.bookList" :key="index">
                  <a-form-item label="书">
                    <a-select v-model="book.bookid" placeholder="请选择" @change="OnAddABook">
                      <a-option v-for="item of allBookList" :value="item.BookId" :label="item.BookName" />
                    </a-select>
                    <a-radio value="radio">PDF</a-radio>
                    <a-radio value="radio">TXT</a-radio>
                  </a-form-item>
                </a-form-item>
                <a-form-item label="上传书籍">
                  <a-upload v-model="emailForm.bookList" :show-file-list="true" :auto-upload="false" :multiple="true">
                    <template #start-icon></template>
                  </a-upload>
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
  import useRequest from '@/hooks/request';
  
  import { Book } from '@/types/book'
  
  const dataLoading = ref(false);
  
  
  const { response: allBookList } = useRequest<Book[]>(queryBookList);
  
  
  /**
   * 邮件表单
   */
  const emailForm = reactive({
    from: "",//发件人
    to: "",//收件人
    bookList: [{
      bookid: '请选择' as string | number,
      filetype: ""
    }],
    fileList: undefined as File | undefined
  })
  
  function OnAddABook() {
    emailForm.bookList.push({ bookid: '请选择', filetype: "" })
  
  }
  
  
  /**
   * 发邮件
   */
  function handleSubmit() {
  
  }
  
  </script>
  
  <style scoped lang="less"></style>