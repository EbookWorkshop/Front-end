<template>
  <a-spin style="display: block" :loading="loading">
    <a-tabs v-model:activeKey="messageType" type="rounded" destroy-on-hide>
      <a-tab-pane v-for="item in tabList" :key="item.key">
        <template #title>
          <span> {{ item.title }}{{ formatUnreadLength(item.key) }} </span>
        </template>
        <a-result v-if="!renderList.length" status="404">
          <template #subtitle> {{ $t('messageBox.noContent') }} </template>
        </a-result>
        <List
          :render-list="renderList"
          :unread-count="unreadCount"
          @item-click="handleItemClick"
          @all-read="handleAllRead"
        />
      </a-tab-pane>
      <template #extra>
        <a-button type="text" @click="emptyList">
          {{ $t('messageBox.tab.button') }}
        </a-button>
      </template>
    </a-tabs>
  </a-spin>
</template>

<script lang="ts" setup>
  import { ref, reactive, toRefs, computed, PropType } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { MessageRecord, MessageListType} from '@/types/Message';
  import { useMessageStore } from '@/store';

  import {
    //queryMessageList,
    setMessageStatus,
  } from '@/api/message';
  import useLoading from '@/hooks/loading';
  import List from './list.vue';

  interface TabItem {
    key: string;
    title: string;
    avatar?: string;
  }

  // 定义组件入参
  const props = defineProps({
    messageList: {
      type: Array as PropType<MessageRecord[]>,
      default: [] as MessageRecord[],
    },
  });

  // 向父组件传递信息
  const emit = defineEmits(['emptyList','allRead']);

  const { loading, setLoading } = useLoading(true);
  const messageType = ref('notice');
  const { t } = useI18n();
  const messageData = reactive<{
    renderList: MessageRecord[];
    messageList: MessageRecord[];
  }>({
    renderList: [],//点击Tab时过滤出当前的合计作为渲染内容
    messageList: [],//所有的信息合集
  });

  const messageStore = useMessageStore();

  toRefs(messageData);
  const tabList: TabItem[] = [
    {
      key: 'notice',
      title: t('messageBox.tab.title.notice'),
    },
    {
      key: 'message',
      title: t('messageBox.tab.title.message'),
    },
    {
      key: 'history',
      title: t('messageBox.tab.title.history'),
    },
  ];
  async function fetchSourceData() {
    setLoading(true);
    try {
      //console.log("加载消息列表中！！！");
      // const { data } = await queryMessageList();
      // messageData.messageList = data;

      messageData.messageList = props.messageList;

      let tempMsg = messageStore.getTopMessage();
      while(tempMsg){
        messageData.messageList.push(tempMsg);
        tempMsg = messageStore.getTopMessage();
      }
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  }
  async function readMessage(data: MessageListType) {
    const ids = data.map((item) => item.id);
    await setMessageStatus({ ids });
    fetchSourceData();
  }
  const renderList = computed(() => {
    return messageData.messageList.filter(
      (item) => messageType.value === item.type || messageType.value === 'history'
    );
  });
  const unreadCount = computed(() => {
    return renderList.value.filter((item) => !item.status).length;
  });
  const getUnreadList = (type: string) => {
    const list = messageData.messageList.filter(
      (item) => item.type === type && !item.status
    );
    return list;
  };
  const formatUnreadLength = (type: string) => {
    const list = getUnreadList(type);
    return list.length ? `(${list.length})` : ``;
  };
  const handleItemClick = (items: MessageListType) => {
    if (renderList.value.length) readMessage([...items]);
  };  
  const handleAllRead = (items: MessageListType) => {
    messageData.messageList.forEach(m=>m.status=0);
    emit('allRead');
  };

  const emptyList = () => {
    messageData.messageList = [];
    emit('emptyList');
  };
  fetchSourceData();
</script>

<style scoped lang="less">
  :deep(.arco-popover-popup-content) {
    padding: 0;
  }

  :deep(.arco-list-item-meta) {
    align-items: flex-start;
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
