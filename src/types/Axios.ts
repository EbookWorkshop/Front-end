import axios from 'axios';
import { HttpResponse } from './global';

// 扩展axios 变成自定义的 Axios 这个模式下使用的是直接返回的数据模式
declare module 'axios' {
  export interface Axios {
    <HttpResponse = any>(config: AxiosRequestConfig): Promise<HttpResponse>;
    request<HttpResponse = any>(
      config: AxiosRequestConfig
    ): Promise<HttpResponse>;
    get<HttpResponse = any>(
      url: string,
      config?: AxiosRequestConfig
    ): Promise<HttpResponse>;
    post<HttpResponse>(
      url: string,
      data?: any,
      config?: AxiosRequestConfig
    ): Promise<HttpResponse>;
    patch<HttpResponse>(
      url: string,
      data?: any,
      config?: AxiosRequestConfig
    ): Promise<HttpResponse>;
    put<HttpResponse = any>(
      url: string,
      data?: any,
      config?: AxiosRequestConfig
    ): Promise<HttpResponse>;
    delete<HttpResponse = any>(
      url: string,
      config?: AxiosRequestConfig
    ): Promise<HttpResponse>;
  }
}
