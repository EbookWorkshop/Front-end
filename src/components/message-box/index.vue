<template>
  <a-tabs v-model:activeKey="messageType" type="rounded" destroy-on-hide class="message-box">
    <a-tab-pane v-for="item in tabList" :key="item.key">
      <template #title>
        <span>{{ item.title }}{{ formatUnreadLength(item.key) }}</span>
      </template>
      <a-result v-if="!renderList.length" status="404">
        <template #subtitle>{{ $t('messageBox.noContent') }}</template>
      </a-result>
      <List :render-list="renderList" :unread-count="messageService.unreadCount" @click="handleItemClick" @all-read="handleAllRead" />
    </a-tab-pane>
    <template #extra>
      <a-button type="text" @click="emptyList">
        {{ $t('messageBox.tab.button') }}
      </a-button>
    </template>
  </a-tabs>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import type { MessageRecord } from '@/types/Message';
import { messageService } from '@/services/messageService';
import { useMessageDetail } from '@/hooks/useMessageDetail';
import List from './list.vue';

interface TabItem {
  key: string;
  title: string;
  avatar?: string;
}

const { t } = useI18n();
const messageType = ref('notice');
const detailState = useMessageDetail();

const tabList: TabItem[] = [
  { key: 'notice', title: t('messageBox.tab.title.notice') },
  { key: 'message', title: t('messageBox.tab.title.message') },
  { key: 'history', title: t('messageBox.tab.title.history') },
];

const renderList = computed(() => {
  const messages = messageService.messages;
  if (messageType.value === 'history') {
    return [...messages].reverse();
  }
  return messages.filter(m => m.type === messageType.value).reverse();
});

// 格式化 Tab 上的未读数量
const formatUnreadLength = (type: string) => {
  const list = messageService.messages.filter(m => m.type === type && !m.status);
  return list.length ? `(${list.length})` : '';
};

const handleItemClick = (item: MessageRecord) => {
  if (!item.status) messageService.markAsRead(item.id);
  detailState.open(item);
};

const handleAllRead = () => messageService.markAllRead();
const emptyList = () => messageService.clearAll();
</script>

<style scoped lang="less">
.message-box {
  max-width: 100vw;
  background-color: var(--color-bg-2);
  box-shadow: 0 2px 8px #00000026;
  border-radius: 4px;
}

:deep(.arco-tabs-nav) {
  padding: 14px 0 12px 16px;
  border-bottom: 1px solid var(--color-neutral-3);
}

:deep(.arco-tabs-content) {
  padding-top: 0;

  .arco-result-subtitle {
    color: rgb(var(--gray-6));
  }
}
</style>