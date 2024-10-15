/**
 * @Author       : jiaopengzi
 * @Date         : 2024-09-29 10:52:39
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-10-15 09:13:29
 * @FilePath     : \blog-client\src\components\common\avatar-upload\requestStrategyAvatar.ts
 * @Description  : 上传头像请求策略
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import { ShowMsgTip } from '@/utils/message'
import { RequestStrategyBase } from '@/utils/requestStrategyBase'
import { confirmBeforeUploadAvatarAPI } from '@/api/upload/confirmBeforeUpload'
// import { uploadFileBySignedUrlAPI } from '@/api/upload/uploadFileBySignedUrl'
import { confirmAfterUploadBySignedUrlAvatarAPI } from '@/api/upload/confirmAfterUploadBySignedUrl'
import { uploadChunkAvatarAPI } from '@/api/upload/chunk'
import { getUploadFileUrlAvatarAPI } from '@/api/upload/getUploadFileUrl'

export class RequestStrategyAvatar extends RequestStrategyBase {
  confirmBeforeUploadAPI = confirmBeforeUploadAvatarAPI
  // uploadFileBySignedUrlAPI = uploadFileBySignedUrlAPI
  confirmAfterUploadBySignedUrlAPI = confirmAfterUploadBySignedUrlAvatarAPI
  uploadChunkAPI = uploadChunkAvatarAPI
  getUploadFileUrlAPI = getUploadFileUrlAvatarAPI

  // 实现 handleConfirmBeforeUploadError
  async handleConfirmBeforeUploadError(errorMessage: string): Promise<void> {
    ShowMsgTip(ShowMsgTip.MsgType.error, errorMessage, 6000)
  }
}
