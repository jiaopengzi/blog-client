/*
 * FilePath    : blog-client\src\components\editor\export\index.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 编辑器 Markdown 单文件导出入口及浏览器下载资源生命周期.
 */

export { buildMarkdownExport, normalizeExportTitle } from "./markdown"

/**
 * downloadExport 下载生成的文件, 延迟释放 URL 以兼容浏览器异步接管下载.
 * @param blob - 完整文件内容.
 * @param name - 安全的下载文件名.
 * @returns 无返回值; 浏览器下载能力不可用时抛错.
 */
export function downloadExport(blob: Blob, name: string): void {
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement("a")
    anchor.href = url
    anchor.download = name
    document.body.append(anchor)
    try {
        anchor.click()
    } finally {
        anchor.remove()
        setTimeout(() => URL.revokeObjectURL(url), 30_000)
    }
}
