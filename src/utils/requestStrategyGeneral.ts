/**
 * @Author       : jiaopengzi
 * @Date         : 2024-09-25 20:10:29
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-09-25 20:12:22
 * @FilePath     : \blog-client\src\utils\requestStrategyGeneral.ts
 * @Description  : 通用文件上传请求策略
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import { RequestStrategyBase } from '@/utils/requestStrategyBase'
import { confirmBeforeUploadAPI } from '@/api/upload/confirmBeforeUpload'
import { uploadFileBySignedUrlAPI } from '@/api/upload/uploadFileBySignedUrl'
import { confirmAfterUploadBySignedUrlAPI } from '@/api/upload/confirmAfterUploadBySignedUrl'
import { uploadChunkAPI } from '@/api/upload/chunk'

export class RequestStrategyGeneral extends RequestStrategyBase {
  confirmBeforeUploadAPI = confirmBeforeUploadAPI
  uploadFileBySignedUrlAPI = uploadFileBySignedUrlAPI
  confirmAfterUploadBySignedUrlAPI = confirmAfterUploadBySignedUrlAPI
  uploadChunkAPI = uploadChunkAPI
}
