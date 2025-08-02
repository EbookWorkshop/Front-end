<template>
  <div>
    <div class="container">
      <Breadcrumb :items="[
        'menu.workplace',
        'menu.workplace.correction',
        'menu.workplace.correction.reviewrule',
      ]" />
      <div class="wrapper">
        <a-space>
          <a-button status="success" @click="createNewRule">添加</a-button>
        </a-space>
        <a-table :columns="columns" :data="renderData" :loading="tableLoading" :pagination="{ pageSize: 20 }">
          <template #rulename-filter="{ filterValue, setFilterValue, handleFilterConfirm, handleFilterReset }">
            <a-card hoverable :style="{ width: '320px' }" title="规则名称-筛选">
              <a-form-item>
                <a-input-search v-model="filterValue[0]" placeholder="输入筛选内容" @search="handleFilterConfirm"
                  @change="(value: any) => { setFilterValue([value]); handleFilterConfirm() }" />
                <a-button @click="handleFilterReset">重置</a-button>
              </a-form-item>
            </a-card>
          </template>
          <template #rule-filter="{ filterValue, setFilterValue, handleFilterConfirm, handleFilterReset }">
            <a-card hoverable :style="{ width: '320px' }" title="规则-筛选">
              <a-form-item>
                <a-input-search v-model="filterValue[0]" placeholder="输入筛选内容" @search="handleFilterConfirm"
                  @change="(value: any) => { setFilterValue([value]); handleFilterConfirm() }" />
                <a-button @click="handleFilterReset">重置</a-button>
              </a-form-item>
            </a-card>
          </template>

          <template #replace-filter="{ filterValue, setFilterValue, handleFilterConfirm, handleFilterReset }">
            <a-card hoverable :style="{ width: '320px' }" title="替换内容-筛选">
              <a-form-item>
                <a-select v-model="filterValue[0]" allow-clear placeholder="请选择筛选内容" allow-search
                  @change="(value: string) => { setFilterValue([value]); handleFilterConfirm() }">
                  <a-option v-for="item of uniqueRenderData" :value="item" :label="item" />
                </a-select>
                <a-button @click="handleFilterReset">重置</a-button>
              </a-form-item>
            </a-card>
          </template>
          <template #optional="{ record }">
            <a-button @click="editRow(record)">编辑</a-button>
            <a-button @click="testRule(record)">验证</a-button>
            <a-popconfirm content="确认删除？此操作将无法恢复！" @ok="deleteRule(record.id)">
              <a-button status="danger">删除</a-button>
            </a-popconfirm>
          </template>
        </a-table>
      </div>
      <a-modal v-model:visible="visible" title="设置规则" @before-ok="handleBeforeOk" draggable unmount-on-close>
        <a-form :model="form" ref="formRef" :rules="formRules">
          <input type="hidden" :value="form.id" />
          <a-form-item field="name" label="规则名" :rules="[{ required: true, message: '规则名必须填写' }]">
            <a-input v-model="form.name" />
          </a-form-item>
          <a-form-item field="rule" label="查找内容" :rules="[{ required: true, message: '查找内容不能为空' }]">
            <a-textarea v-model="form.rule"></a-textarea>
          </a-form-item>
          <a-form-item field="replace" label="替换内容">
            <a-textarea v-model="form.replace"></a-textarea>
          </a-form-item>
          <a-form-item field="bookId" label="同时应用到">
            <SelectBook v-model="form.bookId" :is-multiple="true" />
          </a-form-item>
        </a-form>
      </a-modal>

      <a-modal v-model:visible="isTest" title="验证规则" @before-ok="handleTestRule">
        <a-form :model="testForm">
          <a-form-item field="book" label="书">
            <SelectBook v-model="testForm.bookId"
              @change="queryBookById(testForm.bookId).then((result: any) => { Chapters = result.data.Index.filter((i: any) => i.IsHasContent) })" />
          </a-form-item>
          <a-form-item field="chapter" label="章节">
            <a-select v-model="testForm.chapterId as number" :options="Chapters"
              :field-names="{ value: 'IndexId', label: 'Title' }" :virtual-list-props="{ height: 200 }" allow-search />
          </a-form-item>
          <a-form-item field="name" label="校正规则">
            {{ testForm.ruleName }}
          </a-form-item>
          <a-form-item field="rule" label="规则">
            {{ testForm.regexp }}
          </a-form-item>
        </a-form>
      </a-modal>

      <a-modal :visible="testResult" fullscreen title="验证结果" unmount-on-close :footer="false"
        @cancel="testResult = false">
        <Diff mode="split" :theme="theme" language="text" :left="diffLeft" :right="diffRight"
          style="height: 100%; width: 100%; overflow: scroll" />
      </a-modal>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, computed, h } from 'vue';
