/**
 * 文件大小转换
 * @param fileSize 原始文件大小，默认大小
 * @returns 
 */
export function formatFileSize(fileSize: number, defUnit: "B" | "KB" | "MB" | "GB" | "TB" = "B") {
    let size = defUnit as string;
    let units = ["KB", "MB", "GB", "TB"];
    units = units.slice(units.indexOf(size) + 1);

    while (fileSize > 1024 && units.length >= 1) {
        fileSize /= 1024;
        size = units.shift() || "Unknow";
    }

    return {
        fileSize: fileSize,
        unit: size,
        toString: () => {
            return `${fileSize.toFixed(2)}${size}`
        }
    };
}

/**
 * 将数字转换为中文数字，最大值支持一万亿
 * @param num 数字如:2923
 * @returns 中文数字如:二千九百二十三
 */
export function numberToChinese(num: number) {
    const ChineseNum = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
    const ChineseUnit = ['', '十', '百', '千', '万', '十', '百', '千', '亿', '十', '百', '千'];

    if (num === 0) return ChineseNum[0];
    if (num < 10) return ChineseNum[num];
    if (num === 10) return '十';
    if (num < 20) return '十' + ChineseNum[num % 10];

    let result = '';
    let unitIndex = 0;
    let tempNum = num;

    while (tempNum > 0) {
        const digit = tempNum % 10;
        if (digit !== 0) {
            result = ChineseNum[digit] + ChineseUnit[unitIndex] + result;
        } else if (digit === 0 && (ChineseUnit[unitIndex] === '万' || ChineseUnit[unitIndex] === '亿')) {
            result = ChineseUnit[unitIndex] + result;
        } else if (result && result[0] !== ChineseNum[0]) {
            result = ChineseNum[digit] + result;
        }
        tempNum = Math.floor(tempNum / 10);
        unitIndex++;
    }

    //打补丁
    result = result.replace(/^一十/g, '十').replace(/零万/g, '万');
    return result;
};