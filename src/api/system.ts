import axios from 'axios';


export function getSystemVersion() {
  return axios.get('/services/version');
}

/**
 * 保存发邮箱信息
 * @param email 发邮件用邮箱地址
 * @param password 邮箱密码/身份识别码
 */
export function saveSMTPServer(email: string, password: string) {
  return axios.post(`/services/email/account`, {
    address: email,
    password,
  });
}

/**
 * 获取发件邮箱配置
 * @returns
 */
export function getSMTPServer() {
  return axios.get('/services/email/account');
}

/**
 * 获取收件邮箱配置
 * @returns
 */
export function getKindleInbox() {
  return axios.get('/services/email/inbox');
}
/**
 * 获取收件邮箱配置
 * @param address kindle 收件地址
 * @returns
 */
export function saveKindleInbox(address: string) {
  return axios.post('/services/email/inbox', { address });
}