import useRequest from '@/hooks/request';
import { queryBookById, } from '@/api/book';
import {
  queryReviewRuleList,
  updateReviewRule,
  deleteReviewRule,
  Rule,
  tryARule,
} from '@/api/workplace';
import type { TableColumnData } from '@arco-design/web-vue';
import { Message } from '@arco-design/web-vue';
import SelectBook from '@/components/select-book/index.vue';
import Diff from '@/components/diff/index.vue'
import { useAppStore } from '@/store';

import { IconSearch } from '@arco-design/web-vue/es/icon';

import { FormInstance } from '@arco-design/web-vue';
const formRef = ref<FormInstance>();
const formRules = {
  name: [{ required: true, message: '规则名必须填写' }],
  rule: [{ required: true, message: '查找内容不能为空' }],
};


const appStore = useAppStore();
const theme = computed<any>(() => {
  return appStore.theme;
});

const columns = [
  {
    title: '规则名称',
    dataIndex: 'Name',
    filterable: {
      filter: (value: string, record: Rule) => record.Name.includes(value),
      slotName: 'rulename-filter',
      icon: () => h(IconSearch),
    },
  },
  {
    title: '规则',
    dataIndex: 'Rule',
    filterable: {
      filter: (value: string, record: Rule) => record.Rule.includes(value),
      slotName: 'rule-filter',
      icon: () => h(IconSearch),
    },
  },
  {
    title: '替换内容',
    dataIndex: 'Replace',
    filterable: {
      filter: (value: string, record: Rule) => record.Replace.includes(value),
      slotName: 'replace-filter',
      icon: () => h(IconSearch),
    },
  },
  {
    title: '已用次数',
    dataIndex: 'Count',
    align: "center"
  },
  {
    title: '操作',
    slotName: 'optional',
    width: 250,
    align: 'center',
  },
] as TableColumnData[];
const { loading: tableLoading, response: renderData } =
  useRequest<Rule[]>(queryReviewRuleList);

const Chapters = ref([]);
const visible = ref(false);
const isTest = ref(false);
const testResult = ref(false);
const form = reactive({
  id: '',
  name: '',
  rule: '',
  replace: '',
  bookId: [] as number[],
});
const testForm = reactive({
  bookId: 0 as number,
  chapterId: null as null | number,
  ruleId: null as number | null,
  ruleName: '',
  regexp: '',
});

const diffLeft = ref("");
const diffRight = ref("");


/**
 * 添加新规则
 */
const createNewRule = () => {
  form.id = '';
  form.name = '';
  form.rule = '';
  form.replace = '';
  form.bookId = [];
  visible.value = true;
};
/**
 * 重新加载表格信息
 */
const TableReload = () => {
  tableLoading.value = true;
  queryReviewRuleList()
    .then((result) => {
      renderData.value = result.data;
    })
    .finally(() => {
      tableLoading.value = false;
    });
};

// 计算去重后的数据
const uniqueRenderData = computed(() => {
  const mySet = new Set() as Set<string>;
  renderData.value.forEach(item => {
    mySet.add(item.Replace);
  });
  return mySet;
});


/**
 * 保存提交
 */
const handleBeforeOk = async (callback: any) => {
  let result = await formRef.value?.validate();
  if (result) { //校验不通过
    callback(false);
    return;
  }
  updateReviewRule(form)
    .then(() => {
      callback(true);
      TableReload();
    })
    .catch((err) => {
      Message.error(`保存失败：${err}`);
      callback(false);
    });
};
/**
 * 删除规则
 */
const deleteRule = (id: number) => {
  deleteReviewRule(id)
    .then(() => {
      TableReload();
    })
    .catch((err) => {
      Message.error(`删除失败：${err}`);
    });
};

const editRow = (data: any) => {
  visible.value = true;
  form.id = data.id;
  form.name = data.Name;
  form.rule = data.Rule;
  form.replace = data.Replace;
};

/**
 * 测试规则
 * @param data
 */
const testRule = (data: any) => {
  isTest.value = true;
  testForm.ruleId = data.id;
  testForm.bookId = data.BookId;
  testForm.chapterId = null;
  testForm.ruleName = data.Name;
  testForm.regexp = data.Rule;
  Chapters.value = [];
};
const handleTestRule = (callback: any) => {
  tryARule(testForm.ruleId ?? 0, testForm.chapterId ?? 0).then((tryRsl: any) => {
    let { source, result } = tryRsl.data;
    callback(true);
    diffLeft.value = source;
    diffRight.value = result;
    testResult.value = true;
  }).catch(err => callback(false));

};
</script>
