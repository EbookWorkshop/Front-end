// 爬网站机器人规则配置
import axios from 'axios';

/**
 * 一条规则
 */
export interface Rule {
  host: string; // "wanben.org",
  ruleName: string; // "Content",
  selector: string; // ".readerCon",
  type: string; // "Object",
  getContentAction: string; // "attr/innerText",
  getUrlAction?: string; // null,
  checkSetting?: string; // null
}

/**
 * 拿到已登记的网站列表
 * @returns
 */
export function queryHostList() {
  return axios.get(`/services/botrule/hostlist`);
}

export function queryHostSetting(host: string) {
  return axios.get(`/services/botrule?host=${host}`);
}
export function deleteHostSetting(host: string) {
  return axios.delete(`/services/botrule?host=${host}`);
}

/**
 * 保存配置
 * @param rules
 * @returns
 */
export function saveHostSetting(rules: object[]) {
  return axios.post(`/services/botrule`, rules);
}

/**
 * 预览规则配置
 * @param url 预览用地址
 * @param rule 预览用规则配置
 * @returns
 */
export function visRuleSetting(url: string, rule: Rule) {
  return axios.post('/services/botrule/vis', { testUrl: url, ...rule });
}
/**
 * 获取导出规则的下载地址
 * @param host 需要导出的站点规则
 * @returns
 */
export function exportSecheme(host: string) {
  // return axios.get(`/services/botrule/export?host=${host}`);
  return `${axios.defaults.baseURL}/services/botrule/export?host=${host}`;
}
