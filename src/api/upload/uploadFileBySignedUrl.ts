/**
 * @FilePath     : \blog-client\src\api\upload\uploadFileBySignedUrl.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 使用 签名URL 上传文件
 */

import { request } from "@/api/request"
export function uploadFileBySignedUrlAPI(
    file: File, // 文件
    signedUrl: string, // 签名URL
    headers: Record<string, string>, // Content-Type 为必须
    onProgress: (percent: number) => void, // 上传进度回调
): Promise<void> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsArrayBuffer(file)
        reader.onload = function (event) {
            const arrayBuffer = event.target?.result as ArrayBuffer | null

            if (arrayBuffer) {
                request
                    .put(signedUrl, arrayBuffer, {
                        headers: headers,
                        onUploadProgress: (progressEvent) => {
                            if (progressEvent.lengthComputable && progressEvent.total !== undefined) {
                                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
                                onProgress(percentCompleted)
                            }
                        },
                    })
                    .then((response) => {
                        resolve(response.data)
                    })
                    .catch((error) => {
                        reject(error)
                    })
            }
        }
    })
}
