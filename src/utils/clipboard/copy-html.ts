/*
 * FilePath    : blog-client\src\utils\clipboard\copy-html.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : html复制 优先使用现代 clipboard API，如果不支持则回退到 execCommand 方式
 */

export interface CopyHtmlResult {
    method: "modern" | "execCommand"
}

/**
 * 尝试使用现代 API 写入到系统剪贴板.
 * 成功返回 Promise<void>, 失败(或不支持)抛出错误.
 * @param html 待写入剪贴板的富文本 HTML.
 * @returns 写入完成后的 Promise.
 */
async function tryWriteHtmlWithModernAPI(html: string): Promise<void> {
    if (typeof navigator !== "undefined" && navigator.clipboard && navigator.clipboard.write) {
        const blob = new Blob([html], { type: "text/html" })
        const clipboardItem = new ClipboardItem({ "text/html": blob })
        await navigator.clipboard.write([clipboardItem])
    } else {
        throw new Error("Modern clipboard API not supported")
    }
}

/**
 * 使用 document.execCommand 的方式写入富文本 HTML 到剪贴板.
 * 兼容 HTTP 环境, 但最终粘贴效果取决于浏览器对富文本的降级支持.
 * @param html 待写入剪贴板的富文本 HTML.
 * @returns 成功 resolve, 失败 reject 的 Promise.
 */
function writeHtmlWithExecCommand(html: string): Promise<void> {
    return new Promise((resolve, reject) => {
        // 创建临时容器
        const container = document.createElement("div")
        container.style.position = "absolute"
        container.style.left = "-9999px"
        container.innerHTML = html
        document.body.appendChild(container)

        // 选中容器内的 HTML
        const selection = window.getSelection()
        if (!selection) {
            document.body.removeChild(container)
            return reject(new Error("Unable to get window selection"))
        }
        const range = document.createRange()
        range.selectNodeContents(container)
        selection.removeAllRanges()
        selection.addRange(range)

        let success = false
        try {
            success = document.execCommand("copy")
        } catch (err) {
            selection.removeAllRanges()
            document.body.removeChild(container)
            return reject(err)
        }

        // 清理
        selection.removeAllRanges()
        document.body.removeChild(container)

        if (success) {
            resolve()
        } else {
            reject(new Error("execCommand copy command was unsuccessful"))
        }
    })
}

/**
 * copyHtml 优先尝试使用现代 Clipboard API, 失败后回退到 execCommand.
 * @param html 待写入剪贴板的富文本 HTML.
 * @returns 当前实际使用的复制方式, 供调用方决定是否提示兼容模式.
 */
export async function copyHtml(html: string): Promise<CopyHtmlResult> {
    try {
        await tryWriteHtmlWithModernAPI(html)
        return { method: "modern" }
    } catch {
        await writeHtmlWithExecCommand(html)
        return { method: "execCommand" }
    }
}
