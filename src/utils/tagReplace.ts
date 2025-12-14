/**
 * FilePath    : blog-client-dev\src\utils\tagReplace.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 标签替换工具
 */

// 定义不允许替换的标签(如 script、style 等可能引起安全问题的标签)
const RESTRICTED_TAGS = ["script", "style", "iframe", "frame", "object"] as const
type RestrictedTag = (typeof RESTRICTED_TAGS)[number]

/**
 * @description: 将指定标签替换为目标标签(支持任意合法标签)
 * @param htmlSrc html 源码
 * @param fromTag 源标签名
 * @param toTag 目标标签名
 * @return 替换后的 html 源码
 */
export function htmlTagReplace(htmlSrc: string, fromTag: string, toTag: string): string {
    // 输入验证
    if (!fromTag || !toTag) {
        throw new Error("源标签和目标标签不能为空")
    }

    if (fromTag === toTag) {
        throw new Error("源标签和目标标签不能相同")
    }

    // 安全检查 - 防止替换危险标签
    if (RESTRICTED_TAGS.includes(fromTag as RestrictedTag)) {
        throw new Error(`不允许替换的源标签: ${fromTag}`)
    }

    if (RESTRICTED_TAGS.includes(toTag as RestrictedTag)) {
        throw new Error(`不允许替换的目标标签: ${toTag}`)
    }

    // 验证标签格式(只允许字母、数字和连字符)
    const tagRegex = /^[a-zA-Z][a-zA-Z0-9-]*$/
    if (!tagRegex.test(fromTag) || !tagRegex.test(toTag)) {
        throw new Error("标签名格式不正确")
    }

    // 定义正则表达式进行替换
    const openingTagRegex = new RegExp(`<${fromTag}(\\s[^>]*)?>`, "g")
    const closingTagRegex = new RegExp(`</${fromTag}>`, "g")

    return htmlSrc
        .replace(openingTagRegex, (match, attributes) => {
            // 保留原有的属性, 只替换标签名
            return `<${toTag}${attributes || ""}>`
        })
        .replace(closingTagRegex, `</${toTag}>`)
}
