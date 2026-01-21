import type { MessageRecord, MessageListType } from '@/types/Message';

import { reactive, readonly, inject, provide, h, type InjectionKey, type VNode } from 'vue'
import { useSocket } from '@/hooks/socket'
import router from '@/router'
import { Button } from '@arco-design/web-vue';

interface MessageService {
    messages: ReadonlyArray<MessageRecord>
    addMessage: (message: MessageRecord) => void
    markAsRead: (messageId: number) => void
    clearAll: () => void
}

const MessageServiceSymbol: InjectionKey<MessageService> = Symbol('MessageService');
let myMS: MessageService | null = null;

export function createMessageService(): MessageService {
    const { on: socketOn } = useSocket()
    const messages = reactive<MessageListType>([])

    // 注册socket消息监听
    socketOn('WebBook.UpdateChapter.Finish', ({ bookid, bookName, doneNum, failNum }) => {
        messages.push({
            id: bookid,
            type: 'notice',
            title: `《${bookName}》已完成任务。`,
            subTitle: '',
            content: `其中，成功：${doneNum}失败：${failNum}。`,
            time: new Date().toJSON().replace(/[A-Za-z]/g, ' '),
            status: 1,
            avatar: '/logo.svg?t=msg',
        })
    })

    socketOn('WebBook.Create.Finish', ({ bookid, bookName }) => {
        const buttonVNode = h(Button, {
            type: 'primary',
            status: 'success',
            size: 'small',
            onClick: () => {
                router.push({ path: `/workshop/webbook/edit/${bookid}` })
            },
        }, '前往查看') as VNode;

        messages.push({
            id: bookid,
            type: 'notice',
            title: `《${bookName}》已导入完成。`,
            content: '',
            vnodeContent: buttonVNode,
            time: new Date().toJSON().replace(/[A-Za-z]/g, ' '),
            avatar: '/logo.svg?t=msg',
            status: 1,
            subTitle: '',
        })
    })

    socketOn('Message.Box.Send', (msg: MessageRecord) => {
        if (typeof msg.status === 'undefined') msg.status = 0
        messages.push(msg)
    })

    return {
        messages: readonly(messages) as ReadonlyArray<MessageRecord>,
        addMessage: (message: MessageRecord) => messages.push(message),
        markAsRead: (messageId: number) => {
            const message = messages.find(m => m.id === messageId)
            if (message) message.status = 1
        },
        clearAll: () => messages.splice(0)
    }
}

/**
 * 内部调用，获取MessageService实例
 * @returns 
 */
export function useMessageService(): MessageService {
    const service = inject(MessageServiceSymbol)   //inject() can only be used inside setup() or functional components
    if (!service) throw new Error('MessageService not provided')
    return service
}

/**
 * 外部调用，获取MessageService实例
 * @returns 
 */
export function useMessageServiceOutsiteVue(): MessageService {
    return myMS ?? createMessageService();
}

export function provideMessageService() {
    if (myMS) return myMS;
    myMS = createMessageService();
    provide(MessageServiceSymbol, myMS);
}