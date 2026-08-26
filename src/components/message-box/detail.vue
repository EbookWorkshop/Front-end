<template>
    <a-modal v-model:visible="detailState.state.visible" :title="modalTitle" width="auto" :footer="false" draggable
        unmount-on-close :maskClosable="false" @cancel="handleCancel">
        <!-- 使用 state.currentMessage 直接访问 -->
        <div v-if="detailState.state.currentMessage" class="message-detail">
            <div class="message-header">
                <a-space direction="vertical" fill size="large">
                    <div class="title-section">
                        <a-tag>{{ detailState.state.currentMessage.id }}</a-tag>
                        <h3 class="message-title">{{ detailState.state.currentMessage.title }}</h3>
                    </div>
                    <div>
                        <a-tag v-if="detailState.state.currentMessage.subTitle" size="small" color="arcoblue">
                            {{ detailState.state.currentMessage.subTitle }}
                        </a-tag>
                    </div>

                    <div class="meta-info">
                        <a-space>
                            <icon-clock-circle />
                            <span class="time-text">{{ detailState.state.currentMessage.time }}</span>
                            <a-divider direction="vertical" />
                            <a-tag :color="getMessageTypeColor(detailState.state.currentMessage.type)" size="small">
                                {{ getMessageTypeText(detailState.state.currentMessage.type) }}
                            </a-tag>
                        </a-space>
                    </div>
                </a-space>
            </div>

            <a-divider />
            <div class="message-content">
                <a-typography-paragraph v-for="(item, index) in showContent" :key="index">{{ item
                    }}</a-typography-paragraph>

                <div v-if="detailState.state.currentMessage.error">
                    <a-divider />
                    <InfoBlock title="错误信息" :showData="detailState.state.currentMessage.error" />
                </div>

                <div v-if="detailState.state.currentMessage.data">
                    <a-divider />
                    <InfoBlock title="其它信息" :showData="detailState.state.currentMessage.data" />
                </div>
            </div>
        </div>
        <a-empty v-else description="暂无消息内容" />

    </a-modal>
</template>
<script lang="ts" setup>
import { computed } from 'vue';
import InfoBlock from './components/InfoBlock.vue';
import { useMessageDetail } from '@/hooks/useMessageDetail';

const detailState = useMessageDetail();

const modalTitle = computed(() => {
    const msg = detailState.state.currentMessage;
    if (!msg) return '消息详情';
    return `消息详情 - ${msg.title}`;
});

const showContent = computed(() => {
    return detailState.state.currentMessage?.content?.split('\n') || [];
});

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

const handleCancel = () => { detailState.close(); };
</script>

<style scoped lang="less">
.message-detail {
    padding: 0 8px;
    width:60vw;
    min-height:60vh;

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