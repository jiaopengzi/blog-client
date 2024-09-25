/**
 * @Author       : jiaopengzi
 * @Date         : 2024-09-25 20:06:48
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-09-25 20:43:57
 * @FilePath     : \blog-client\src\utils\requestStrategyBase.ts
 * @Description  : 上传请求策略基类
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import { ShowMsgTip } from '@/utils/message'
import { UploadCode } from '@/api/responseCode'
import { type UploadRequestOptions } from 'element-plus'
import type { RequestStrategy, Chunk } from '@/utils/chunkUpload'
import { type ConfirmBeforeUploadRequest } from '@/api/upload/confirmBeforeUpload'
import { type ChunkMetadata } from '@/api/upload/chunk'
import { type UploadFileInfo } from '@/utils/chunkUpload'
import type { Res } from '@/api/responseCode'
import { type ConfirmAfterUploadBySignedUrlRequest } from '@/api/upload/confirmAfterUploadBySignedUrl'

export abstract class RequestStrategyBase implements RequestStrategy {
  options: UploadRequestOptions
  uploadFileInfo: UploadFileInfo | null = null

  constructor(options: UploadRequestOptions) {
    this.options = options
  }

  abstract confirmBeforeUploadAPI(req: ConfirmBeforeUploadRequest): Promise<any>
  abstract uploadFileBySignedUrlAPI(
    file: File,
    signedUrl: string,
    headers: Record<string, string>,
    onProgress: (percent: number) => void,
  ): Promise<any>
  abstract confirmAfterUploadBySignedUrlAPI(req: ConfirmAfterUploadBySignedUrlRequest): Promise<any>
  abstract uploadChunkAPI(formData: FormData, meta: ChunkMetadata): Promise<any>

  async confirmBeforeUpload(req: ConfirmBeforeUploadRequest): Promise<UploadFileInfo> {
    return await this.confirmBeforeUploadAPI(req)
      .then((response) => {
        const data = response.data.data
        if (response.data.code === UploadCode.ConfirmBeforeUploadSuccess) {
          this.uploadFileInfo = data
          return data
        } else {
          if (typeof data === 'object' && 'error_msg' in data && data.error_msg) {
            ShowMsgTip(
              ShowMsgTip.MsgType.error,
              `${response.data.msg}:${this.options.file.name},${data.error_msg} `,
              6000,
            )
          } else {
            ShowMsgTip(
              ShowMsgTip.MsgType.error,
              `${response.data.msg}:${this.options.file.name}`,
              6000,
            )
          }
          const error: any = new Error(response.data.msg)
          this.options.onError(error)
          return
        }
      })
      .catch(() => {
        const errorMessage = '上传前确认失败，请重试'
        ShowMsgTip(ShowMsgTip.MsgType.error, errorMessage, 6000)
        const error: any = new Error(errorMessage)
        this.options.onError(error)
      })
  }

  async uploadFileBySignedUrl(
    file: File,
    signedUrl: string,
    headers: Record<string, string>,
    onProgress: (percent: number) => void,
  ): Promise<any> {
    if (this.uploadFileInfo?.upload_strategy.signed_url) {
      await this.uploadFileBySignedUrlAPI(file, signedUrl, headers, onProgress)
    }
  }

  async confirmAfterUploadBySignedUrl(req: ConfirmAfterUploadBySignedUrlRequest): Promise<Res> {
    return (await this.confirmAfterUploadBySignedUrlAPI(req)).data
  }

  async uploadChunk(chunk: Chunk): Promise<Res> {
    const formData = new FormData()
    formData.append(this.options.filename, chunk.blob, chunk.part_index + this.options.file.name)
    const meta: ChunkMetadata = {
      File_id: this.uploadFileInfo?.id!,
      sub_dir: this.uploadFileInfo?.sub_dir!,
      hash_key: chunk.hash_key,
      hash_algorithm: chunk.hash_algorithm,
      part_numbers: chunk.part_numbers,
      part_index: chunk.part_index,
      start: chunk.start,
      end: chunk.end,
    }
    return (await this.uploadChunkAPI(formData, meta)).data
  }
}
