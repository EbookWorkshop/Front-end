import type { MessageRecord, MessageListType } from '@/types/Message';
import { reactive, readonly, h, computed, type VNode, type ComputedRef } from 'vue';
import { useSocket } from '@/hooks/socket';
import router from '@/router';
import { Button } from '@arco-design/web-vue';

// ========== 服务类定义 ==========
class MessageService {
    private _messages = reactive<MessageListType>([]);
    private _isInitialized = false;

    // 构造函数中初始化 Socket 监听（只执行一次）
    constructor() {
        this.initSocketListeners();
    }

    // 获取消息列表（只读）
    get messages(): ReadonlyArray<MessageRecord> {
        return readonly(this._messages) as unknown as ReadonlyArray<MessageRecord>;
    }

    // 添加消息
    addMessage(message: MessageRecord) {
        if (typeof message.status === 'undefined') message.status = 0;
        this._messages.push(message);
    }

    // 标记为已读
    markAsRead(messageId: number) {
        const message = this._messages.find(m => m.id === messageId);
        if (message) {
            message.status = 1;
        }
    }

    markAllRead() {
        this._messages.forEach(m => m.status = 1);
    }

    // 清空所有消息
    clearAll() {
        this._messages.splice(0);
    }

    get unreadCount(): ComputedRef<number> {
        return computed(() => this._messages.filter(m => m.status === 0).length);
    }

    // 按类型过滤消息
    getMessagesByType(type?: string): MessageRecord[] {
        if (!type || type === 'history') {
            return [...this._messages];
        }
        return this._messages.filter(m => m.type === type);
    }

    // 初始化 Socket 监听（只执行一次）
    private initSocketListeners() {
        if (this._isInitialized) return;
        this._isInitialized = true;

        const { on: socketOn } = useSocket();

        socketOn('WebBook.UpdateChapter.Finish', ({ bookid, bookName, doneNum, failNum }) => {
            this._messages.push({
                id: Date.now() * -1,
                type: 'notice',
                title: `《${bookName}》已完成任务。`,
                subTitle: '',
                content: `其中，成功：${doneNum}失败：${failNum}。`,
                time: new Date().toLocaleString(),
                status: 1,
                avatar: '/logo.svg?t=msg',
            });
        });

        socketOn('WebBook.Create.Finish', ({ bookid, bookName }) => {
            const buttonVNode = h(Button, {
                type: 'primary',
                status: 'success',
                size: 'small',
                onClick: () => {
                    router.push({ path: `/workshop/webbook/edit/${bookid}` });
                },
            }, '前往查看') as VNode;

            this._messages.push({
                id: Date.now() * -1,
                type: 'notice',
                title: `《${bookName}》已导入完成。`,
                content: '',
                vnodeContent: buttonVNode,
                time: new Date().toLocaleString(),
                avatar: '/logo.svg?t=msg',
                status: 1,
                subTitle: '',
            });
        });

        socketOn('Message.Box.Send', (msg: MessageRecord) => {
            this.addMessage(msg);
        });
    }
}

// ========== 导出单例 ==========
export const messageService = reactive(new MessageService());
