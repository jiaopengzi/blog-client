/**
 * @FilePath     : \blog-client\src\pkg\codemirror\extension\requestStrategyEditor.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 编辑器上传请求策略
 */

import { uploadChunkEditorAPI } from "@/api/upload/chunk"
// import { uploadFileBySignedUrlAPI } from '@/api/upload/uploadFileBySignedUrl'
import { confirmAfterUploadBySignedUrlEditorAPI } from "@/api/upload/confirmAfterUploadBySignedUrl"
import { confirmBeforeUploadEditorAPI } from "@/api/upload/confirmBeforeUpload"
import { getUploadFileUrlEditorAPI } from "@/api/upload/getUploadFileUrl"
import { MessageUtil } from "@/utils/message"
import { RequestStrategyBase } from "@/utils/requestStrategyBase"

export class RequestStrategyEditor extends RequestStrategyBase {
    confirmBeforeUploadAPI = confirmBeforeUploadEditorAPI
    // uploadFileBySignedUrlAPI = uploadFileBySignedUrlAPI
    confirmAfterUploadBySignedUrlAPI = confirmAfterUploadBySignedUrlEditorAPI
    uploadChunkAPI = uploadChunkEditorAPI
    getUploadFileUrlAPI = getUploadFileUrlEditorAPI

    // 实现 handleConfirmBeforeUploadError
    async handleConfirmBeforeUploadError(errorMessage: string): Promise<void> {
        MessageUtil.error(errorMessage, 6000)
    }
}
