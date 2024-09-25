/**
 * @Author       : jiaopengzi
 * @Date         : 2024-09-25 20:13:01
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-09-25 20:14:41
 * @FilePath     : \blog-client\src\utils\uploadCommon.ts
 * @Description  : 上传公共方法
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import { ShowMsgTip } from '@/utils/message'
import { type UploadRequestOptions } from 'element-plus'
import { UploadControllerEvents, UploadController, MultiThreadSplitor } from '@/utils/chunkUpload'
import { HashAlgorithm } from '@/utils/hash'

export const uploadCommon = async (
  options: UploadRequestOptions,
  isEncrypt: boolean,
  isNoFree: boolean,
  chunkSizeServer: number,
  hashAlgorithmServer: HashAlgorithm,
  RequestStrategyClass: new (options: UploadRequestOptions) => any,
) => {
  const file: File = options.file
  const requestStrategy = new RequestStrategyClass(options)
  const splitStrategy = new MultiThreadSplitor(file, chunkSizeServer, hashAlgorithmServer)
  const uploadController = new UploadController(file, requestStrategy, splitStrategy)

  uploadController.on(UploadControllerEvents.PROGRESS, (progress: number) => {
    const evt: any = {
      percent: progress * 100,
    }
    options.onProgress?.(evt)
  })

  uploadController.on(UploadControllerEvents.CHECK_WHOLE_HASH, (fileName: string) => {
    ShowMsgTip(ShowMsgTip.MsgType.info, `正在校验:${fileName},请稍后...`, 3000)
  })

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
