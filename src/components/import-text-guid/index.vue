<template>
  <a-modal :visible="myVisible" fullscreen cancel-text="退出" unmount-on-close :footer="false" @cancel="handleCancel">
    <template #title> 导入向导 </template>
    <a-alert v-if="bookId !== -1" type="warning">注意：当前导入的内容将追加到原有书籍《{{ bookName }}》中{{ volumeId ?
      `，在卷“${volumeTitle}”的最后。`
      : '' }}</a-alert>
    <a-spin :loading="loading" style="width: 100%">
      <a-card class="general-card">
        <div class="wrapper" style="margin-bottom: 90px;">
          <a-steps v-model:current="step" style="width: 100%" class="steps">
            <a-step description="选择文件">{{ $t('workshop.import.file') }}</a-step>
            <a-step description="设置分割规则">{{ $t('workshop.import.split') }}</a-step>
            <a-step description="检查章节分割情况">章节预览</a-step>
            <a-step :description="bookId === -1 ? '完善书籍信息并保存' : ``">{{ $t('common.save') }}</a-step>
          </a-steps>
          <keep-alive>
            <Step1 v-if="step == 1" :status="fileStatus" @set-file="onSetFile" />
            <Step2 v-else-if="step == 2" ref="Step2Ref" :files="fileList" />
            <Step3 v-else-if="step == 3" ref="Step3Ref" />
            <Step4 v-else-if="step == 4 && bookId == -1" ref="Step4Ref"
              :book-name="fileList[0]?.name?.replace(/\.\w+$/, '')" />
            <div v-else-if="step == 4 && bookId !== -1">
              <a-result class="result" status="success"
                :title="`即将导入到《${bookName}》${volumeId ? `，卷“${volumeTitle}”之内` : ''}。`"
                :subtitle="`已成功分割出 ${chapterList.length} 个章节，点击‘上一步’可返回查看详细章节列表。`">
                <template #extra>
                  只差一步！点击下方的保存按钮，将结果提交到数据库。
                </template>
              </a-result>
            </div>
            <a-result v-else status="warning" title="出错了">
              <template #subtitle>
                出现未知错误，返回重试
              </template>

              <template #extra>
                <a-space>
                  <a-button type='primary'>返回</a-button>
                </a-space>
              </template>
            </a-result>
          </keep-alive>
        </div>
      </a-card>
      <a-result :status="null" style="position: fixed; bottom: 80px">
        <template #extra>
          <a-row :gutter="8">
            <a-col :span="3" :offset="9">
              <a-button type="primary" long @click="changeStep(-1)">上一步</a-button>
            </a-col>
            <a-col :span="3">
              <a-button v-if="step < 4" type="primary" long @click="changeStep(1)">下一步</a-button>
              <a-button v-if="step == 4" type="primary" status="success" long @click="handleSubmit">{{ $t('common.save')
              }}</a-button>
            </a-col>
          </a-row>
        </template>
      </a-result>
    </a-spin>
  </a-modal>
</template>

<script lang="ts" setup>
import { ref, reactive, PropType } from 'vue';
import { FileItem, Message } from '@arco-design/web-vue';
import useLoading from '@/hooks/loading';
import { addABook, addToBook } from '@/api/library';
import Step1 from './import-text-step1.vue';
import Step2 from './import-text-step2.vue';
import Step3 from './import-text-step3.vue';
import Step4 from './import-text-step4.vue';
import { IStepResult } from './utils';

const { loading, setLoading } = useLoading(false);

//参数定义
const props = defineProps({
  bookId: {
    type: Number as PropType<number | undefined>,
    default: -1
  },
  bookName: {
    type: String,
    default: ''
  },
  volumeId: {
    type: Number as PropType<number | undefined>,
    default: -1
  },
  volumeTitle: {
    type: String,
    default: ''
  }
})

// 变量定义
const myVisible = ref(false);
const step = ref(1); // 当前所在步骤
const fileStatus = ref<
  'normal' | 'error' | 'success' | 'warning' | 'info' | undefined
>(undefined);
const fileList = reactive<FileItem[]>([]);
const Step2Ref = ref<InstanceType<typeof Step2> | null>(null);
const Step3Ref = ref<InstanceType<typeof Step3> | null>(null);
const Step4Ref = ref(null) as any;

// 章节信息
let chapterList = [] as any[];
let fileData = "";//文件内容-第一个文件的原始内容-用于第四步提取作者

const emit = defineEmits(["reload"]);

// 设置文件-文件列表变更时
const onSetFile = (files: FileItem[]) => {
  fileList.length = 0;
  fileList.push(...files);
  fileStatus.value = files.length > 0 ? undefined : 'error';
};

// 取消、关闭窗口
const handleCancel = () => {
  myVisible.value = false;
};

// 上一步、下一步切换函数
const changeStep = (direction: number) => {
  if (fileList?.length === 0 && direction > 0) {
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
    case 2: // 将文件列表解释，并放在预览框里
      setTimeout(() => { Step2Ref.value?.restData(); }, 100);
      break;
    case 3:
      {
        const data = Step2Ref?.value?.getData();
        fileData = data?.contents[0]?.txt ?? "";
        if (data?.setting.encoderType === '') {
          step.value -= 1;
          return;
        }
        setTimeout(() => { Step3Ref.value?.initData(data as IStepResult); }, 100);
      }
      break;
    case 4:
      chapterList = Step3Ref.value?.getData() as any[];
      setTimeout(() => { Step4Ref.value?.init(fileData); }, 100);
      break;
    default:
      break;
  }
};

/**
 * 提交、保存到数据库
 */
const handleSubmit = async () => {
  setLoading(true);

  if (props.bookId === -1) {
    const data = await Step4Ref.value?.submit();
    const bookData = {
      ...data,
      chapterList,
      type: 'txt',
    };

    await addABook(bookData)
      .then((rsl) => {
        Message.success('已添加到书库中！');
        myVisible.value = false;
      })
      .finally(() => {
        setLoading(false);
      });
  } else {
    await addToBook({
      bookId: props.bookId,
      volumeId: props.volumeId,
      chapterList: chapterList.map(({ IndexId, ...rest }) => rest),
    }).then((rsl) => {
      console.log(rsl);
      Message.success(`已追加${chapterList.length}章到《${props.bookName}》中！`);
      myVisible.value = false;
      emit('reload');
    }).finally(() => {
      setLoading(false);
    });
  }


};

/**
 * 打开模窗
 */
const showMe = () => {
  myVisible.value = true;
};

defineExpose({ show: showMe });
</script>
