import axios from 'axios';
import type { HttpResponse } from '@/types/global';
import type { MessageDetail } from '@/types/Message';

/**
 * 获取消息详情
 * @param messageId 消息ID
 * @returns 
 */
export function getMessage(messageId:number) {
  return axios.get<HttpResponse<MessageDetail>>(`/services/message/?msgid=${messageId}`);
}