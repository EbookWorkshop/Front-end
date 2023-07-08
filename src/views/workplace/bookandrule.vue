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
      <div class="wrapper">
        <a-space>
          <a-button status="success" @click="createNewRule">添加</a-button>
        </a-space>
        <a-table :columns="columns" :data="renderData" :loading="tableLoading">
          <template
            #name-filter="{
              filterValue,
              setFilterValue,
              handleFilterConfirm,
              handleFilterReset,
            }"
          >
            <a-card hoverable :style="{ width: '320px', marginBottom: '20px' }">
              <a-input
                :model-value="filterValue[0]"
                size="large"
                @input="(value) => setFilterValue([value])"
              />
              <template #actions>
                <a-button @click="handleFilterConfirm">确定</a-button>
                <a-button @click="handleFilterReset">重置</a-button>
              </template>
            </a-card>
          </template>
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
            <SelectBook v-model="form.bookId" />
          </a-form-item>
          <a-form-item field="name" label="校正规则">
            <a-select
              v-model="form.ruleId"
              :style="{ width: '100%' }"
              size="large"
              placeholder="请选校阅规则"
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
  </div>
</template>

<script lang="ts" setup>
  import { reactive, ref, h } from 'vue';
  import { IconSearch } from '@arco-design/web-vue/es/icon';
  import useRequest from '@/hooks/request';

  import {
    // api
    queryReviewRuleUsingList,
    queryReviewRuleList,
    updateReviewRuleForBook,
    deleteReviewRuleForBook,

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
    },
  ] as any[];

  // 获取使用情况列表数据
  const { loading: tableLoading, response: renderData } = useRequest<
    RuleAndBook[]
  >(queryReviewRuleUsingList);
  // 获取可用规则列表
  const { loading: ruleLoading, response: ruleListData } =
    useRequest<RuleListType>(queryReviewRuleList);

  const visible = ref(false);
  const form = reactive({
    bookId: '',
    ruleId: '',
  });

  /**
   * 添加新规则
   */
  const createNewRule = () => {
    form.bookId = '';
    form.ruleId = '';
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
</script>
