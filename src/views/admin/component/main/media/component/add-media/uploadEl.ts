/**
 * @Author       : jiaopengzi
 * @Date         : 2024-09-30 10:48:16
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-09-30 10:49:08
 * @FilePath     : \blog-client\src\views\admin\component\main\media\component\add-media\uploadEl.ts
 * @Description  : 使用 Element Plus 的上传组件上传文件
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import { ShowMsgTip } from '@/utils/message'
import { RequestStrategyEl } from './requestStrategyEl'
import { type UploadRequestOptions } from 'element-plus'
import {
  UploadControllerEvents,
  UploadController,
  MultiThreadSplitor,
  type UploadFileSuccessInfo,
} from '@/utils/chunkUpload'
import { HashAlgorithm } from '@/utils/hash'

export const uploadEl = async (
  options: UploadRequestOptions,
  isEncrypt: boolean = true,
  isNoFree: boolean = true,
  chunkSizeServer = 1024 * 1024 * 10,
  hashAlgorithmServer: HashAlgorithm = HashAlgorithm.SHA256,
): Promise<string | undefined> => {
  const file: File = options.file
  const requestStrategy = new RequestStrategyEl(options)
  const splitStrategy = new MultiThreadSplitor(file, chunkSizeServer, hashAlgorithmServer)
  const uploadController = new UploadController(file, requestStrategy, splitStrategy)

  return new Promise((resolve, reject) => {
    uploadController.on(UploadControllerEvents.PROGRESS, (progress: number) => {
      const evt: any = {
        percent: progress * 100,
      }
      options.onProgress?.(evt)
    })

    uploadController.on(UploadControllerEvents.CHECK_WHOLE_HASH, (fileName: string) => {
      ShowMsgTip(ShowMsgTip.MsgType.info, `正在校验:${fileName},请稍后...`, 3000)
    })

    uploadController.on(UploadControllerEvents.END, (info: UploadFileSuccessInfo) => {
      options.onSuccess(info.fileName)
      const msg = `上传成功：${info.fileName}`
      ShowMsgTip(ShowMsgTip.MsgType.success, msg, 5000)
      resolve(info.fileUrl)
    })

    // 初始化UploadController
    uploadController.init(isEncrypt, !isNoFree).catch((error) => {
      // 处理错误
      console.error(error)
      options.onError(error)
      reject(error)
    })
  })
}
