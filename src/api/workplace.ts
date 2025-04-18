import axios from 'axios';
import type { ApiResultCode, HttpResponse } from "@/types/global"

/**
 * 校阅规则
 */
export interface Rule {
  id: number; // 规则id
  Name: string; // 规则名称
  Rule: string; // 校阅内容
  Replace: string; // 替换结果
}
export type RuleListType = Rule[];

/**
 * 取得所有自动校阅的规则
 * @returns
 */
export function queryReviewRuleList() {
  return axios.get('/review/rule/list');
}
/**
 * 新增或保存规则
 * @param rule
 * @returns
 */
export function updateReviewRule(rule: any) {
  return axios.post('/review/rule', rule);
}
export function deleteReviewRule(id: number) {
  return axios.delete(`/review/rule?id=${id}`);
}
/**
 * 验证一个规则
 * @param id 
 * @param chapterId 
 * @returns 
 */
export function tryARule(id: number, chapterId: number) {
  return axios.post(`/review/rule/test`, {
    "ruleId": id,
    "chapterId": chapterId,
  });
}

/**
 * 在指定书中预览规则
 * @param setting 
 * @returns 
 */
export function tryARuleOnBook(setting: any) {
  return axios.post<HttpResponse<any>>(`/review/book/try`, setting);
}
/**
 * 将校阅的设置保存到书中
 * @param setting 
 * @returns 
 */
export function saveReviewOnBook(setting: any) {
  return axios.post<HttpResponse<any>>(`/review/book/save`, setting);
}

/**
 * 每本书和规则的情况
 */
export interface RuleAndBook {
  id: number;
  bookId: number;
  bookName: string;
  ruleId: number;
  ruleName: string;
}
/**
 * 书引用规则的情况看
 * @returns
 */
export function queryReviewRuleUsingList() {
  return axios.get(`/review/bookwithrule/list`);
}
/**
 * 按图书的找使用的校阅规则
 * @returns
 */
export function queryReviewRuleOnBook(bookId: number) {
  return axios.get(`/review/bookwithrule/book?bookid=${bookId}`);
}
/**
 * 更新图书使用的校阅规则
 * @param setting
 * @returns
 */
export function updateReviewRuleForBook(setting: any) {
  return axios.post('/review/bookwithrule', setting);
}
export function deleteReviewRuleForBook(id: number) {
  return axios.delete(`/review/bookwithrule?id=${id}`);
}
