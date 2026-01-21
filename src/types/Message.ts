import type { VNode } from 'vue';

export interface MessageRecord {
    /**
     * ## 消息ID
     * * ### 前端生成的错误消息记得设置id为-1，因为后端无法获取详情
     */
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
    /**
     * ## 消息图标
     * * ### string 自定义图片作图标，提供图片地址
     * * ### index 数字序号图标，在消息列表上的当前排序数
     * * ### error 错误图标
     * * ### info 信息图标
     * * ### 缺省 显示一个显示器图标
     */
    avatar?: string | "index" | "error" | "info";
    content: string;
    vnodeContent?: VNode | undefined;
    time: string;
    /**
     * 0未读、1已读
     */
    status: 0 | 1;
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