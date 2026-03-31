/**
 * FilePath    : blog-client\src\utils\version.ts
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
 * 构造用于从遵循 Keep a Changelog 的 CHANGELOG 中匹配版本与日期的正则
 * @param allowPrerelease - 是否允许匹配 pre-release 和 build metadata(如 -alpha、+build123)
 */
function buildChangelogRegExp(allowPrerelease: boolean): RegExp {
    const pre = allowPrerelease ? "(?:-[\\w.+]*)?(?:\\+[\\w.+]*)?" : ""
    const src = "^##\\s*\\[\\s*(v?\\d+\\.\\d+\\.\\d+" + pre + ")\\s*\\](?:\\([^)]*\\))?\\s*-\\s*(\\d{4}-\\d{2}-\\d{2})"
    return new RegExp(src, "m")
}

/**
 * 从 changelog 中提取符合指定规则的最新版本号及发布日期
 * @param changelog - changelog 内容字符串
 * @param allowPrerelease - 是否允许 pre-release/build 元数据
 */
function extractLatestWithOption(changelog: string, allowPrerelease: boolean): VersionInfo | null {
    const pattern = buildChangelogRegExp(allowPrerelease)
    const match = pattern.exec(changelog)
    if (!match) return null
    const [, version, date] = match
    if (!version || !date) return null
    return { version, date }
}

/**
 * 从遵循 Keep a Changelog 规范的 CHANGELOG 文件中提取最新的版本号及其发布日期
 * 支持 pre-release 与 build 元数据
 */
export function extractLatestDevChangelogVersionDate(changelog: string): VersionInfo | null {
    return extractLatestWithOption(changelog, true)
}

/**
 * 从遵循 Keep a Changelog 规范的 CHANGELOG 文件中提取最新的符合生产环境版本号(即 x.y.z)及其发布日期
 * 不支持 pre-release 与 build 元数据
 */
export function extractLatestProChangelogVersionDate(changelog: string): VersionInfo | null {
    return extractLatestWithOption(changelog, false)
}

/**
 * 根据当前环境从 changelog 中提取最新版本号及发布日期
 * 开发环境支持 pre-release 与 build 元数据
 * 生产环境仅支持 x.y.z 格式
 */
export function extractLatestChangelogVersionDate(changelog: string): VersionInfo | null {
    // 开发模式下
    if (import.meta.env.MODE === "development") {
        return extractLatestDevChangelogVersionDate(changelog)
    }

    // 生产模式下
    if (import.meta.env.MODE === "production") {
        return extractLatestProChangelogVersionDate(changelog)
    }

    return null
}
