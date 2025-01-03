<template>
  <div>
    <a-spin :size="32" :loading="loading" style="width: 100%">
      <a-split :style="{
        height: '75vh',
        width: '100%',
        minWidth: '500px',
        marginTop: '40px',
        // border: '1px solid var(--color-border)'
      }" min="80px" disabled size="0.618">
        <template #first>
          <a-card hoverable :style="{
            overflow: 'hidden',
            marginBottom: '20px',
            height: '65vh',
            marginRight: '40px',
          }">
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
            <a-form ref="formRef" :model="form" :style="{ width: '540px', marginLeft: '40px' }" auto-label-width>
              <a-form-item field="encoderType" tooltip="设置文本编码" label="选择编码"
                :rules="[{ required: true, message: '必须设置文本编码' }]">
                <a-radio-group v-model="form.encoderType" :options="['gb2312', 'utf8']" @change="getFileText" />
              </a-form-item>
              <a-form-item v-if="(files?.length ?? 0) > 1" field="oneChapterAFile" tooltip="每个文件为单独章节" label="按文件拆分">
                <a-switch v-model="form.oneChapterAFile" :default-checked="(files?.length ?? 0) > 1" />
              </a-form-item>
              <a-form-item field="removeRule" label="删除规则" tooltip="按正则解释输入的规则，命中的内容替换为空。用于删除一些广告之类的文案。">
                <a-input-tag v-model="form.removeRule" placeholder="按回车设置一条规则，使用Global模式的正则表达式" allow-clear />
              </a-form-item>
              <a-form-item field="titleRule" label="章节标题" tooltip="章节分割规则，通过命中章节标题分割章节。如果留空则不进行任何分割！">
                <a-textarea v-model="form.titleRule" v-if="form.oneChapterAFile === false" :auto-size="{ minRows: 2 }"
                  placeholder="使用正则表达式语法，启用全局匹配模式，所以切勿使用$标记行尾；需要用提取符()将章节标题完整取出。" />
                <span v-else>每个文件为单独章节，无需设置</span>
              </a-form-item>
              <a-form-item>
                <a-button status="warning" @click="testCleanRule">测试删除规则</a-button>
                <a-button status="warning" @click="testCutRule"
                  v-if="form.oneChapterAFile === false">测试分割章节规则</a-button>
              </a-form-item>
            </a-form>
          </a-space>
        </template>
      </a-split>
    </a-spin>
  </div>
</template>

<script lang="ts" setup>
import { PropType, reactive, ref, h } from 'vue';
import { FileItem, Modal, Table } from '@arco-design/web-vue';
import { FormInstance } from '@arco-design/web-vue/es/form';
import { IChapter } from './utils';
import { cleanContent, cutContent } from './utils';
import useLoading from '@/hooks/loading';


const { loading, setLoading } = useLoading(false);


// 暴露的属性
const prop = defineProps({
  files: { type: Array as PropType<FileItem[]> },
});

// 文档列表
const contents: IChapter[] = reactive([]);

// 表单对象
const formRef = ref<FormInstance>();
const form = reactive({
  encoderType: '',
  oneChapterAFile: (prop.files?.length ?? 0) > 1,
  removeRule: [],
  titleRule: '',
}) as any;

// 前端读取文本内容
const getFileText = () => {
  if (prop.files?.length === 0) return;
  contents.length = 0;

  setLoading(true);
  setTimeout(() => {
    prop.files?.forEach((file) => {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        contents.push({
          txt: fileReader.result as string,
          name: file.name ?? '未知文件',
        });
      };
      fileReader.readAsText(file.file as Blob, form.encoderType);
    });
    setLoading(false);
  }, 200);
};

/**
 * 测试删除规则
 */
function testCleanRule() {
  let runRsl = cleanContent(contents, form.removeRule);
  let showResult = [];
  for (let key in runRsl.litters) {
    showResult.push({
      key: key,
      reg: key,
      count: runRsl.litters[key].length,
      demo: runRsl.litters[key].slice(0, 5).join(' '),
    });
  }
  console.log(showResult);
  Modal.info({
    title: '测试结果',
    content: () => {
      return h(Table, {
        columns: [
          { title: '标签', dataIndex: 'reg' },
          { title: '命中', dataIndex: 'count' },
          { title: '命中样例', dataIndex: 'demo' },
        ],
        data: showResult,
        pagination: false,
      });
    },
  });

}

function testCutRule() {
  cutContent(contents, form.titleRule);
}

// 重置数据
const restData = async () => {
  await formRef.value?.resetFields();
  contents.length = 0;
};

/**
 * 获取数据、配置
 */
const getData = () => {
  formRef.value?.validate(); // 校验表单
  return {
    contents,
    setting: form,
  };
};

// 暴露的方法
defineExpose({ restData, getData });
</script>
