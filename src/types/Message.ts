import type { VNode } from 'vue';

export interface MessageRecord {
    id: number;
    /**
     * ## "message" | "notice" | "history"; //对应：消息、通知、历史消息
     * * ### message 消息——普通消息，收到后有一个未读的消息，需要用户手动打开消息盒子查看
     * * ### notice 通知——收到一条未读通知，并通过通知信息直接显示出信息来
     * * ### history 历史消息——收到一条已读状态的信息，通常系统已通过其它渠道已通知过一次的情况
     */
    type: "notice" | "message" | "history";
    title: string;
    subTitle: string;
    //图标：index为数字序号，缺省则显示一个显示器
    avatar?: string | "index" | "error" | "info";
    content: string;
    vnodeContent?: VNode | undefined;
    time: string;
    /**
     * 0未读、1已读
     */
    status: 0 | 1;
    messageType?: number; // 在src\components\message-box\list.vue::template::#extra 中使用(未开始、已开通、进行中、即将到期)
}
export type MessageListType = MessageRecord[];

/**
 * 后台缓存的消息
 */
export interface MessageDetail {
    type: string;
    message: MessageRecord;
    err: ErrorEvent | undefined;
    data: any | undefined;
}