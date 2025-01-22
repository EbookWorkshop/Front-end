/**
 * 接口执行情况
 */
export enum ApiResultCode {
  /**
   * 执行成功
   */
  Success = 20000,
  /**
   * 服务器错误
   */
  ServerError = 50000,
  /**
   * 用户错误
   */
  UserError = 60000,
}

// 全局的接口返回格式
export interface HttpResponse<T = unknown> {
  status: number;
  msg: string;
  code: ApiResultCode | number;
  data: T;
}

// export interface APIResult<T = unknown> extends AxiosResponse<HttpResponse<T>, any> { }

export interface AnyObject {
  [key: string]: unknown;
}

export interface Options {
  value: unknown;
  label: string;
}

export interface NodeOptions extends Options {
  children?: NodeOptions[];
}

export interface GetParams {
  body: null;
  type: string;
  url: string;
}

export interface PostData {
  body: string;
  type: string;
  url: string;
}

export interface Pagination {
  current: number;
  pageSize: number;
  total?: number;
}

export type TimeRanger = [string, string];

export interface GeneralChart {
  xAxis: string[];
  data: Array<{ name: string; value: number[] }>;
}
