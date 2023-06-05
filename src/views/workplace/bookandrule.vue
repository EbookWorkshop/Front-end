<template>
  <div>
    <div class="container">
      <Breadcrumb
        :items="[
          'menu.workplace',
          'menu.workplace.correction',
          'menu.workplace.correction.bookandrule',
        ]"
      />
      <a-divider />
      <a-space>
        <a-button status="success" @click="createNewRule">添加</a-button>
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
    <a-modal
      v-model:visible="visible"
      title="添加规则引用"
      @before-ok="handleBeforeOk"
    >
      <a-form :model="form">
        <a-form-item field="book" label="书">
          <SelectBook v-model="form.bookid" />
        </a-form-item>
        <a-form-item field="name" label="校正规则">
          <a-select
            :style="{ width: '100%' }"
            size="large"
            placeholder="请选应用规则"
            :loading="ruleLoading"
            allow-search
          >
            <a-option
              v-for="r in ruleListData"
              :key="r.id"
              :value="r.id"
              :title="r.Rule"
              >{{ r.Name }}</a-option
            >
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, ref } from 'vue';
  import useRequest from '@/hooks/request';

  import {
    // api
    queryReviewRuleUsingList,
    queryReviewRuleList,
    updateReviewRule,
    deleteReviewRule,

    // type
    RuleAndBook,
    RuleListType,
  } from '@/api/workplace';
  // import { Rule } from '@/api/workplace';

  // 插件
  import SelectBook from '@/components/select-book/index.vue';
  import { Message } from '@arco-design/web-vue';

  const columns = [
    {
      title: '书名',
      dataIndex: 'bookName',
    },
    {
      title: '规则',
      dataIndex: 'ruleName',
    },
    {
      title: '操作',
      slotName: 'optional',
    },
  ];

  // 获取使用情况列表数据
  const { loading: tableLoading, response: renderData } = useRequest<
    RuleAndBook[]
  >(queryReviewRuleUsingList);
  // 获取可用规则列表
  const { loading: ruleLoading, response: ruleListData } =
    useRequest<RuleListType>(queryReviewRuleList);

  const visible = ref(false);
  const form = reactive({
    bookid: '',
    ruleid: '',
  });

  /**
   * 添加新规则
   */
  const createNewRule = () => {
    form.bookid = '';
    form.ruleid = '';
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
    form.bookid = data.bookid;
    form.ruleid = data.ruleid;
  };
</script>
