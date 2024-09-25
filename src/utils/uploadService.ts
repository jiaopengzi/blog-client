/**
 * @Author       : jiaopengzi
 * @Date         : 2024-09-25 16:10:09
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-09-25 17:58:15
 * @FilePath     : \blog-client\src\utils\uploadService.ts
 * @Description  : 上传服务
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import { ShowMsgTip } from '@/utils/message'
import { UploadCode } from '@/api/responseCode'
import { type UploadRequestOptions } from 'element-plus'
import type { RequestStrategy, Chunk } from '@/utils/chunkUpload'
import {
  type ConfirmBeforeUploadRequest,
  confirmBeforeUploadAPI,
} from '@/api/upload/confirmBeforeUpload'
import { type ChunkMetadata, uploadChunkAPI } from '@/api/upload/chunk'
import {
  type UploadFileInfo,
  UploadControllerEvents,
  UploadController,
  MultiThreadSplitor,
} from '@/utils/chunkUpload'
import { HashAlgorithm } from '@/utils/hash'
import type { Res } from '@/api/responseCode'
import { uploadFileBySignedUrlAPI } from '@/api/upload/uploadFileBySignedUrl'
import {
  type ConfirmAfterUploadBySignedUrlRequest,
  confirmAfterUploadBySignedUrlAPI,
} from '@/api/upload/confirmAfterUploadBySignedUrl'

// 自定义请求策略
class MyRequestStrategy implements RequestStrategy {
  options: UploadRequestOptions
  uploadFileInfo: UploadFileInfo | null = null

  constructor(options: UploadRequestOptions) {
    this.options = options
  }

  async confirmBeforeUpload(req: ConfirmBeforeUploadRequest): Promise<UploadFileInfo> {
    // 返回 uploadFileInfo
    return await confirmBeforeUploadAPI(req)
      .then((response) => {
        const data = response.data.data
        if (response.data.code === UploadCode.ConfirmBeforeUploadSuccess) {
          this.uploadFileInfo = data
          return data
        } else {
          if ('error_msg' in data && data.error_msg) {
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
        ShowMsgTip(ShowMsgTip.MsgType.error, '上传前确认失败，请重试')
        const error: any = new Error('上传前确认失败，请重试')
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
      await uploadFileBySignedUrlAPI(file, signedUrl, headers, onProgress)
    }
  }

  async confirmAfterUploadBySignedUrl(req: ConfirmAfterUploadBySignedUrlRequest): Promise<Res> {
    return (await confirmAfterUploadBySignedUrlAPI(req)).data
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
    return (await uploadChunkAPI(formData, meta)).data
  }
}

/**
 * @description: 上传文件服务
 * @param options 上传请求选项
 * @param isEncrypt 是否加密主要是视频文件 默认true
 * @param isNoFree 是否收费主要是视频文件 默认true
 * @param chunkSizeServer 分片大小 默认10M
 * @param hashAlgorithmServer 哈希算法默认SHA256
 */
export const uploadFile = async (
  options: UploadRequestOptions, // 上传请求选项
  isEncrypt: boolean = true, // 是否加密主要是视频文件
  isNoFree: boolean = true, // 是否免费主要是视频文件
  chunkSizeServer = 1024 * 1024 * 10, // 分片大小
  hashAlgorithmServer: HashAlgorithm = HashAlgorithm.SHA256, // 哈希算法
) => {
  // 获取一个文件对象，这通常是用户通过<input type="file"/>选择的文件
  const file: File = options.file

  // 创建一个请求策略对象
  const requestStrategy = new MyRequestStrategy(options)

  // 创建一个分片策略对象
  const splitStrategy = new MultiThreadSplitor(file, chunkSizeServer, hashAlgorithmServer)

  // 创建一个UploadController对象
  const uploadController = new UploadController(file, requestStrategy, splitStrategy)

  // 监听 progress 事件
  uploadController.on(UploadControllerEvents.PROGRESS, (progress: number) => {
    // 上传进度
    const evt: any = {
      percent: progress * 100,
    }
    // 调用 options.onProgress 方法
    options.onProgress?.(evt)
  })

  // 监听 checkWholeHash 事件
  uploadController.on(UploadControllerEvents.CHECK_WHOLE_HASH, (fileName: string) => {
    ShowMsgTip(ShowMsgTip.MsgType.info, `正在校验:${fileName},请稍后...`, 3000)
  })

  // 监听 end 事件
  uploadController.on(UploadControllerEvents.END, (fileName: string) => {
    options.onSuccess(fileName)
    const msg = `上传成功：${fileName}`
    ShowMsgTip(ShowMsgTip.MsgType.success, msg, 5000)
    return requestStrategy.uploadFileInfo?.id
  })

  // 初始化UploadController
  uploadController.init(isEncrypt, !isNoFree).catch((error) => {
    // 处理错误
    console.error(error)
    options.onError(error)
  })
}
