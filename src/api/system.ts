import axios from 'axios';

export function getSystemVersion() {
  return axios.get('/services/version');
}

/**
 * 检查站点是否可以访问
 * @param host 
 * @returns 
 */
export function checkSiteAccessibility(host: string) {
  return axios.get(`/services/checkSiteAccessibility?host=${host}`);
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

/**
 * 发邮件
 * @param {FormData} email 
 * @returns 
 */
export function sendAEMail(email:FormData) {
  // console.log("准备发送邮件:", email);
  // return new Promise(() => { });
  return axios.post('/services/email/send', email);
}


/**
 * 设备分辨率
 * 可用于设置页的尺寸，封面大小等
 */
export const resolutionOptions = [
    {
        width: 1072,
        height: 1448,
        ppi: 300,
        id: "kpw4",
        label: "Kindle Paperwhite 4",
    },
    {
        width: 1236,
        height: 1648,
        ppi: 300,
        id: "kpw5",
        label: "Kindle Paperwhite 5",
    },
]