/**
 * FilePath    : blog-client-dev\src\utils\version.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 版本相关
 */

export interface VersionInfo {
    version: string // 版本号
    date: string // 发布日期 YYYY-MM-DD
}

/**
 * 从遵循 Keep a Changelog 规范的 CHANGELOG 文件中提取最新的版本号及其发布日期
 * @param changelog - changelog 内容字符串
 * @returns 返回一个包含对象, 包含 version 和 date 字符串；如果未找到匹配项则返回 null
 */
export function extractLatestChangelogVersionDate(changelog: string): VersionInfo | null {
    // 匹配形如：## [1.0.0-alpha+123](...) - 2024-06-01
    // 支持带或不带 v 前缀，支持 pre-release 和 build 元数据（如 -alpha、+build123）
    const pattern = /^##\s*\[\s*(v?\d+\.\d+\.\d+(?:-[\w.+]*)?(?:\+[\w.+]*)?)\s*\](?:\([^)]*\))?\s*-\s*(\d{4}-\d{2}-\d{2})/gm

    const match = pattern.exec(changelog)
    if (match) {
        const version = match[1] // 提取版本号
        const date = match[2] // YYYY-MM-DD

        // 校验是否成功提取
        if (!version || !date) {
            return null
        }

        return { version, date }
    }

    return null
}
