<template>
    <a-modal v-model:visible="visible" :title="modalTitle" :width="680" :footer="false" draggable unmount-on-close
        :maskClosable="false" @cancel="handleCancel">
        <a-spin :loading="loading" style="width: 100%">
            <div v-if="messageDetail" class="message-detail">
                <!-- 消息头部信息 -->
                <div class="message-header">
                    <a-space direction="vertical" fill size="large">
                        <div class="title-section">
                            <a-tag>{{ messageDetail.message.id }}</a-tag>
                            <h3 class="message-title">{{ messageDetail.message.title }}</h3>
                            <a-tag v-if="messageDetail.message.subTitle" size="small" color="arcoblue">
                                {{ messageDetail.message.subTitle }}
                            </a-tag>
                        </div>

                        <div class="meta-info">
                            <a-space>
                                <icon-clock-circle />
                                <span class="time-text">{{ messageDetail.message.time }}</span>
                                <a-divider direction="vertical" />
                                <a-tag :color="getTypeColor(messageDetail.type)" size="small">
                                    {{ getTypeText(messageDetail.type) }}
                                </a-tag>
                                <a-divider direction="vertical" />
                                <a-tag :color="getMessageTypeColor(messageDetail.message.type)" size="small">
                                    {{ getMessageTypeText(messageDetail.message.type) }}
                                </a-tag>
                            </a-space>
                        </div>
                    </a-space>
                </div>

                <!-- 消息内容 -->
                <a-divider />
                <div class="message-content">
                    <a-typography-paragraph v-for="(item, index) in showContent" :key="index">{{ item
                    }}</a-typography-paragraph>
                    <div v-if="messageDetail.type == 'ErrorMessage'">
                        <a-divider />
                        <InfoBlock title="错误信息" :showData="messageDetail.err" />
                    </div>
                    <div v-if="messageDetail.data">
                        <a-divider />
                        <InfoBlock title="其它信息" :showData="messageDetail.data" />
                    </div>
                </div>
            </div>

            <!-- 空状态 -->
            <a-empty v-else :description="errMessage" />
        </a-spin>
    </a-modal>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue';
import { Message } from '@arco-design/web-vue';
import { ApiResultCode } from '@/types/global';
import { getMessage } from '@/api/message';
import type { MessageDetail } from '@/types/Message';
import InfoBlock from './components/InfoBlock.vue';

// Props
const props = defineProps<{
    messageId?: number;
}>();

// Emits
const emit = defineEmits<{
    (e: 'update:visible', value: boolean): void;
    (e: 'close'): void;
}>();

// 响应式数据
const visible = ref(false);
const loading = ref(false);
const messageDetail = ref<MessageDetail | null>(null);
const errMessage = ref<string>('');

// 计算属性
const modalTitle = computed(() => {
    if (messageDetail.value == null && errMessage.value.length > 0) return '获取消息详情时发生错误';
    if (!messageDetail.value) return '消息详情';
    return `消息详情 - ${messageDetail.value.message.title}`;
});

const showContent = computed(() => {
    return messageDetail.value?.message.content?.split('\n') || [];
});

// 方法
const getTypeColor = (type: string) => {
    const typeMap: Record<string, string> = {
        'ErrorMessage': 'red'
    };
    return typeMap[type] || 'gray';
};
const getTypeText = (type: string) => {
    const typeMap: Record<string, string> = {
        'ErrorMessage': '系统错误'
    };
    return typeMap[type] || type;
};

const getMessageTypeColor = (type: string) => {
    const typeMap: Record<string, string> = {
        'notice': 'orange',
        'message': 'blue',
        'history': 'gray'
    };
    return typeMap[type] || 'gray';
};
const getMessageTypeText = (type: string) => {
    const typeMap: Record<string, string> = {
        'notice': '通知',
        'message': '消息',
        'history': '历史'
    };
    return typeMap[type] || type;
};


const handleCancel = () => {
    visible.value = false;
    emit('close');
};

// 获取消息详情
const fetchMessageDetail = async (messageId: number) => {
    if (!messageId) return;

    loading.value = true;
    try {
        const response = await getMessage(messageId);
        if (response.code === ApiResultCode.Success) {
            messageDetail.value = response.data;
        } else {
            messageDetail.value = null;
            Message.error(`获取消息详情失败: ${response.data.message}`);
        }
    } catch (error: any) {
        messageDetail.value = null;
        errMessage.value = error.toString();
    } finally {
        loading.value = false;
    }
};

// 打开模态框
const open = (messageId?: number) => {
    const targetMessageId = messageId || props.messageId;
    if (targetMessageId) {
        fetchMessageDetail(targetMessageId);
    }
    visible.value = true;
};

// 关闭模态框
const close = () => {
    visible.value = false;
    messageDetail.value = null;
};

// 监听messageId变化
watch(() => props.messageId, (newId) => {
    if (newId && visible.value) {
        fetchMessageDetail(newId);
    }
});

// 暴露方法给父组件
defineExpose({
    open,
    close
});
</script>

<style scoped lang="less">
.message-detail {
    padding: 0 8px;

    .message-header {
        margin-bottom: 16px;

        .title-section {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;

            .message-title {
                margin: 0;
                font-size: 18px;
                font-weight: 600;
                color: var(--color-text-1);
                flex: 1;
            }
        }

        .meta-info {
            .time-text {
                color: var(--color-text-3);
                font-size: 14px;
            }
        }
    }

    .message-content {
        margin: 16px 0;

        :deep(.arco-typography) {
            margin-bottom: 0;
            line-height: 1.6;
            color: var(--color-text-2);
        }
    }

    .message-data {
        margin-top: 16px;

        :deep(.arco-descriptions) {
            .arco-descriptions-item-label {
                background-color: var(--color-fill-2);
                font-weight: 500;
            }
        }
    }

    .error-section {
        margin-top: 16px;
    }
}

:deep(.arco-modal) {
    .arco-modal-header {
        border-bottom: 1px solid var(--color-border-2);
        margin-bottom: 0;
    }

    .arco-modal-body {
        padding: 20px;
    }
}
</style>