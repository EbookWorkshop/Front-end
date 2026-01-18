import { reactive, readonly } from 'vue';
import { io, Socket } from 'socket.io-client';
import { getApiBaseUrl } from '@/utils/config';

// 类型定义
interface SocketState {
  connected: boolean;
  reconnecting: boolean;
  error?: string;
  lastActivity?: Date;
}

interface SocketEventMap {
  'WebBook.UpdateChapter.Finish': {
    bookid: number;
    bookName: string;
    doneNum: number;
    failNum: number;
  };
  'WebBook.Create.Finish': {
    bookid: number;
    bookName: string;
  };
  'Message.Box.Send': any;
  [key: string]: any;
}

interface SocketEvent<T extends keyof SocketEventMap> {
  (data: SocketEventMap[T]): void;
} 

// Socket服务类 - 单例模式
class SocketService {
  private static instance: SocketService;
  private socket: Socket | null = null;
  public state = reactive<SocketState>({
    connected: false,
    reconnecting: false,
  });

  private eventListeners: Map<string, SocketEvent<any>[]> = new Map();
  private url: string;

  private constructor() {
    this.url = getApiBaseUrl();
  }

  static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  /**
   * 获取Socket实例，如果不存在则创建
   */
  getSocket(): Socket {
    if (!this.socket) {
      this.socket = io(this.url, {
        transports: ['websocket'],
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        timeout: 10000,
      });

      this.setupEventListeners();
    }
    
    if (!this.socket.connected) {
      this.socket.connect();
    }
    
    return this.socket;
  }

  /**
   * 设置事件监听器
   */
  private setupEventListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('Socket连接成功');
      this.state.connected = true;
      this.state.reconnecting = false;
      this.state.error = undefined;
      this.state.lastActivity = new Date();
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Socket断开连接:', reason);
      this.state.connected = false;
      this.state.error = reason;
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket连接错误:', error);
      this.state.connected = false;
      this.state.error = error.message;
    });

    this.socket.on('reconnecting', (attempt) => {
      console.log(`Socket重连中，尝试次数: ${attempt}`);
      this.state.reconnecting = true;
    });

    this.socket.on('reconnect', (attempt) => {
      console.log(`Socket重连成功，尝试次数: ${attempt}`);
      this.state.connected = true;
      this.state.reconnecting = false;
      this.state.error = undefined;
    });

    this.socket.on('reconnect_failed', () => {
      console.error('Socket重连失败');
      this.state.reconnecting = false;
      this.state.error = '重连失败';
    });
  }

  /**
   * 注册事件监听器
   */
  on<T extends keyof SocketEventMap>(event: T, callback: (data: SocketEventMap[T]) => void): void {
    if (!this.socket) return;
    
    this.socket.on(event as string, callback);
    
    // 保存监听器引用用于清理
    if (!this.eventListeners.has(event as string)) {
      this.eventListeners.set(event as string, []);
    }
    this.eventListeners.get(event as string)!.push(callback);
  }

  /**
   * 移除事件监听器
   */
  off<T extends keyof SocketEventMap>(event: T, callback?: (data: SocketEventMap[T]) => void): void {
    if (!this.socket) return;
    
    if (callback) {
      this.socket.off(event as string, callback);
      const callbacks = this.eventListeners.get(event as string) || [];
      const index = callbacks.indexOf(callback);
      if (index > -1) callbacks.splice(index, 1);
    } else {
      this.socket.off(event as string);
      this.eventListeners.delete(event as string);
    }
  }

  /**
   * 发送消息
   */
  emit<T extends keyof SocketEventMap>(event: T, data: SocketEventMap[T]): void {
    if (!this.socket || !this.state.connected) {
      console.warn('Socket未连接，无法发送消息');
      return;
    }
    
    this.socket.emit(event as string, data);
    this.state.lastActivity = new Date();
  }

  /**
   * 断开连接
   */
  disconnect(): void {
    if (this.socket) {
      // 清理所有事件监听器
      this.eventListeners.forEach((callbacks, event) => {
        callbacks.forEach(callback => {
          this.socket!.off(event, callback);
        });
      });
      this.eventListeners.clear();
      
      this.socket.disconnect();
      this.socket = null;
      this.state.connected = false;
      this.state.reconnecting = false;
      this.state.error = '手动断开连接';
    }
  }

  /**
   * 获取只读的socket状态
   */
  getSocketState() {
    return readonly(this.state);
  }
}

// 创建单例实例
const socketService = SocketService.getInstance();

/**
 * 使用Socket的Hook函数
 * 返回Socket实例和状态
 */
export function useSocket() {
  const socket = socketService.getSocket();
  
  return {
    io: socket,
    state: socketService.getSocketState(),
    on: socketService.on.bind(socketService),
    off: socketService.off.bind(socketService),
    emit: socketService.emit.bind(socketService),
    disconnect: socketService.disconnect.bind(socketService),
  };
}

/**
 * 直接导出Socket服务实例（用于特殊场景）
 */
export const socket = socketService;