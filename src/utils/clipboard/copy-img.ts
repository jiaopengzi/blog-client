/*
 * FilePath    : blog-client\src\utils\clipboard\copy-img.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 图片 复制 优先使用现代 clipboard API，如果不支持则回退到 link 方式
 */

/**
 * 尝试使用现代 API 写入到系统剪贴板
 * 成功返回 Promise<void>，失败（或不支持）抛出错误
 */
async function tryWriteImgWithModernAPI(blob: Blob): Promise<void> {
    // 仅在支持 navigator.clipboard.write 的环境下执行
    if (typeof navigator !== "undefined" && navigator.clipboard && navigator.clipboard.write) {
        try {
            // 将传入的 blob 封装进 ClipboardItem 后写入系统剪贴板
            const clipboardItem = new ClipboardItem({ [blob.type]: blob })
            await navigator.clipboard.write([clipboardItem])
        } catch (err) {
            // 即使对象存在，也可能因非安全上下文或权限失败
            const wrappedError = new Error(`Modern clipboard API failed: ${err}`)
            ;(wrappedError as Error & { cause?: unknown }).cause = err
            throw wrappedError
        }
    } else {
        throw new Error("Modern clipboard API not supported for writing Blob.")
    }
}

/**
 * 使用 img + execCommand 的方式复制图片
 * 直接从 Blob 创建 img 元素并尝试复制，兼容 HTTP 环境
 */
function tryWriteImgWithExecCommand(blob: Blob): Promise<void> {
    return new Promise((resolve, reject) => {
        const img = new Image()
        const url = URL.createObjectURL(blob)

        img.addEventListener("load", () => {
            // 直接使用 img 元素进行复制
            img.style.position = "fixed"
            img.style.left = "-9999px"
            document.body.appendChild(img)

            // 选中图片
            const selection = window.getSelection()
            if (!selection) {
                document.body.removeChild(img)
                URL.revokeObjectURL(url)
                return reject(new Error("Unable to get window selection"))
            }

            const range = document.createRange()
            range.selectNodeContents(img)
            selection.removeAllRanges()
            selection.addRange(range)

            let success = false
            try {
                success = document.execCommand("copy")
            } catch (err) {
                console.error("execCommand copy image failed:", err)
            }

            selection.removeAllRanges()
            document.body.removeChild(img)
            URL.revokeObjectURL(url)

            if (success) {
                console.log("Image has been copied using execCommand!")
                resolve()
            } else {
                reject(new Error("execCommand copy image was unsuccessful"))
            }
        })

        img.addEventListener("error", () => {
            URL.revokeObjectURL(url)
            reject(new Error("Failed to load image from blob"))
        })

        img.src = url
    })
}

/**
 * 使用 link 下载的方式（保留原方案作为最后备选）
 * @param blob Blob 对象
 * @param linkDownload 下载链接的文件名(注意包文件含拓展名)
 */
function writeImgWithLink(blob: Blob, linkDownload = "img.png"): Promise<void> {
    return new Promise((resolve) => {
        const link = document.createElement("a")
        link.href = URL.createObjectURL(blob)
        link.download = linkDownload
        link.style.display = "none"
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)

        setTimeout(() => {
            URL.revokeObjectURL(link.href)
            console.log("Image download triggered")
            resolve()
        }, 1000)
    })
}

/**
 * 对外暴露的拷贝函数：优先尝试使用现代 API，
 * 如果不支持或失败则回退到 canvas+execCommand 方式，最后降级到下载
 */
export async function copyImg(blob: Blob, linkDownload = "img.png"): Promise<void> {
    try {
        await tryWriteImgWithModernAPI(blob)
        console.log("Image has been copied using navigator.clipboard!")
    } catch (modernErr) {
        console.warn("Modern clipboard API failed, falling back to canvas method: ", modernErr)

        try {
            await tryWriteImgWithExecCommand(blob)
            console.warn("Image has been copied using canvas method!")
        } catch (execErr) {
            console.warn("ExecCommand method failed, falling back to download: ", execErr)
            console.warn("Please use HTTPS or localhost or 127.0.0.1 for better clipboard support")
            await writeImgWithLink(blob, linkDownload)
        }
    }
}
