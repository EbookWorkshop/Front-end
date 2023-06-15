import { reactive } from 'vue';
import { io } from 'socket.io-client';

export const state = reactive({
  connected: false,
  fooEvents: [],
  barEvents: [],
});

const URL = import.meta.env.VITE_API_BASE_URL;
export const socket = io(URL);
console.log('socket 初始化');

socket.on('connect', () => {
  state.connected = true;
  console.log('已连接');
});

socket.on('disconnect', () => {
  state.connected = false;
  console.log('断开连接');
});

// socket.on("foo", (...args) => {
//   state.fooEvents.push(args);
// });

// socket.on("bar", (...args) => {
//   state.barEvents.push(args);
// });

export default function useSocket() {
  console.log('获取socket对象');
  return {
    io: socket,
  };
}
