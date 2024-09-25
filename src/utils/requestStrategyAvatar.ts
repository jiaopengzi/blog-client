/**
 * @Author       : jiaopengzi
 * @Date         : 2024-09-25 20:09:35
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-09-25 20:09:38
 * @FilePath     : \blog-client\src\utils\requestStrategyAvatar.ts
 * @Description  : 上传头像请求策略
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import { RequestStrategyBase } from '@/utils/requestStrategyBase'
import { confirmBeforeUploadAvatarAPI } from '@/api/upload/confirmBeforeUpload'
import { uploadFileBySignedUrlAPI } from '@/api/upload/uploadFileBySignedUrl'
import { confirmAfterUploadBySignedUrlAvatarAPI } from '@/api/upload/confirmAfterUploadBySignedUrl'
import { uploadChunkAvatarAPI } from '@/api/upload/chunk'

export class RequestStrategyAvatar extends RequestStrategyBase {
  confirmBeforeUploadAPI = confirmBeforeUploadAvatarAPI
  uploadFileBySignedUrlAPI = uploadFileBySignedUrlAPI
  confirmAfterUploadBySignedUrlAPI = confirmAfterUploadBySignedUrlAvatarAPI
  uploadChunkAPI = uploadChunkAvatarAPI
}
