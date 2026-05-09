/*
 * FilePath    : blog-client\src\utils\clipboard\copy-text.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 文字复制 优先使用现代 clipboard API，如果不支持则回退到 execCommand 方式
 */

export interface CopyTextOptions {
    restoreFocusElement?: HTMLElement | null
}

/**
 * getRestorableActiveElement 获取当前可恢复焦点的活动元素.
 * execCommand fallback 会临时把焦点切到隐藏 textarea, 结束后需要恢复给原元素.
 * @returns 可恢复焦点的 HTMLElement, 不存在时返回 null.
 */
function getRestorableActiveElement(): HTMLElement | null {
    if (typeof document === "undefined") {
        return null
    }

    const activeElement = document.activeElement

    if (!(activeElement instanceof HTMLElement)) {
        return null
    }

    return typeof activeElement.focus === "function" ? activeElement : null
}

/**
 * restoreElementFocus 将焦点恢复到指定元素.
 * @param element - 需要恢复焦点的元素.
 * @returns 无返回值.
 */
function restoreElementFocus(element: HTMLElement | null): void {
    if (!element?.isConnected) {
        return
    }

    element.focus()
}

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
 * 使用 document.execCommand 的方式写入纯文本到剪贴板
 * 兼容 HTTP 环境，效果接近现代 API
 * 返回 Promise<void>，成功 resolve，失败 reject
 */
function writeTextWithExecCommand(text: string, options?: CopyTextOptions): Promise<void> {
    return new Promise((resolve, reject) => {
        const previousActiveElement = options?.restoreFocusElement ?? getRestorableActiveElement()

        // 创建临时文本域
        const textArea = document.createElement("textarea")
        textArea.value = text
        // 定位到屏幕外
        textArea.style.position = "fixed"
        textArea.style.left = "-9999px"
        textArea.style.top = "-9999px"
        document.body.appendChild(textArea)

        // 选中文本
        textArea.focus()
        textArea.select()

        let success = false
        try {
            success = document.execCommand("copy")
        } catch (err) {
            console.error("execCommand copy failed:", err)
            document.body.removeChild(textArea)
            restoreElementFocus(previousActiveElement)
            return reject(err)
        }

        // 清理
        document.body.removeChild(textArea)
        restoreElementFocus(previousActiveElement)

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
export async function copyText(text: string, options?: CopyTextOptions): Promise<void> {
    try {
        await tryWriteTextWithModernAPI(text)
        console.log("Text has been copied using navigator.clipboard!")
    } catch (err) {
        console.warn("Falling back to execCommand method, please use HTTPS or localhost or 127.0.0.1 for better clipboard support,", err)
        await writeTextWithExecCommand(text, options)
    }
}
