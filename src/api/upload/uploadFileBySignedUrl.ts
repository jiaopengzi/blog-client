/*
 * FilePath    : blog-client-nuxt\src\api\upload\uploadFileBySignedUrl.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 使用签名 URL 上传文件 (阶段 1 重写: axios -> XMLHttpRequest)
 */

/*
 * 补充说明:
 * 仅客户端上传场景使用; XHR 提供 upload.onprogress 进度回调 (fetch 无原生进度)
 */

export function uploadFileBySignedUrlAPI(
    file: File, // 文件
    signedUrl: string, // 签名 URL
    headers: Record<string, string>, // Content-Type 为必须
    onProgress: (percent: number) => void, // 上传进度回调
): Promise<void> {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.open("PUT", signedUrl)

        for (const [key, value] of Object.entries(headers)) {
            xhr.setRequestHeader(key, value)
        }

        // 上传进度
        xhr.upload.addEventListener("progress", (event) => {
            if (event.lengthComputable && event.total > 0) {
                const percentCompleted = Math.round((event.loaded * 100) / event.total)
                onProgress(percentCompleted)
            }
        })

        xhr.addEventListener("load", () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve()
                return
            }

            reject(new Error(`upload failed: ${xhr.status}`))
        })

        xhr.addEventListener("error", () => {
            reject(new Error("upload network error"))
        })

        xhr.send(file)
    })
}
