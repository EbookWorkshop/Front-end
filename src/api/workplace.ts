import axios from 'axios';

export interface Rule {
  id: number;
  Name: string;
  Rule: string;
}

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
