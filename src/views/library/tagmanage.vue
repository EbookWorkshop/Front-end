<template>
  <div>
    <div class="container">
      <Breadcrumb :items="['menu.library', 'menu.library.tagmanage']" />
      <div class="wrapper">
        <a-space>
          <a-button status="success" @click="createNewRule">添加</a-button>
        </a-space>
        <a-table :data="renderData" :loading="tableLoading">
          <template #columns>
            <a-table-column title="id" data-index="id" :width="80"></a-table-column>
            <a-table-column title="标签" data-index="Text"></a-table-column>
            <a-table-column title="颜色" data-index="Color" :width="320">
              <template #cell="{ record }">
                <a-color-picker v-if="record.Color" v-model="record.Color" :format="'hex'" showText disabled />
              </template>
            </a-table-column>
            <a-table-column title="引用次数" data-index="Count" :width="220"></a-table-column>
            <a-table-column title="操作" :width="250">
              <template #cell="{ record }">
                <a-button @click="editRow(record)">编辑</a-button>
                <a-popconfirm content="确认删除？此操作将无法恢复！" @ok="handlerDeleteTag(record.id)">
                  <a-button status="danger">删除</a-button>
                </a-popconfirm>
              </template>
            </a-table-column>
          </template>
        </a-table>
      </div>
      <a-modal v-model:visible="visible" title="标签" @before-ok="handleBeforeOk">
        <a-form :model="form">
          <input type="hidden" :value="form.id" />
          <a-form-item field="text" label="标签">
            <a-input v-model="form.text" />
          </a-form-item>
          <a-form-item field="color" label="颜色">
            <a-color-picker v-model="form.color" :format="'hex'" showText showPreset />
          </a-form-item>
        </a-form>
      </a-modal>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
import useRequest from '@/hooks/request';
import { getAllTag, updateTag, deleteTag, addTag, Tag } from '@/api/tag';
import { Message } from '@arco-design/web-vue';
import { ApiResultCode } from '@/types/global';

const { loading: tableLoading, response: renderData } = useRequest<Tag[]>(getAllTag);

const visible = ref(false);
const form = reactive({
  id: 0,
  text: '',
  color: '',
});

/**
 * 添加新规则
 */
const createNewRule = () => {
  form.id = 0;
  form.text = '';
  form.color = '';
  visible.value = true;
};
/**
 * 重新加载表格信息
 */
const TableReload = () => {
  tableLoading.value = true;
  getAllTag()
    .then((result) => {
      renderData.value = result.data;
    })
    .finally(() => {
      tableLoading.value = false;
    });
};

/**
 * 保存提交
 * @param callback 回调，true关闭窗口，false停留，关闭按钮loading
 */
const handleBeforeOk = (callback: any) => {
  if (form.id === 0) {
    addTag(form.text, form.color).then(tag => {
      callback(true);
      TableReload();
    }).catch(err => {
      callback(false);
    })
  } else {
    updateTag(form.id, form.text, form.color).then(result => {
      callback(result.code === ApiResultCode.Success);
      TableReload();
    }).catch(err => {
      callback(false);
    });
  }
};
/**
 * 删除规则
 */
const handlerDeleteTag = (id: number) => {
  deleteTag(id)
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
  form.text = data.Text;
  form.color = data.Color;
};
</script>