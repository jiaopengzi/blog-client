/**
 * FilePath    : blog-client\src\utils\uploadFileName.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 上传文件命名通用工具
 */

/**
 * createUploadFileNameRegexCache 创建上传文件命名清洗所需的正则缓存.
 * 这里抽离 avatar 与 post-upsert 共享的规则, 避免不同上传入口各自维护同一套字符清洗逻辑.
 * @returns 文件名清洗正则缓存.
 */
function createUploadFileNameRegexCache(): {
    invalidFileNameRegex: RegExp
    whitespaceRegex: RegExp
    multipleDashRegex: RegExp
    edgeDashRegex: RegExp
} {
    return {
        invalidFileNameRegex: /[\\/:*?"<>|]/g,
        whitespaceRegex: /\s+/g,
        multipleDashRegex: /-{2,}/g,
        edgeDashRegex: /^-|-$/g,
    }
}

const regexCache = createUploadFileNameRegexCache()

/**
 * sanitizeFileNameSegment 清理文件名片段中的非法字符, 并在结果为空时使用回退值.
 * @param value 原始片段内容.
 * @param fallback 清理后为空时使用的默认片段.
 * @returns 可安全用于文件名的片段.
 */
export function sanitizeFileNameSegment(value: string, fallback: string): string {
    const normalizedValue = value
        .trim()
        .replace(regexCache.invalidFileNameRegex, "-")
        .replace(regexCache.whitespaceRegex, "-")
        .replace(regexCache.multipleDashRegex, "-")
        .replace(regexCache.edgeDashRegex, "")

    return normalizedValue || fallback
}

/**
 * renameFilePreservingMetadata 仅替换上传文件名称, 其余元信息保持不变.
 * @param file 原始上传文件.
 * @param fileName 目标文件名.
 * @param fallbackType 当原文件缺失 MIME 时使用的回退类型.
 * @returns 已替换名称的新文件对象.
 */
export function renameFilePreservingMetadata(file: File, fileName: string, fallbackType: string = "image/png"): File {
    return new File([file], fileName, {
        type: file.type || fallbackType,
        lastModified: file.lastModified,
    })
}
