/**
 * @FilePath     : \blog-client\src\components\common\avatar-upload\requestStrategyAvatar.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 上传头像请求策略
 */

import { uploadChunkAvatarAPI } from "@/api/upload/chunk"
// import { uploadFileBySignedUrlAPI } from '@/api/upload/uploadFileBySignedUrl'
import { confirmAfterUploadBySignedUrlAvatarAPI } from "@/api/upload/confirmAfterUploadBySignedUrl"
import { confirmBeforeUploadAvatarAPI } from "@/api/upload/confirmBeforeUpload"
import { getUploadFileUrlAvatarAPI } from "@/api/upload/getUploadFileUrl"
import { MessageUtil } from "@/utils/message"
import { RequestStrategyBase } from "@/utils/requestStrategyBase"

export class RequestStrategyAvatar extends RequestStrategyBase {
    confirmBeforeUploadAPI = confirmBeforeUploadAvatarAPI
    // uploadFileBySignedUrlAPI = uploadFileBySignedUrlAPI
    confirmAfterUploadBySignedUrlAPI = confirmAfterUploadBySignedUrlAvatarAPI
    uploadChunkAPI = uploadChunkAvatarAPI
    getUploadFileUrlAPI = getUploadFileUrlAvatarAPI

    // 实现 handleConfirmBeforeUploadError
    async handleConfirmBeforeUploadError(errorMessage: string): Promise<void> {
        MessageUtil.error(errorMessage, 6000)
    }
}
