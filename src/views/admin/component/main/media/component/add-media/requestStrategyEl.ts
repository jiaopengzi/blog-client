/**
 * @Author       : jiaopengzi
 * @Date         : 2024-09-30 10:48:16
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-09-30 12:28:46
 * @FilePath     : \blog-client\src\views\admin\component\main\media\component\add-media\requestStrategyEl.ts
 * @Description  : el组件通用上传请求策略
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
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
