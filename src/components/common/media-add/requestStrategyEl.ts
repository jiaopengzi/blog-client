/**
 * @FilePath     : \blog-client\src\components\common\media-add\requestStrategyEl.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : el 组件通用上传请求策略
 */

import { uploadChunkAPI } from "@/api/upload/chunk"
// import { uploadFileBySignedUrlAPI } from '@/api/upload/uploadFileBySignedUrl'
import { confirmAfterUploadBySignedUrlAPI } from "@/api/upload/confirmAfterUploadBySignedUrl"
import { type ConfirmBeforeUploadRequest, confirmBeforeUploadAPI } from "@/api/upload/confirmBeforeUpload"
import type { FileAllowed } from "@/api/upload/getUploadFileRequirements"
import { getUploadFileUrlAPI } from "@/api/upload/getUploadFileUrl"
import { ByteUnit, convertBytes } from "@/utils/byte"
import type { UploadFileInfo } from "@/utils/chunkUpload"
import { MessageUtil } from "@/utils/message"
import { RequestStrategyBase } from "@/utils/requestStrategyBase"

export class RequestStrategyEl extends RequestStrategyBase {
    confirmBeforeUploadAPI = confirmBeforeUploadAPI
    // uploadFileBySignedUrlAPI = uploadFileBySignedUrlAPI
    confirmAfterUploadBySignedUrlAPI = confirmAfterUploadBySignedUrlAPI
    uploadChunkAPI = uploadChunkAPI
    getUploadFileUrlAPI = getUploadFileUrlAPI

    // 允许上传的文件类型列表
    fileAllowedList: FileAllowed[] = []

    // 覆写 confirmBeforeUpload, 根据扩展名修正浏览器可能返回的非标准 MIME 类型
    async confirmBeforeUpload(req: ConfirmBeforeUploadRequest): Promise<UploadFileInfo> {
        const ext = this.fileName.split(".").pop()?.toLowerCase() || ""
        const matched = this.fileAllowedList.find((f) => f.extension.toLowerCase() === ext)
        if (matched) {
            req.file_type = matched.type
        }
        return super.confirmBeforeUpload(req)
    }

    // 实现 handleConfirmBeforeUploadError
    async handleConfirmBeforeUploadError(_errorMessage: string): Promise<void> {
        const ext = this.fileName.split(".").pop()?.toLowerCase() || ""
        const matched = this.fileAllowedList.find((f) => f.extension.toLowerCase() === ext)

        let detail: string
        if (!matched) {
            // 类型不允许
            const allowedExts = this.fileAllowedList.map((f) => f.extension).join(", ")
            detail = `文件类型不允许上传，允许的类型：${allowedExts}`
        } else {
            // 类型允许，大小超出限制
            detail = `${ext.toUpperCase()} 最大允许 ${Math.floor(convertBytes(matched.max_size, ByteUnit.B, ByteUnit.MB))}MB`
        }

        MessageUtil.error(`${this.fileName}：${detail}`, 10000)
    }
}
