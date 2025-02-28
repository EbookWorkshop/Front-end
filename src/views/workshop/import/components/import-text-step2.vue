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
                  <a-typography-paragraph style="white-space: pre-wrap">{{ t.txt }}</a-typography-paragraph>
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
                <a-input-tag v-model="form.removeRule" placeholder="按回车录入一条规则，使用正则表达式格式并开启全局、多行搜索" allow-clear />
              </a-form-item>
              <a-form-item field="titleRule" label="章节标题" tooltip="章节分割规则，通过命中章节标题分割章节。如果留空则不进行任何分割！"
                :rules="[{ match: /\(+.*?\)+/, message: '标题规则为正则表达式，需要用英文括号提取标题部分。' }]">
                <a-textarea v-model="form.titleRule" :auto-size="{ minRows: 2 }"
                  placeholder="使用正则表达式语法，启用全局匹配模式，所以切勿使用$标记行尾；需要用提取符()将章节标题完整取出。" />
              </a-form-item>
              <a-form-item>
                <a-button status="warning" long @click="testCleanRule">测试删除规则</a-button>
              </a-form-item>
              <a-form-item>
                <a-select placeholder="常见章节规则推荐" :trigger-props="{ autoFitPopupMinWidth: true }"
                  @change="form.titleRule = $event as string">
                  <a-optgroup label="含章节标题">
                    <a-option value="((第\S+?[回章][^\n]+?)|后记)\r?\n">第x章/回或后记-独立分行</a-option>
                  </a-optgroup>
                  <a-optgroup label="无章节标题">
                    <a-option value="((第\S+?章)|后记)\r?\n">第x章或后记-独立分行</a-option>
                    <a-option value="\n\s?(\S.{1,4})\s?\r?\n">任意内容5字以内的-独立分行</a-option>
                  </a-optgroup>
                </a-select>
                <a-button status="warning" @click="testCutRule">测试分割章节规则</a-button>
              </a-form-item>
            </a-form>
            <dl class="usefulRule">
              <dt>常见的删除规则</dt>
              <dd>
                <dl class="regList">
                  <dt>删除空行：</dt>
                  <dd><a-tag>^\s*\n</a-tag></dd>
                  <dt>删除胡乱换行：</dt>
                  <dd><a-tag>{{ '(?<![.：。？！…”’])\\r?\\n(\\s+)?' }}</a-tag></dd>
                </dl>
              </dd>
            </dl>
          </a-space>
        </template>
      </a-split>
    </a-spin>
  </div>
</template>

<script lang="ts" setup>
import { PropType, reactive, ref, h } from 'vue';
import { FileItem, Modal, Table, Tag, Space } from '@arco-design/web-vue';
import { FormInstance } from '@arco-design/web-vue/es/form';
import { IChapter, IForm, IStepResult } from './utils';
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
const form = reactive<IForm>({
  encoderType: '',
  oneChapterAFile: (prop.files?.length ?? 0) > 1,
  removeRule: [],
  titleRule: '',
});

// 前端读取文本内容
const getFileText = () => {
  if (prop.files?.length === 0) return;
  contents.length = 0;

  setLoading(true);
  setTimeout(() => {
    let finishFile = 0;

    prop.files?.forEach((file) => {
      const fileReader = new FileReader();
      let curFile: IChapter = {
        txt: "",
        name: file.name || '未知文件'
      }
      contents.push(curFile);//注意按传入队列顺序先加入队列
      fileReader.onload = () => {
        curFile.txt = fileReader.result as string;
        finishFile++;
        if (finishFile >= contents.length) setLoading(false);
      };
      fileReader.readAsText(file.file as Blob, form.encoderType);
    });
  }, 200);
};

/**
 * 测试删除规则
 */
function testCleanRule() {
  if (form.removeRule.length === 0) {
    formRef.value?.setFields({
      removeRule: {
        status: 'error',
        message: '需要先填写删除规则',
      }
    });
    return;
  }
  formRef.value?.validate((formOk) => {
    if (formOk?.encoderType?.isRequiredError) return;
    let runRsl = cleanContent(contents, form.removeRule);
    let showResult: Array<{
      key: string;
      reg: string;
      count: number;
      demo: string;
    }> = [];
    for (let key in runRsl.litters) {
      showResult.push({
        key: key,
        reg: key,
        count: runRsl.litters[key].length,
        demo: runRsl.litters[key].slice(0, 5).join(' '),
      });
    }

    Modal.info({
      title: '测试结果',
      width: "auto",
      draggable: true,
      content: () => h(Table, {
        columns: [
          { title: '标签', dataIndex: 'reg' },
          { title: '命中', dataIndex: 'count' },
          { title: '命中样例', dataIndex: 'demo' },
        ],
        data: showResult,
        pagination: false,
      }),
    });
  }); // 校验表单

}

/**
 * 测试章节分割规则
 */
function testCutRule() {
  if (form.titleRule.length === 0) {
    formRef.value?.setFields({
      titleRule: {
        status: 'error',
        message: '需要先填写章节标题规则',
      }
    });
    return;
  }
  formRef.value?.validate((formOk) => {
    if (formOk?.encoderType?.isRequiredError) return;
    let cutRsl = cutContent(contents, form.titleRule);
    let showTitle = cutRsl.map((c) => c.Title);
    Modal.info({
      title: `章节分割结果：共${showTitle.length}章`,
      width: "auto",
      draggable: true,
      content: () => {
        return h(Space, { wrap: true }, () => {
          return showTitle.map((t) => h(Tag, () => t));
        });
      },
    });
  });
}



// 重置数据
const restData = async () => {
  await formRef.value?.resetFields();
  contents.length = 0;
};

/**
 * 获取数据、配置
 */
const getData = (): IStepResult => {
  formRef.value?.validate(); // 校验表单
  return {
    contents,
    setting: form,
  } as IStepResult;
};

// 暴露的方法
defineExpose({ restData, getData });
</script>
<style lang="less">
.usefulRule {
  dt {
    font-weight: bold;
  }

  dd {
    margin-left: 20px;
  }

  .regList {
    dt {
      float: left;
      clear: left;
    }

    dd {
      float: left;
      margin-right: 20px;
    }
  }
}
</style>