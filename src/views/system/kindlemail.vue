<template>
  <div class="container">
    <Breadcrumb :items="['menu.system', 'menu.system.smtp']" />
    <div class="wrapper">
      <a-spin dot :loading="dataLoading">
        <a-row>
          <a-col :span="20" :offset="2">
            <a-form :model="form" size="large" :style="{ width: '700px' }" auto-label-width @submit="handleSubmit">
              <a-form-item field="email" label="邮箱地址" required>
                <a-input v-model="form.email" placeholder="请输入收邮件用的邮箱地址" />
              </a-form-item>
              <a-form-item>
                <a-button html-type="submit" status="success" type="primary">{{
                  $t('system.form.save')
                  }}</a-button>
              </a-form-item>
            </a-form>
          </a-col>
        </a-row>
      </a-spin>
    </div>
  </div>
</template>

<script lang="ts">
import { reactive, ref } from 'vue';
import { getKindleInbox, saveKindleInbox } from '@/api/system';
import { Message } from '@arco-design/web-vue';

export default {
  setup() {
    const form = reactive({
      email: '',
      // post: '',
      // isRead: false,
    });
    const dataLoading = ref(true);

    getKindleInbox().then((result: any) => {
      form.email = result.data?.address;
    }).finally(() => {
      dataLoading.value = false;
    });
    const handleSubmit = (data: object) => {
      dataLoading.value = true;
      saveKindleInbox(form.email)
        .then((rsl: any) => {
          Message.success('收件地址保存成功！');
        })
        .catch((err: any) => {
          Message.error(`保存失败：${err}`);
        }).finally(() => {
          dataLoading.value = false;
        });
    };

    return {
      form,
      handleSubmit,
      dataLoading,
    };
  },
};
</script>
