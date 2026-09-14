<template>
  <a-modal v-model:visible="innerVisible" :title="title" width="50%" draggable unmount-on-close @before-open="loadData"
    @ok="emit('confirm')">
    <!-- 添加按钮 -->
    <div style="margin-bottom: 12px;">
      <a-button type="primary" :disabled="editingIndex !== -1" @click="addNewRow">
        <template #icon><icon-plus /></template>
        添加一行
      </a-button>
      <span v-if="editingIndex !== -1" style="margin-left: 8px; color: var(--color-text-3); font-size: 12px;">
        请先保存或取消正在编辑的行
      </span>
    </div>

    <a-table :data="urlList" :pagination="false" row-key="id">
      <template #columns>
        <a-table-column title="操作" :width="200">
          <template #cell="{ rowIndex }">
            <template v-if="editingIndex === rowIndex">
              <a-button type="text" status="success" :loading="saving" @click="saveEdit(rowIndex)">保存</a-button>
              <a-button type="text" @click="cancelEdit(rowIndex)">取消</a-button>
            </template>
            <template v-else>
              <a-button type="text" @click="startEdit(rowIndex)">编辑</a-button>
              <a-popconfirm content="确认删除？此操作将无法恢复！" @ok="handleDeleteUrl(rowIndex)">
                <a-button status="danger">删除</a-button>
              </a-popconfirm>
            </template>
          </template>
        </a-table-column>

        <a-table-column title="路径">
          <template #cell="{ record, rowIndex }">
            <a-input v-if="editingIndex === rowIndex" v-model="urlList[rowIndex].Path" placeholder="请输入URL"
              style="width: 100%" />
            <span v-else>{{ record.Path }}</span>
          </template>
        </a-table-column>

        <!-- 辅助数据列 1 -->
        <a-table-column title="默认源" :width="180" v-if="columns?.includes('source')">
          <template #cell="{ record, rowIndex }">
            <a-switch :disabled="editingIndex !== rowIndex" v-model="urlList[rowIndex].Domain"></a-switch>
          </template>
        </a-table-column>

        <!-- 辅助数据列 2 -->
        <a-table-column title="类型" :width="140" v-if="columns?.includes('type')">
          <template #cell="{ record, rowIndex }">
            <a-select :disabled="editingIndex !== rowIndex" v-model="urlList[rowIndex].SourceType">
              <a-option value="index">来源页</a-option>
              <a-option value="info">信息页</a-option>
            </a-select>
          </template>
        </a-table-column>
      </template>
    </a-table>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Message } from '@arco-design/web-vue';
import { IconPlus } from '@arco-design/web-vue/es/icon';

export interface BookSource {
  id: number;
  Path: string;
  Domain?: string;
  SourceType?: string;
}

const props = withDefaults(
  defineProps<{
    visible: boolean;
    title: string;
    sourceId: number;
    columns?: string[];
    loadFn: (id: number) => Promise<{ data: BookSource[] }>;
    updateFn: (setting: any) => Promise<unknown>;
    createFn?: (setting: any) => Promise<unknown>;
    deleteFn?: (id: number) => Promise<unknown>;
  }>(),
  { createFn: undefined, deleteFn: undefined }
);

const emit = defineEmits<{
  (e: 'update:visible', v: boolean): void;
  (e: 'confirm'): void;
}>();

const innerVisible = computed({
  get: () => props.visible,
  set: (v) => emit('update:visible', v),
});

const urlList = ref<BookSource[]>([]);
const editingIndex = ref(-1);
const saving = ref(false);

// 编辑前快照，用于取消时恢复
let editSnapshot: BookSource | null = null;

async function loadData() {
  const res = await props.loadFn(props.sourceId);
  urlList.value = res.data ?? [];
  editingIndex.value = -1;
  editSnapshot = null;
}

function startEdit(index: number) {
  editSnapshot = { ...urlList.value[index] };
  if (editingIndex.value != -1) cancelEdit(editingIndex.value);
  editingIndex.value = index;
}

function cancelEdit(index: number) {
  const row = urlList.value[index];
  if (row.id === 0) {
    // 临时新增行，取消就移除
    urlList.value.splice(index, 1);
  } else if (editSnapshot) {
    // 已有行，恢复原值
    urlList.value[index] = editSnapshot;
  }
  editingIndex.value = -1;
  editSnapshot = null;
}

async function saveEdit(index: number) {
  const row = urlList.value[index];
  if (!row.Path?.trim()) {
    Message.error('路径不能为空');
    return;
  }

  saving.value = true;
  try {
    if (row.id === 0) {
      // 新增
      if (!props.createFn) {
        Message.error('未配置新增接口');
        return;
      }
      await props.createFn({ ...row });
      Message.success('添加成功');
      await loadData(); // 重新拉取，拿到后端返回的真实 id
    } else {
      // 编辑
      await props.updateFn({
        id: row.id,
        url: row.Path,
        domain: row.Domain,
        sourceType: row.SourceType,
      });
      editingIndex.value = -1;
      editSnapshot = null;
      Message.success('保存成功');
    }
  } catch (err: any) {
    Message.error(`保存失败：${err?.message || err}`);
  } finally {
    saving.value = false;
  }
}

async function handleDeleteUrl(index: number) {
  const item = urlList.value[index];
  if (props.deleteFn && item.id !== 0) {
    await props.deleteFn(item.id);
  }
  urlList.value.splice(index, 1);
}

function addNewRow() {
  if (editingIndex.value !== -1) {
    Message.warning('请先保存或取消当前编辑的行');
    return;
  }
  urlList.value.push({
    id: 0,          // id=0 作为「新增」标记
    Path: '',
    Domain: '',
    SourceType: '',
  });
  editingIndex.value = urlList.value.length - 1;
  editSnapshot = null;
}
</script>

<style lang="css" scoped>
.arco-modal-body {
  max-height: 60vh;
  overflow-y: auto;
}
</style>