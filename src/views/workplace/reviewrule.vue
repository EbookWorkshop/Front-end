<template>
  <div class="container">
    <Breadcrumb :items="['menu.workplace', 'menu.workplace.correction']" />
    <a-divider />
    <a-space>
      <a-button @click="createNewRule">添加</a-button>
    </a-space>
    <a-table :columns="columns" :data="renderData" :loading="tableLoading">
      <template #optional="{ record }">
        <a-button @click="editRow(record)">编辑</a-button>
        <a-popconfirm
          content="确认删除？此操作将无法恢复！"
          @ok="deleteRule(record.id)"
        >
          <a-button status="danger">删除</a-button>
        </a-popconfirm>
      </template>
    </a-table>
  </div>
  <template>
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
  </template>
</template>

<script lang="ts" setup>
  import { reactive, ref } from 'vue';
  import useRequest from '@/hooks/request';
  import {
    queryReviewRuleList,
    updateReviewRule,
    deleteReviewRule,
    Rule,
  } from '@/api/workplace';
  import { Message } from '@arco-design/web-vue';

  const columns = [
    {
      title: '规则描述',
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
      title: '操作',
      slotName: 'optional',
    },
  ];
  const { loading: tableLoading, response: renderData } =
    useRequest<Rule[]>(queryReviewRuleList);

  const visible = ref(false);
  const form = reactive({
    id: '',
    name: '',
    rule: '',
    replace: '',
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
</script>
