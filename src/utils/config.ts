// 检测是否是IP地址格式
const isIP = (hostname: string) => /^(\d+\.){3}\d+$/.test(hostname);
const isLocalhost = (hostname: string) => hostname.includes("localhost");


// 获取API基础地址（兼容SSR环境）
export const getApiBaseUrl = () => {
  if (typeof window === 'undefined') return import.meta.env.VITE_API_BASE_URL;

  const currentHost = window.location.hostname;
  return isLocalhost(currentHost)
    ? import.meta.env.VITE_API_BASE_URL
    : `http://${currentHost}:${new URL(import.meta.env.VITE_API_BASE_URL).port}`;
};
