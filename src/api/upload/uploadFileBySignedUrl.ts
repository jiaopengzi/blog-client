/**
 * @Author       : jiaopengzi
 * @Date         : 2024-08-09 09:11:52
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-08-09 09:28:36
 * @FilePath     : \blog-client\src\api\upload\uploadFileBySingedUrl.ts
 * @Description  : 使用 签名URL 上传文件
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */
import axios from "axios"
export function uploadFileBySignedUrlAPI(
    file: File, // 文件
    signedUrl: string, // 签名URL
    headers: Record<string, string>, // Content-Type 为必须
    onProgress: (percent: number) => void, // 上传进度回调
): Promise<any> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsArrayBuffer(file)
        reader.onload = function (event) {
            const arrayBuffer = event.target?.result as ArrayBuffer | null

            if (arrayBuffer) {
                axios
                    .put(signedUrl, arrayBuffer, {
                        headers: headers,
                        onUploadProgress: (progressEvent) => {
                            if (
                                progressEvent.lengthComputable &&
                                progressEvent.total !== undefined
                            ) {
                                const percentCompleted = Math.round(
                                    (progressEvent.loaded * 100) / progressEvent.total,
                                )
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
