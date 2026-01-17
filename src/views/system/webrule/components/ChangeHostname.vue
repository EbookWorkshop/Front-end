<template>
  <a-modal :visible="visible" title="修改域名" :width="500" :ok-button-props="{ loading }" @before-ok="handleOk"
    @cancel="handleCancel">
    <a-alert type="info">修改后，已抓取的书籍目录地址将更改为新域名。适用于被抓取网站的域名变更后同步迁移。</a-alert>
    <a-alert type="warning">注意：本功能不会修改配置方案信息。请自行将方案域名调整。</a-alert>
    <a-space>
    </a-space>
    <a-form ref="formRef" :model="form" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
      <a-form-item label="原域名" field="oldHostname" :rules="[{ required: true, message: '请输入原域名' }]">
        <a-input v-model="form.oldHostname" placeholder="请输入原域名，无需带http、https" allow-clear />
      </a-form-item>

      <a-form-item label="新域名" field="newHostname" :rules="[{ required: true, message: '请输入新域名' }]">
        <a-input v-model="form.newHostname" placeholder="请输入新域名，无需带http、https" allow-clear />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue';
import { Message, type FormInstance } from '@arco-design/web-vue';
import { changeHostname } from '@/api/webbot';
import { ApiResultCode } from '@/types/global';

// 定义props
interface Props {
  visible: boolean;
}

const props = defineProps<Props>();

// 定义emits
const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void;
  (e: 'success'): void;
}>();

// 响应式数据
const loading = ref(false);
const formRef = ref<FormInstance>();
const form = reactive({
  oldHostname: '',
  newHostname: ''
});

// 取消操作
const handleCancel = () => {
  emit('update:visible', false);
  // 重置表单
  form.oldHostname = '';
  form.newHostname = '';
  loading.value = false;
};

// 确定操作（执行修改）
const handleOk = async (callback: any) => {
  let result = await formRef.value?.validate();
  if (result) { //校验不通过
    callback(false);
    return;
  }

  loading.value = true;
  try {
    let res = await changeHostname(form.oldHostname.trim(), form.newHostname.trim()) as any;
    if (res.code !== ApiResultCode.Success) throw new Error(res.msg || '迁移记录域名失败');

    const changeBookCount = res.data.length;
    let showContent = '';
    if (changeBookCount === 0) {
      showContent = `${res.msg}：未找到相关书籍。`;
    } else if (changeBookCount >= 10) {
      showContent = `${res.msg}：已调整${changeBookCount}本书，部分书为：${res.data.splice(0, 10).map((item: any) => `《${item.BookName}》`).join('、')}等……`;
    } else {
      showContent = `${res.msg}：已调整${changeBookCount}本书，分别为：${res.data.map((item: any) => `《${item.BookName}》`).join('、')}。`;
    }
    Message.success({
      content: showContent,
      duration: 18000
    });
    emit('success');
    callback(true);
    handleCancel();
  } catch (error) {
    Message.error('迁移记录域名失败');
    console.error('修改域名失败:', error);
    callback(false);
  } finally {
    loading.value = false;
  }
};

</script>