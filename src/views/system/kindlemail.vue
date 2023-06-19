<template>
  <div class="container">
    <Breadcrumb :items="['menu.system', 'menu.system.smtp']" />
    <div class="wrapper">
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
                placeholder="请输入收邮件用的邮箱地址"
              />
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
  </div>
</template>

<script lang="ts">
  import { reactive } from 'vue';
  import { getKindleInbox, saveKindleInbox } from '@/api/system';
  import { Message } from '@arco-design/web-vue';

  export default {
    setup() {
      const form = reactive({
        email: '',
        // post: '',
        // isRead: false,
      });
      getKindleInbox().then((result: any) => {
        // console.log(result);
        form.email = result.data?.address;
        // form.post = result.data?.password;
      });
      const handleSubmit = (data: object) => {
        Message.loading('已提交，请稍候...');
        saveKindleInbox(form.email)
          .then((rsl: any) => {
            Message.success('收件地址保存成功！');
          })
          .catch((err: any) => {
            Message.error(`保存失败：${err}`);
          });
      };

      return {
        form,
        handleSubmit,
      };
    },
  };
</script>
