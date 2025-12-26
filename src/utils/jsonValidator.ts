/**
 * FilePath    : blog-client-dev\src\utils\jsonValidator.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : json 校验器
 */

// JSON 校验结果接口
export interface JSONValidationResult {
    isValid: boolean
    errors: string[]
}

/**
 * @description: 验证 JSON 字符串的合法性
 * @param text JSON 字符串
 * @return 是否合法
 */
export function isValidJSON(text: string): JSONValidationResult {
    const result: JSONValidationResult = { isValid: true, errors: [] }

    // 检查是否为字符串
    if (typeof text !== "string") {
        result.isValid = false
        result.errors.push("JSON 必须为字符串。")
        return result
    }

    // 可以为空视为合法
    if (text.trim() === "") return result

    try {
        JSON.parse(text)
    } catch (e) {
        result.isValid = false
        if (e instanceof SyntaxError) {
            result.errors.push(`JSON 语法错误: ${e.message}`)
        } else {
            result.errors.push(`未知错误: ${e}`)
        }
    }

    return result
}
