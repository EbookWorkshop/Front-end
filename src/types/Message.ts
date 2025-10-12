import type { VNode } from 'vue';

export interface MessageRecord {
    id: number;
    type: "notice" | "message"; //对应：通知、消息、待办
    title: string;
    subTitle: string;
    //图标：index为数字序号，缺省则显示一个显示器
    avatar?: string | "index" | "error" | "info";
    content: string | VNode;
    time: string;
    /**
     * 0未读、1已读
     */
    status: 0 | 1;
    messageType?: number; // 在src\components\message-box\list.vue::template::#extra 中使用(未开始、已开通、进行中、即将到期)
}
export type MessageListType = MessageRecord[];