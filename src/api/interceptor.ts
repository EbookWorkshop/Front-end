import axios from 'axios';
import { HttpResponse, ApiResultCode } from '@/types/global';
import type {
  InternalAxiosRequestConfig,
  AxiosRequestHeaders,
  AxiosResponse,
} from 'axios';
import { Message } from '@arco-design/web-vue';
// import { useUserStore } from '@/store';
import { getToken } from '@/utils/auth';

if (import.meta.env.VITE_API_BASE_URL) {
  axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;
}
// 请求拦截器 —— 统一加Token的逻辑
axios.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // let each request carry token
    // this example using the JWT token
    // Authorization is a custom headers key
    // please modify it according to the actual situation
    const token = getToken();
    if (token) {
      if (!config.headers) {
        config.headers = {} as AxiosRequestHeaders;
      }
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: Error) => {
    // do something
    return Promise.reject(error);
  }
);

// 返回拦截器，统一响应结果
axios.interceptors.response.use(
  (response: AxiosResponse<HttpResponse | any, any>) => {
    const res = response.data;
    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== ApiResultCode.Success) {
      Message.error({
        content: res.msg || '未知错误',
        duration: 5 * 1000,
      });
      return Promise.reject(new Error(res.msg || 'Error'));
    }
    return res;
  },
  (error: Error) => {
    // axios 抛出的错误为Error类型
    Message.error({
      content: error?.stack || error.message || '请求错误',
      duration: 5 * 1000,
    });
    return Promise.reject(error);
  }
);
