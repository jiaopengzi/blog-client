/*
 * FilePath    : blog-client\src\utils\amount.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 金额处理工具
 */

/** 将分转换为元
 * @param fen - 金额，单位为分
 * @param withUnit - 是否返回带单位的字符串，默认为 false
 * @return 返回元的数值或字符串
 * 如果 withUnit 为 true，则返回格式为 "xx.xx 元" 的字符串
 * 如果 withUnit 为 false，则返回数字格式
 * 如果 fen 是字符串，则直接转换为数字
 * 如果 fen 是数字，则直接转换为元
 */
export const fenToYuan = (fen: number | string, withUnit = false) => {
    let num = typeof fen === "string" ? parseFloat(fen) : fen
    if (isNaN(num)) num = 0
    const yuan = (num / 100).toFixed(2)
    return withUnit ? `${yuan} 元` : parseFloat(yuan)
}

/** 将元转换为分
 * @param yuan - 金额，支持数字或字符串，可以包含单位 “元”
 * @param isString - 是否返回字符串格式，默认为 false, 返回数字格式
 * @return 返回分的数值或字符串
 * 如果输入是字符串且包含单位“元”，则去掉单位后转换为分
 * 如果输入是字符串但不包含单位，则直接转换为分
 * 如果输入是数字，则直接转换为分
 */
export const yuanToFen = (yuan: number | string, isString = false) => {
    // 如果是字符串,判断是否有单位元
    let fen: number = 0

    if (typeof yuan === "string" && yuan.endsWith("元")) {
        yuan = yuan.slice(0, -1).trim() // 去掉单位
        fen = Math.round(parseFloat(yuan) * 100) // 将元转换为分
    }
    if (typeof yuan === "string" && !yuan.endsWith("元")) {
        yuan = yuan.trim() // 去掉单位
        fen = Math.round(parseFloat(yuan) * 100) // 将元转换为分
    }

    if (typeof yuan === "number") {
        fen = yuan * 100 // 将元转换为分
    }

    return isString ? fen.toString() : fen
}
