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

import { ShowMsgTip } from "@/utils/message"
import { RequestStrategyBase } from "@/utils/requestStrategyBase"
import { confirmBeforeUploadAPI } from "@/api/upload/confirmBeforeUpload"
// import { uploadFileBySignedUrlAPI } from '@/api/upload/uploadFileBySignedUrl'
import { confirmAfterUploadBySignedUrlAPI } from "@/api/upload/confirmAfterUploadBySignedUrl"
import { uploadChunkAPI } from "@/api/upload/chunk"
import { getUploadFileUrlAPI } from "@/api/upload/getUploadFileUrl"

export class RequestStrategyEl extends RequestStrategyBase {
    confirmBeforeUploadAPI = confirmBeforeUploadAPI
    // uploadFileBySignedUrlAPI = uploadFileBySignedUrlAPI
    confirmAfterUploadBySignedUrlAPI = confirmAfterUploadBySignedUrlAPI
    uploadChunkAPI = uploadChunkAPI
    getUploadFileUrlAPI = getUploadFileUrlAPI

    // 实现 handleConfirmBeforeUploadError
    async handleConfirmBeforeUploadError(errorMessage: string): Promise<void> {
        errorMessage = `${errorMessage},${this.fileName}`
        ShowMsgTip(ShowMsgTip.MsgType.error, errorMessage, 6000)
    }
}
