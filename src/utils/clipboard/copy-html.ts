/*
 * FilePath    : blog-client\src\utils\clipboard\copy-html.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : html复制 优先使用现代 clipboard API，如果不支持则回退到 clipboard.js
 */

import ClipboardJS, { type Options } from "clipboard"

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
 * 使用 clipboard.js 的方式写入到系统剪贴板
 * 由于 clipboard.js 的 API 是基于事件触发, 采用一个临时按钮触发的方式
 */
function writeHtmlWithClipboardJS(html: string): void {
    // 创建一个隐藏的按钮触发复制
    const tempButton = document.createElement("button")
    tempButton.style.display = "none"

    // 设置复制的文本
    const options: Options = {
        action: () => {
            return "copy"
        },
        text: () => {
            return html
        },
    }

    // 将按钮暂时加到页面中
    document.body.appendChild(tempButton)

    // 实例化 clipboard.js
    const clipboard = new ClipboardJS(tempButton, options)

    // 手动触发点击，并在事件结束后清理
    tempButton.click()
    clipboard.destroy()
    document.body.removeChild(tempButton)
}

/**
 * 对外暴露的拷贝函数：优先尝试使用现代 API，
 * 如果不支持或失败则回退到 clipboard.js
 */
export async function copyHtml(html: string): Promise<void> {
    try {
        await tryWriteHtmlWithModernAPI(html)
        console.log("Text has been copied using navigator.clipboard!")
    } catch (err) {
        console.log("Falling back to clipboard.js: ", err)
        writeHtmlWithClipboardJS(html)
    }
}
