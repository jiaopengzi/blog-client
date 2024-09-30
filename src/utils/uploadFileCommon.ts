/**
 * @Author       : jiaopengzi
 * @Date         : 2024-09-25 20:13:01
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-09-30 11:05:16
 * @FilePath     : \blog-client\src\utils\uploadFileCommon.ts
 * @Description  : 上传文件公共方法
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import { ShowMsgTip } from '@/utils/message'
import {
  UploadControllerEvents,
  UploadController,
  MultiThreadSplitor,
  type UploadFileSuccessInfo,
} from '@/utils/chunkUpload'
import { HashAlgorithm } from '@/utils/hash'

export const uploadFileCommon = async (
  file: File,
  isEncrypt: boolean,
  isNoFree: boolean,
  chunkSizeServer: number,
  hashAlgorithmServer: HashAlgorithm,
  RequestStrategyClass: new (file: File) => any,
): Promise<string | undefined> => {
  const requestStrategy = new RequestStrategyClass(file)
  const splitStrategy = new MultiThreadSplitor(file, chunkSizeServer, hashAlgorithmServer)
  const uploadController = new UploadController(file, requestStrategy, splitStrategy)

  return new Promise((resolve, reject) => {
    uploadController.on(UploadControllerEvents.CHECK_WHOLE_HASH, (fileName: string) => {
      ShowMsgTip(ShowMsgTip.MsgType.info, `正在校验:${fileName},请稍后...`, 3000)
    })

    uploadController.on(UploadControllerEvents.END, (info: UploadFileSuccessInfo) => {
      // const msg = `上传成功：${info.fileName}`
      // const msg = `上传成功1`
      // ShowMsgTip(ShowMsgTip.MsgType.success, msg, 5000)
      resolve(info.fileUrl)
    })

    // 初始化UploadController
    uploadController.init(isEncrypt, !isNoFree).catch((error) => {
      // 处理错误
      // console.error(error)
      reject(error)
    })
  })
}
