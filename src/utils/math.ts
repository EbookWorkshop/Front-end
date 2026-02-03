/**
 * 数学相关的算法工具集
 */


/**
 * 计算平均值
 * @param data 数据数组
 * @returns 平均值
 */
export function mean(data: number[]): number {
    if(data.length === 0) return 0;
    const sum = data.reduce((acc, val) => acc + val, 0);
    return sum / data.length;
}

/**
 * 计算标准差
 * @param data 数据数组
 * @param avg 可选的平均值参数，若提供则使用该值计算标准差
 * @returns 标准差
 */
export function standardDeviation(data: number[], avg?: number): number {
    const m = avg !== undefined ? avg : mean(data);
    if(data.length === 0) return 0; 
    const variance = data.reduce((acc, val) => acc + Math.pow(val - m, 2), 0) / data.length;  // 方差
    return Math.sqrt(variance);   // 标准差
}

