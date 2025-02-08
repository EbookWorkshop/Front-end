<template>
  <div>
    <div class="container">
      <Breadcrumb
        :items="[
          'menu.workplace',
          'menu.workplace.correction',
          'menu.workplace.correction.reviewrule',
        ]"
      />
      <div class="wrapper">
        <a-space>
          <a-button status="success" @click="createNewRule">添加</a-button>
        </a-space>
        <a-table :columns="columns" :data="renderData" :loading="tableLoading">
          <template #optional="{ record }">
            <a-button @click="editRow(record)">编辑</a-button>
            <a-button @click="testRule(record)">验证</a-button>
            <a-popconfirm
              content="确认删除？此操作将无法恢复！"
              @ok="deleteRule(record.id)"
            >
              <a-button status="danger">删除</a-button>
            </a-popconfirm>
          </template>
        </a-table>
      </div>
      <a-modal
        v-model:visible="visible"
        title="设置规则"
        @before-ok="handleBeforeOk"
      >
        <a-form :model="form">
          <input type="hidden" :value="form.id" />
          <a-form-item field="name" label="规则名">
            <a-input v-model="form.name" />
          </a-form-item>
          <a-form-item field="rule" label="查找内容">
            <a-textarea v-model="form.rule"></a-textarea>
          </a-form-item>
          <a-form-item field="replace" label="替换内容">
            <a-textarea v-model="form.replace"></a-textarea>
          </a-form-item>
        </a-form>
      </a-modal>

      <a-modal v-model:visible="isTest" title="验证规则" @before-ok="handleTestRule">
        <a-form :model="testForm">
          <a-form-item field="book" label="书">
            <SelectBook v-model="testForm.bookId" @change="queryBookById(testForm.bookId).then((result)=>{Chapters = result.data.Index})"/>
          </a-form-item>
          <a-form-item field="chapter" label="章节">
            <a-select v-model="testForm.chapterId" :options="Chapters" :field-names="{ value: 'IndexId', label: 'Title' }"
                    :virtual-list-props="{ height: 200 }" allow-search/>
          </a-form-item>
          <a-form-item field="name" label="校正规则">
            {{ testForm.ruleName }}
          </a-form-item>
          <a-form-item field="rule" label="规则">
            {{ testForm.regexp }}
          </a-form-item>
        </a-form>
      </a-modal>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, ref } from 'vue';
  import useRequest from '@/hooks/request';
  import { queryBookById, } from '@/api/book';
  import {
    queryReviewRuleList,
    updateReviewRule,
    deleteReviewRule,
    Rule,
  } from '@/api/workplace';
  import type { TableColumnData } from '@arco-design/web-vue';
  import { Message } from '@arco-design/web-vue';
  import SelectBook from '@/components/select-book/index.vue';
import { number } from 'echarts';

  const columns = [
    {
      title: '规则名称',
      dataIndex: 'Name',
    },
    {
      title: '规则',
      dataIndex: 'Rule',
    },
    {
      title: '替换内容',
      dataIndex: 'Replace',
    },
    {
      title: '已用次数',
      dataIndex: 'Count',
      align:"center"
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
  const form = reactive({
    id: '',
    name: '',
    rule: '',
    replace: '',
  });
  const testForm = reactive({
    bookId: 0 as number,
    chapterId: '' as string | number,
    ruleId: '',
    ruleName: '',
    regexp: '',
  });
  /**
   * 添加新规则
   */
  const createNewRule = () => {
    form.id = '';
    form.name = '';
    form.rule = '';
    form.replace = '';
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

  /**
   * 保存提交
   */
  const handleBeforeOk = (callback: any) => {
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
    testForm.bookId = data.BookId;
    testForm.chapterId = '';
    testForm.ruleName = data.Name;
    testForm.regexp = data.Rule;
    Chapters.value=[];
    console.log(data);
  };
  const handleTestRule = (callback: any) => {
    callback(true);
    isTest.value = false;
  };
</script>
