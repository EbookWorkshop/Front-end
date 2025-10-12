import { defineStore } from 'pinia';
import type { MessageRecord } from '@/types/Message';

// 定义消息Store的状态接口
export interface MessageState {
  messages: MessageRecord[];
}

// 创建消息管理Store
export const useMessageStore = defineStore('message', {
  state: (): MessageState => ({
    messages: []
  }),

  getters: {
    // 获取未读消息数量
    unreadCount: (state) => {
      return state.messages.filter((message) => !message.status).length;
    },

    // 获取所有消息
    getAllMessages: (state) => {
      return state.messages;
    }
  },

  actions: {
    // 添加新消息
    addMessage(message: MessageRecord) {
      // 确保消息有status属性
      if (typeof message.status === 'undefined') {
        message.status = 0; // 0表示未读
      }

      // 添加消息到数组开头或结尾
      this.messages.push(message);
    },

    
    //取出最上面的消息
    getTopMessage() {
      return this.messages.shift();
    },

    // 清空所有消息
    clearAllMessages() {
      this.messages = [];
    },

    // 删除特定消息
    removeMessage(messageId: string | number) {
      const index = this.messages.findIndex(msg => msg.id === messageId);
      if (index > -1) {
        this.messages.splice(index, 1);
      }
    },

  }
});

export default useMessageStore;