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

    // 实现 handleConfirmBeforeUploadError，对权限相关错误给出更友好的提示
    async handleConfirmBeforeUploadError(errorMessage: string): Promise<void> {
        if (errorMessage.includes("超过权限限制次数")) {
            MessageUtil.warning("您已达到头像上传数量限制，请稍后再试", 6000)
        } else if (errorMessage.includes("无权限")) {
            MessageUtil.warning("您没有上传头像的权限，请联系管理员", 5000)
        } else {
            MessageUtil.error(errorMessage, 6000)
        }
    }
}
