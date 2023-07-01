<template>
  <div>
    <a-split
      :style="{
        height: '75vh',
        width: '100%',
        minWidth: '500px',
        marginTop: '40px',
        // border: '1px solid var(--color-border)'
      }"
      min="80px"
      disabled
      size="0.618"
    >
      <template #first>
        <a-card
          hoverable
          :style="{
            overflow: 'hidden',
            marginBottom: '20px',
            height: '65vh',
            marginRight: '40px',
          }"
        >
          <a-scrollbar style="height: 64vh; overflow: auto">
            <div style="min-height: 64vh; width: 100%">
              <a-typography v-for="t in contents" :key="t.name">
                <a-divider orientation="center">{{ t.name }}</a-divider>
                <!-- <a-typography-title>{{ t.name }}</a-typography-title> -->
                <a-typography-paragraph style="white-space: pre-wrap">{{
                  t.txt
                }}</a-typography-paragraph>
              </a-typography>
            </div>
          </a-scrollbar>
        </a-card>
      </template>
      <template #second>
        <a-space direction="vertical" size="large">
          <a-form :model="form" :style="{ width: '600px', marginLeft: '40px' }">
            <a-form-item
              field=""
              tooltip="设置文本编码"
              label="选择编码"
              required
            >
              <a-radio-group
                v-model="encoderType"
                :options="['gb2312', 'utf8']"
                @change="getFileText"
              />
            </a-form-item>
            <a-form-item
              v-if="(files?.length ?? 0) > 1"
              field="oneChapterAFile"
              tooltip="每个文件为单独章节"
              label="按文件拆分"
            >
              <a-switch
                v-model="form.oneChapterAFile"
                :default-checked="(files?.length ?? 0) > 1"
              />
            </a-form-item>
            <a-form-item
              field="removeRule"
              label="删除规则"
              tooltip="按正则解释输入的规则，命中的内容替换为空。用于删除一些广告之类的文案。"
            >
              <a-input-tag
                v-model="form.removeRule"
                placeholder="按回车设置规则"
                allow-clear
              />
            </a-form-item>
            <a-form-item
              field="titleRule"
              label="章节标题"
              tooltip="章节分割规则，通过命中章节标题分割章节。"
            >
              <a-textarea v-model="form.titleRule" auto-size />
            </a-form-item>
          </a-form>
        </a-space>
      </template>
    </a-split>
  </div>
</template>

<script lang="ts" setup>
  import { PropType, reactive, ref } from 'vue';
  import { FileItem } from '@arco-design/web-vue';

  // 暴露的属性
  const prop = defineProps({
    files: { type: Array as PropType<FileItem[]> },
  });

  // 文档列表
  const contents: { txt: string; name: string }[] = reactive([]);
  // 表单对象
  const form = reactive({
    oneChapterAFile: (prop.files?.length ?? 0) > 1,
    removeRule: [],
    titleRule: '',
  });
  // 解码
  const encoderType = ref('');

  // 前端读取文本内容
  const getFileText = () => {
    if (prop.files?.length === 0) return;
    contents.length = 0;

    prop.files?.forEach((file) => {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        contents.push({
          txt: fileReader.result as string,
          name: file.name ?? '未知文件',
        });
      };
      fileReader.readAsText(file.file as Blob, encoderType.value);
    });
  };

  // 重置数据
  const restData = () => {
    encoderType.value = '';
    contents.length = 0;
  };

  /**
   * 获取数据、配置
   */
  const getData = () => {
    return {
      contents,
      setting: form,
    };
  };

  // 暴露的方法
  defineExpose({ restData, getData });
</script>
