import { reactive } from 'vue';
import { io } from 'socket.io-client';
const URL = import.meta.env.VITE_API_BASE_URL;

export const state = reactive({
  connected: false,
});

const socket = io(URL);
// const connectedCallback=null;
// const disconnectedCallback=null;

console.log('socket 初始化');

socket.on('connect', () => {
  state.connected = true;
  // console.log('已连接');
});

socket.on('disconnect', () => {
  state.connected = false;
  // console.log('断开连接');
});

/**
 * 获取通用的 Socket 连接
 * # 注意：Socket 的监听是全局的，不同页面注册的监听器都会汇总到一起
 * @returns 
 */
export function useSocket() {
  if (!socket.connected) socket.connect();

  return {
    io: socket,
  };
}

export function getSocketState() {
  return state;
}
