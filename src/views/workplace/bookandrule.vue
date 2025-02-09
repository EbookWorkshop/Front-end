<template>
  <div>
    <div class="container">
      <Breadcrumb :items="[
        'menu.workplace',
        'menu.workplace.correction',
        'menu.workplace.correction.bookandrule',
      ]" />
      <div class="wrapper">
        <a-space>
          <a-button status="success" @click="createNewRule">添加</a-button>
        </a-space>
        <a-table :columns="columns" :data="renderData" :loading="tableLoading">
          <template #name-filter="{
            filterValue,
            setFilterValue,
            handleFilterConfirm,
            handleFilterReset,
          }">
            <a-card hoverable :style="{ width: '320px', marginBottom: '20px' }" title="筛选">
              <a-form-item>
                <a-select v-model="filterValue[0]" allow-clear placeholder="请选择书名"
                  @change="(value) => { setFilterValue([value]); handleFilterConfirm() }">
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
      <a-modal v-model:visible="visible" title="添加规则引用" @before-ok="handleBeforeOk">
        <a-form :model="form">
          <a-form-item field="book" label="书">
            <SelectBook v-model="form.bookId" />
          </a-form-item>
          <a-form-item field="name" label="校正规则">
            <a-select v-model="form.ruleId" :style="{ width: '100%' }" size="large" placeholder="请选校阅规则"
              :loading="ruleLoading" allow-search>
              <a-option v-for="r in ruleListData" :key="r.id" :value="r.id" :title="r.Rule">{{ r.Name }}</a-option>
            </a-select>
          </a-form-item>
        </a-form>
      </a-modal>
      <a-modal v-model:visible="isTest" title="验证规则" @before-ok="handleTestRule">
        <a-form :model="testForm">
          <a-form-item field="book" label="书">
            {{ testForm.bookName }}
          </a-form-item>
          <a-form-item field="chapter" label="章节">
            <a-select v-model="testForm.chapterId" :options="Chapters"
              :field-names="{ value: 'IndexId', label: 'Title' }" :virtual-list-props="{ height: 200 }" allow-search />
          </a-form-item>
          <a-form-item field="name" label="校正规则">
            {{ testForm.ruleName }}
          </a-form-item>
        </a-form>
      </a-modal>
      <a-modal :visible="testResult" fullscreen title="验证结果" unmount-on-close :footer="false"
        @cancel="testResult = false">
        <Diff mode="split" theme="light" language="text" :prev="diffLeft" :current="diffRight"
          style="height: 100%; width: 100%; overflow: scroll" />
      </a-modal>
    </div>
  </div>
</template>

<script lang="ts" setup>
import "vue-diff/dist/index.css";
import { reactive, ref, h, computed } from 'vue';
import { IconSearch } from '@arco-design/web-vue/es/icon';

import useRequest from '@/hooks/request';
import type { TableColumnData } from '@arco-design/web-vue';

import { queryBookById, } from '@/api/book';
import {
  // api
  queryReviewRuleUsingList,
  queryReviewRuleList,
  updateReviewRuleForBook,
  deleteReviewRuleForBook,
  tryARule,

  // type
  RuleAndBook,
  RuleListType,
} from '@/api/workplace';

// 插件
import SelectBook from '@/components/select-book/index.vue';
import { Message } from '@arco-design/web-vue';

const columns = [
  {
    title: '书名',
    dataIndex: 'bookName',
    filterable: {
      filter: (value: string, record: RuleAndBook) =>
        record.bookName.includes(value),
      slotName: 'name-filter',
      icon: () => h(IconSearch),
    },
  },
  {
    title: '规则',
    dataIndex: 'ruleName',
  },
  {
    title: '操作',
    slotName: 'optional',
    width: 250,
    align: 'center',
  },
] as TableColumnData[];

// 获取使用情况列表数据
const { loading: tableLoading, response: renderData } = useRequest<RuleAndBook[]>(queryReviewRuleUsingList);

// 计算去重后的数据
const uniqueRenderData = computed(() => {
  const mySet = new Set() as Set<string>;
  renderData.value.forEach(item => {
    mySet.add(item.bookName);
  });
  return mySet;
});

// 获取可用规则列表
const { loading: ruleLoading, response: ruleListData } = useRequest<RuleListType>(queryReviewRuleList);

const visible = ref(false);
const isTest = ref(false);
const testResult = ref(false);
const Chapters = ref([]);
const form = reactive({
  bookId: '',
  ruleId: 0,
});
const testForm = reactive({
  bookName: '',
  bookId: '',
  chapterId: null as number | null,
  ruleId: 0,
  ruleName: '',
  regexp: '',
});
const diffLeft = ref("");
const diffRight = ref("");

/**
 * 添加新规则
 */
const createNewRule = () => {
  form.bookId = '';
  form.ruleId = 0;
  visible.value = true;
};
/**
 * 重新加载表格信息
 */
const TableReload = () => {
  tableLoading.value = true;
  queryReviewRuleUsingList()
    .then((result) => {
      renderData.value = result.data;
    })
    .finally(() => {
      tableLoading.value = false;
    });
};

/**
 * 保存提交
 */
const handleBeforeOk = (callback: any) => {
  updateReviewRuleForBook(form)
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
  deleteReviewRuleForBook(id)
    .then(() => {
      TableReload();
    })
    .catch((err) => {
      Message.error(`删除失败：${err}`);
    });
};
/**
 * 修改规则
 * @param data
 */
const editRow = (data: any) => {
  visible.value = true;
  form.bookId = data.bookId;
  form.ruleId = data.ruleId;
};

/**
 * 测试规则
 * @param data
 */
const testRule = (data: any) => {
  isTest.value = true;
  testForm.bookName = data.bookName;
  testForm.bookId = data.bookId;
  testForm.ruleName = data.ruleName;
  testForm.ruleId = data.ruleId;
  queryBookById(data.bookId).then((rsl: any) => {
    Chapters.value = rsl.data.Index;
  });
};

const handleTestRule = (callback: any) => {
  tryARule(testForm.ruleId, testForm.chapterId ?? -1).then((tryRsl: any) => {
    let { source, result } = tryRsl.data;
    callback(true);
    diffLeft.value = source;
    diffRight.value = result;
    testResult.value = true;
  }).catch(err => callback(false));
};
</script>
<style lang="less">
.vue-diff-viewer {
  background-color: var(--color-bg-4);

  .hljs {
    color: var(--color-text-2);
  }
}
</style>