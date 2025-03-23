import axios from 'axios';

export interface MessageRecord {
  id: number;
  type: "notice" | "message" | "todo"; //对应：通知、消息、待办
  title: string;
  subTitle: string;
  avatar?: string;//头像地址
  content: string;
  time: string;
  /**
   * 0未读、1已读
   */
  status: 0 | 1;
  messageType?: number; // 在src\components\message-box\list.vue::template::#extra 中使用(未开始、已开通、进行中、即将到期)
}
export type MessageListType = MessageRecord[];

export function queryMessageList() {
  // return axios.post<MessageListType>('/api/message/list');
  const m: MessageRecord = {
    id: 0,
    type: 'notice',
    title: 'Kindle中国服务将于今年6月30日关闭！',
    subTitle: '',
    content: '如题',
    time: '2023年6月5日',
    status: 0,
  };

  return { data: [m] };
}

interface MessageStatus {
  ids: number[];
}

export function setMessageStatus(data: MessageStatus) {
  // return axios.post<MessageListType>('/api/message/read', data);
  return { data: true };
}

// export interface ChatRecord {
//   id: number;
//   username: string;
//   content: string;
//   time: string;
//   isCollect: boolean;
// }

// export function queryChatList() {
//   // return axios.post<ChatRecord[]>('/api/chat/list');
//   let c: ChatRecord = {
//     id: 1,
//     username: "Admin",
//     content: "这是一个对话",
//     time: new Date().toJSON(),
//     isCollect: false
//   }
//   return { data: [c] };
// }
