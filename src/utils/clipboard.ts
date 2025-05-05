/*
 * FilePath    : blog-client\src\utils\clipboard.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 优先使用现代 clipboard API，如果不支持则回退到 clipboard.js
 */

import ClipboardJS from "clipboard"

/**
 * 尝试使用现代 API 写入到系统剪贴板
 * 成功返回 Promise<void>，失败（或不支持）抛出错误
 */
async function tryWriteTextWithModernAPI(text: string): Promise<void> {
    if (typeof navigator !== "undefined" && navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text)
    } else {
        throw new Error("Modern clipboard API not supported")
    }
}

/**
 * 使用 clipboard.js 的方式写入到系统剪贴板
 * 由于 clipboard.js 的 API 是基于事件触发，这里采用一个临时按钮触发的方式
 */
function writeTextWithClipboardJS(text: string): void {
    // 创建一个隐藏的按钮
    const tempButton = document.createElement("button")
    tempButton.style.display = "none"
    tempButton.setAttribute("data-clipboard-text", text)

    // 将按钮暂时加到页面中
    document.body.appendChild(tempButton)

    // 实例化 clipboard.js
    const clipboard = new ClipboardJS(tempButton)

    // 手动触发点击，并在事件结束后清理
    tempButton.click()
    clipboard.destroy()
    document.body.removeChild(tempButton)
}

/**
 * 对外暴露的拷贝函数：优先尝试使用现代 API，
 * 如果不支持或失败则回退到 clipboard.js
 */
export async function copyText(text: string): Promise<void> {
    try {
        await tryWriteTextWithModernAPI(text)
        console.info("Text has been copied using navigator.clipboard!")
    } catch (err) {
        console.warn("Falling back to clipboard.js: ", err)
        writeTextWithClipboardJS(text)
    }
}
