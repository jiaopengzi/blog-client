/**
 * @Author       : jiaopengzi
 * @Date         : 2024-09-30 10:59:48
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-09-30 12:20:56
 * @FilePath     : \blog-client\src\pkg\codemirror\extension\requestStrategyEditor.ts
 * @Description  : 编辑器上传请求策略
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import { ShowMsgTip } from '@/utils/message'
import { RequestStrategyBase } from '@/utils/requestStrategyBase'
import { confirmBeforeUploadEditorAPI } from '@/api/upload/confirmBeforeUpload'
// import { uploadFileBySignedUrlAPI } from '@/api/upload/uploadFileBySignedUrl'
import { confirmAfterUploadBySignedUrlEditorAPI } from '@/api/upload/confirmAfterUploadBySignedUrl'
import { uploadChunkEditorAPI } from '@/api/upload/chunk'
import { getUploadFileUrlEditorAPI } from '@/api/upload/getUploadFileUrl'

export class RequestStrategyEditor extends RequestStrategyBase {
  confirmBeforeUploadAPI = confirmBeforeUploadEditorAPI
  // uploadFileBySignedUrlAPI = uploadFileBySignedUrlAPI
  confirmAfterUploadBySignedUrlAPI = confirmAfterUploadBySignedUrlEditorAPI
  uploadChunkAPI = uploadChunkEditorAPI
  getUploadFileUrlAPI = getUploadFileUrlEditorAPI

  // 实现 handleconfirmBeforeUploadError
  async handleconfirmBeforeUploadError(errorMessage: string): Promise<void> {
    ShowMsgTip(ShowMsgTip.MsgType.error, errorMessage, 6000)
  }
}
