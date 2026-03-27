/*
 * FilePath    : blog-client\src\utils\clipboard\copy-html.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : html复制 优先使用现代 clipboard API，如果不支持则回退到 execCommand 方式
 */

/**
 * 尝试使用现代 API 写入到系统剪贴板
 * 成功返回 Promise<void>，失败（或不支持）抛出错误
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
 * 使用 document.execCommand 的方式写入富文本 HTML 到剪贴板
 * 兼容 HTTP 环境，效果接近现代 API
 * 返回 Promise<void>，成功 resolve，失败 reject
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
            console.error("execCommand copy failed:", err)
            selection.removeAllRanges()
            document.body.removeChild(container)
            return reject(err)
        }

        // 清理
        selection.removeAllRanges()
        document.body.removeChild(container)

        if (success) {
            console.warn("Text has been copied using execCommand!")
            resolve()
        } else {
            reject(new Error("execCommand copy command was unsuccessful"))
        }
    })
}

/**
 * 对外暴露的拷贝函数：优先尝试使用现代 API，
 * 如果不支持或失败则回退到 execCommand 方式
 */
export async function copyHtml(html: string): Promise<void> {
    try {
        await tryWriteHtmlWithModernAPI(html)
        console.log("Text has been copied using navigator.clipboard!")
    } catch (err) {
        console.warn("Falling back to execCommand method, please use HTTPS or localhost or 127.0.0.1 for better clipboard support,", err)
        await writeHtmlWithExecCommand(html)
    }
}
