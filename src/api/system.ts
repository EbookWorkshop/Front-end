import axios from 'axios';

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
 * 获取邮箱配置
 * @returns
 */
export function getSMTPServer() {
  return axios.get('/services/email/account');
}
