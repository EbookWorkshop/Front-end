<template>
  <a-modal :visible="visible" fullscreen>
    <template #title> 导入向导 </template>
    <a-spin :loading="loading" style="width: 100%">
      <a-card class="general-card">
        <div class="wrapper">
          <a-steps v-model:current="step" style="width: 100%" class="steps">
            <a-step description="选择文件">导入文件</a-step>
            <a-step description="设置分割规则">分割章节</a-step>
            <a-step description="预览、修改">预览</a-step>
            <a-step description="保存">保存</a-step>
          </a-steps>
          <keep-alive>
            <step1
              v-if="step == 1"
              :status="fileStatus"
              @set-file="onSetFile"
            ></step1>
            <step2 v-else-if="step == 2" :contents="textList"></step2>
          </keep-alive>
        </div>
      </a-card>
      <a-result :status="null" style="position: fixed; bottom: 100px">
        <template #extra>
          <a-space>
            <a-button type="primary" long @click="changeStep(-1)"
              >上一步</a-button
            >
            <a-button type="primary" long @click="changeStep(1)"
              >下一步</a-button
            >
          </a-space>
        </template>
      </a-result>
    </a-spin>
  </a-modal>
</template>

<script lang="ts" setup>
  import { ref, PropType } from 'vue';
  import { FileItem } from '@arco-design/web-vue';
  import useLoading from '@/hooks/loading';
  import Step1 from './import-text-step1.vue';
  import Step2 from './import-text-step2.vue';

  // 传入参数
  const prop = defineProps({
    visible: { type: Boolean },
  });

  const { loading, setLoading } = useLoading(false);

  // 变量定义
  const step = ref(1); // 当前所在步骤
  const fileStatus = ref<
    'normal' | 'error' | 'success' | 'warning' | 'info' | undefined
  >(undefined);
  let fileList: FileItem[] = [];

  const textList: any = ref([]); // 文本列表

  // 设置文件-文件列表变更时
  const onSetFile = (files: FileItem[]) => {
    fileList = files;
    fileStatus.value = files.length > 0 ? undefined : 'error';
  };

  // 前端读取文本内容
  const getFileText = () => {
    if (fileList.length === 0) return;
    textList.value = [];
    const fileReader = new FileReader();
    fileReader.onload = () => {
      textList.value.push({
        txt: fileReader.result,
        name: '',
      });
      console.log(fileReader);
    };
    fileList.forEach((file) => {
      fileReader.readAsText(file.file as Blob, 'gb2312'); // TODO：encoding
    });
  };

  const changeStep = (direction: number) => {
    console.log('step!!!');
    if (fileList.length === 0 && direction > 0) {
      step.value = 1;
      fileStatus.value = 'error';
      return;
    }
    fileStatus.value = undefined;

    step.value += direction;

    step.value = Math.max(1, step.value);
    step.value = Math.min(4, step.value);

    if (direction < 0) return;

    // 设置每步做什么
    switch (step.value) {
      case 2: // TODO:将文件列表解释，并放在预览框里
        getFileText();
        break;
      default:
        break;
    }
  };
</script>
