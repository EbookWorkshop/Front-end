import axios from 'axios';

export interface MessageRecord {
  id: number;
  type: string; // message notice todo
  title: string;
  subTitle: string;
  avatar?: string;
  content: string;
  time: string;
  status: 0 | 1;
  messageType?: number; // 在src\components\message-box\list.vue::template::#extra 中使用
}
export type MessageListType = MessageRecord[];

export function queryMessageList() {
  // return axios.post<MessageListType>('/api/message/list');
  const m: MessageRecord = {
    id: 0,
    type: 'message',
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
  return axios.post<MessageListType>('/api/message/read', data);
}

export interface ChatRecord {
  id: number;
  username: string;
  content: string;
  time: string;
  isCollect: boolean;
}

export function queryChatList() {
  return axios.post<ChatRecord[]>('/api/chat/list');
}
