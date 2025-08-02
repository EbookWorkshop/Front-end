
interface EncryptDict {
    charMap: {
        [key: string]: number;
    };
    indexMap: {
        [key: number]: string;
    };
}

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ.abcdefghijklmnopqrstuvwxyz0123456789+-*/:&?=,;";
const alphabetArray = ALPHABET.split('');
const extendedAlphabet = alphabetArray.concat(alphabetArray);
const ALPHABET_MAP = new Map<number, EncryptDict>();//预生成对照表
for (let i = 0; i < 10; i++) {
    let shiftedAlphabet = extendedAlphabet.slice(i, i + alphabetArray.length);
    let mappingTable = {
        charMap: {} as { [key: string]: number },
        indexMap: [] as string[]
    };
    for (let j = 0; j < shiftedAlphabet.length; j++) {
        mappingTable.charMap[shiftedAlphabet[j]] = j;
        mappingTable.indexMap[j] = shiftedAlphabet[j];
    }
    ALPHABET_MAP.set(i, mappingTable);
}

/**
 * 生成密钥映射表
 * @param key 
 * @returns 
 */
function generateDictionary(key: string): EncryptDict[] {
    if (!/^\d+$/.test(key)) throw new Error('密钥格式不正确');

    const keyDigits = key.split('').map(c => parseInt(c, 10));
    const dict: EncryptDict[] = [];

    keyDigits.unshift(0);// 偏移量为0的是Seed的原表

    for (let i = 0; i < keyDigits.length; i++) {
        const digit = keyDigits[i];
        if (ALPHABET_MAP.has(digit)) {
            dict.push(ALPHABET_MAP.get(digit) as EncryptDict);
            continue;
        }
        throw new Error(`密钥中包含无效数字: ${digit}`);
    }
    return dict;
}

/**
 * 简易文本加密
 * 用多重动态密码表方式进行文本替换加密
 */
export function easyEncrypt(plaintext: string, encryptionKey: string): string {
    const encryptionTables = generateDictionary(encryptionKey);
    const seedTable = encryptionTables.shift() ?? { charMap: {}, indexMap: {} };

    const plaintextChars = plaintext.split('');
    const ciphertext: string[] = [];

    for (let i = 0; i < plaintextChars.length; i++) {
        const currentTable = encryptionTables[i % encryptionKey.length];
        const currentChar = plaintextChars[i];
        const encryptedIndex = currentTable.charMap[currentChar];

        if (encryptedIndex === undefined) {
            ciphertext.push(currentChar);
            continue;
        }

        ciphertext.push(seedTable.indexMap[encryptedIndex] as string);
    }
    return ciphertext.join('');
}

/**
 * 简易文本解密
 * 用多重动态密码表方式进行文本替换解密
 */
export function easyDecrypt(ciphertext: string, encryptionKey: string): string {
    const decryptionTables = generateDictionary(encryptionKey);
    const seedTable = decryptionTables.shift();

    const ciphertextChars = ciphertext.split('');
    const decryptedText: string[] = [];

    for (let i = 0; i < ciphertextChars.length; i++) {
        const currentTable = decryptionTables[i % encryptionKey.length];
        const currentChar = ciphertextChars[i];
        const decryptedIndex = seedTable?.charMap[currentChar];

        if (decryptedIndex === undefined) {
            decryptedText.push(currentChar);
            continue;
        }

        decryptedText.push(currentTable.indexMap[decryptedIndex] as string);
    }
    return decryptedText.join('');
}