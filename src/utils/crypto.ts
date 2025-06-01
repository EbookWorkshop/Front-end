
const SEED = "ABCDEFGHIJKLMNOPQRSTUVWXYZ.abcdefghijklmnopqrstuvwxyz0123456789+-*/:&?=,;";

interface EncryptDict {
    charMap: {
        [key: string]: number;
    };
    indexMap: {
        [key: number]: string;
    };
}

/**
 * 生成密钥映射表
 * @param key 
 * @returns 
 */
function MakeDictionary(key: string): EncryptDict[] {
    if (!/\d+/.test(key)) throw new Error('密钥格式不正确');
    const seed = SEED.split('');
    const seedseed = seed.concat(seed);
    const keyArray = key.split('').map(c => parseInt(c, 10));
    const dict: EncryptDict[] = [];

    let keyMap = new Map<number, EncryptDict>();
    keyArray.unshift(0);// 偏移量为0的是Seed的原表

    for (let i = 0; i < keyArray.length; i++) {
        const indexNum = keyArray[i];
        if (keyMap.has(indexNum)) {
            dict.push(keyMap.get(indexNum) as EncryptDict);
            continue;
        }

        let seedWithOffset = seedseed.slice(keyArray[i], keyArray[i] + seed.length);
        let tempDict = {
            charMap: {} as { [key: string]: number },
            indexMap: {} as { [key: number]: string }
        };
        for (let j = 0; j < seedWithOffset.length; j++) {
            tempDict.charMap[seedWithOffset[j]] = j;
            tempDict.indexMap[j] = seedWithOffset[j];
        }
        keyMap.set(indexNum, tempDict);
        dict.push(tempDict);
    }

    return dict;
}

/**
 * 加密URL格式的字符串
 */
export function encrypturl(data: string, key: string): string {
    const dict = MakeDictionary(key);
    const seed = dict.shift() ?? { charMap: {}, indexMap: {} };

    const tempData = data.split('');

    const result: string[] = [];

    for (let i = 0; i < tempData.length; i++) {
        const curDict = dict[i % key.length];
        const curChar = tempData[i] + "";
        let encryptIndex = curDict.charMap[curChar];

        if (encryptIndex === undefined) {
            result.push(curChar);
            continue;
        }

        result.push(seed.indexMap[encryptIndex] as string);
    }
    return result.join('');
}

/**
 * 解谜URL格式的字符串
 */
export function decrypturl(data: string, key: string): string {
    const dict = MakeDictionary(key);
    const seed = dict.shift();

    const tempData = data.split('');

    const result: string[] = [];

    for (let i = 0; i < tempData.length; i++) {
        const curDict = dict[i % key.length];
        const curChar = tempData[i];
        let encryptIndex = seed?.charMap[curChar];

        if (encryptIndex === undefined) {
            result.push(curChar);
            continue;
        }

        result.push(curDict.indexMap[encryptIndex] as string);
    }
    return result.join('');
}
