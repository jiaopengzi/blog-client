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

    // 实现 handleConfirmBeforeUploadError，对权限相关错误给出更友好的提示
    async handleConfirmBeforeUploadError(errorMessage: string): Promise<void> {
        if (errorMessage.includes("超过权限限制次数")) {
            MessageUtil.warning("您已达到上传数量限制，请稍后再试", 6000)
        } else if (errorMessage.includes("无权限")) {
            MessageUtil.warning("您没有上传图片的权限，请联系管理员", 5000)
        } else {
            MessageUtil.error(errorMessage, 6000)
        }
    }
}
