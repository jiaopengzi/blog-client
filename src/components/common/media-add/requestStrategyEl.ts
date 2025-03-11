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
import { confirmBeforeUploadAPI } from "@/api/upload/confirmBeforeUpload"
import { getUploadFileUrlAPI } from "@/api/upload/getUploadFileUrl"
import { MessageUtil } from "@/utils/message"
import { RequestStrategyBase } from "@/utils/requestStrategyBase"

export class RequestStrategyEl extends RequestStrategyBase {
    confirmBeforeUploadAPI = confirmBeforeUploadAPI
    // uploadFileBySignedUrlAPI = uploadFileBySignedUrlAPI
    confirmAfterUploadBySignedUrlAPI = confirmAfterUploadBySignedUrlAPI
    uploadChunkAPI = uploadChunkAPI
    getUploadFileUrlAPI = getUploadFileUrlAPI

    // 实现 handleConfirmBeforeUploadError
    async handleConfirmBeforeUploadError(errorMessage: string): Promise<void> {
        errorMessage = `${errorMessage},${this.fileName}`
        MessageUtil.error(errorMessage, 6000)
    }
}
