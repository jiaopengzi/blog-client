/**
 * @FilePath     : \blog-client\src\utils\password.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 生成随机密码
 */

export interface GeneratePasswordOptions {
    upperCaseCount?: number // 大写字母个数
    lowerCaseCount?: number // 小写字母个数
    numberCount?: number // 数字个数
    specialChar?: string // 特殊字符范围,需要手动指定
    specialCharCount?: number // 特殊字符个数
}

// 生成密码
export function generatePassword(options: GeneratePasswordOptions = {}) {
    const { upperCaseCount = 4, lowerCaseCount = 4, numberCount = 4, specialChar = '!@#$%^&*()_+{}|:"<>?', specialCharCount = 4 } = options

    const passwordLength = upperCaseCount + lowerCaseCount + numberCount + specialCharCount // 密码长度
    // 检查参数
    if (passwordLength < 6 || passwordLength > 64) {
        throw new Error("密码长度不能小于6或大于64")
    }

    /**
     * @description: 获取随机字符
     * @param length 获取字符数
     * @param asciiStart 字符开始 即ASCII码开始
     * @param asciiEnd 字符结束 即ASCII码结束
     * @return string 返回随机字符
     */
    // 定义生成随机字符函数
    const generateChars = (length: number, asciiStart: number, asciiEnd: number) => {
        let chars = ""
        for (let i = 0; i < length; i++) {
            chars += String.fromCharCode(Math.floor(Math.random() * (asciiEnd - asciiStart)) + asciiStart)
        }
        return chars
    }

    // 定义生成特殊字符函数
    const generateSpecialChars = (length: number, specialChar: string) => {
        let chars = ""
        for (let i = 0; i < length; i++) {
            chars += specialChar[Math.floor(Math.random() * specialChar.length)]
        }
        return chars
    }

    const upperCase = generateChars(upperCaseCount, 65, 90) // 大写字母 A-Z
    const lowerCase = generateChars(lowerCaseCount, 97, 122) // 小写字母 a-z
    const numbers = generateChars(numberCount, 48, 57) // 数字 0-9
    const specials = generateSpecialChars(specialCharCount, specialChar) // 随机特殊字符

    let password = upperCase + lowerCase + numbers + specials // 密码拼接

    password = password
        .split("")
        .sort(() => Math.random() - 0.5)
        .join("") // 打乱顺序

    return password
}
