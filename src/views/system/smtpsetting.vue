<template>
  <div class="container">
    <Breadcrumb :items="['menu.system', 'menu.system.smtp']" />
    <a-row>
      <a-col :span="20" :offset="2">
        <a-form
          :model="form"
          size="large"
          :style="{ width: '700px' }"
          auto-label-width
          @submit="handleSubmit"
        >
          <a-form-item field="email" label="邮箱地址">
            <a-input
              v-model="form.email"
              placeholder="请输入发邮件用的邮箱地址"
            />
          </a-form-item>
          <a-form-item field="post" label="身份验证码/密码">
            <a-input
              v-model="form.post"
              placeholder="请输入邮箱验证码（部分邮箱支持用身份验证码进行发邮件，不必使用登陆密码）"
              :type="form.isRead ? 'text' : 'password'"
            />
          </a-form-item>
          <a-form-item field="isRead">
            <a-switch v-model="form.isRead"></a-switch
            ><a-typography-text> 显示密码</a-typography-text>
          </a-form-item>
          <a-form-item>
            <a-button html-type="submit" status="success" type="primary">{{
              $t('system.form.save')
            }}</a-button>
          </a-form-item>
        </a-form>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts" setup>
  import { reactive } from 'vue';
  import { getSMTPServer, saveSMTPServer } from '@/api/system';
  import { Message } from '@arco-design/web-vue';

  const form = reactive({
    email: '',
    post: '',
    isRead: false,
  });

  getSMTPServer().then((result: any) => {
    // console.log(result);
    form.email = result.data?.address;
    form.post = result.data?.password;
  });

  function handleSubmit(data: object) {
    Message.loading('已提交，请稍候...');
    saveSMTPServer(form.email, form.post)
      .then((rsl: any) => {
        Message.success('邮箱服务器信息保存成功！');
      })
      .catch((err: any) => {
        Message.error(`保存失败：${err}`);
      });
  }
</script>
