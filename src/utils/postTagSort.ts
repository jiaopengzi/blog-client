/**
 * FilePath    : blog-client\src\utils\postTagSort.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 文章标签排序工具
 */

import { type PostTag } from "@/api/postTag/view"

export type PostTagCountKey = "post_count" | "post_count_admin"

const englishTagNameCollator = new Intl.Collator(["en"], {
    numeric: true,
    sensitivity: "base",
})

const chineseTagNameCollator = new Intl.Collator(["zh-Hans-CN-u-co-pinyin", "zh-Hans-CN", "zh-CN"], {
    numeric: true,
    sensitivity: "base",
})

const fallbackTagNameCollator = new Intl.Collator(["en", "zh-Hans-CN", "zh-CN"], {
    numeric: true,
    sensitivity: "base",
})

/**
 * 将字符串形式的数量安全转换为数字.
 * @param value - 接口返回的数量字段.
 * @returns 可用于排序比较的数字值, 非法输入回退为 0.
 */
function toSafeCount(value: string): number {
    const count = Number(value)
    return Number.isFinite(count) ? count : 0
}

/**
 * 获取标签名称的排序分组.
 * @param name - 标签名称.
 * @returns 分组值, 数字越小排序越靠前.
 */
function getTagNameSortGroup(name: string): number {
    const firstChar = name.trim().charAt(0)

    if (!firstChar) {
        return 2
    }

    if (/[A-Za-z]/.test(firstChar)) {
        return 0
    }

    if (/[\u3400-\u4DBF\u4E00-\u9FFF]/.test(firstChar)) {
        return 1
    }

    return 2
}

/**
 * 比较两个标签名称, 保证英文排在中文前面, 中文按拼音排序.
 * @param leftName - 左侧标签名称.
 * @param rightName - 右侧标签名称.
 * @returns 名称排序结果, 升序时负数表示左侧应排在前面.
 */
export function comparePostTagName(leftName: string, rightName: string): number {
    const leftGroup = getTagNameSortGroup(leftName)
    const rightGroup = getTagNameSortGroup(rightName)

    if (leftGroup !== rightGroup) {
        return leftGroup - rightGroup
    }

    if (leftGroup === 0) {
        return englishTagNameCollator.compare(leftName, rightName)
    }

    if (leftGroup === 1) {
        return chineseTagNameCollator.compare(leftName, rightName)
    }

    return fallbackTagNameCollator.compare(leftName, rightName)
}

/**
 * 按指定数量字段对标签列表排序.
 * @param tags - 待排序的标签列表.
 * @param countKey - 排序使用的数量字段.
 * @returns 新的排序结果, 不修改原始数组.
 */
export function sortPostTagsByCount(tags: PostTag[], countKey: PostTagCountKey): PostTag[] {
    const sortedTags: PostTag[] = []

    for (const tag of tags) {
        const currentCount = toSafeCount(tag[countKey])
        const insertIndex = sortedTags.findIndex((item) => {
            const itemCount = toSafeCount(item[countKey])

            if (itemCount !== currentCount) {
                return itemCount < currentCount
            }

            return comparePostTagName(item.name, tag.name) > 0
        })

        if (insertIndex === -1) {
            sortedTags.push(tag)
            continue
        }

        sortedTags.splice(insertIndex, 0, tag)
    }

    return sortedTags
}
