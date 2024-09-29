/**
 * @Author       : jiaopengzi
 * @Date         : 2024-09-29 19:00:37
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-09-29 19:07:52
 * @FilePath     : \blog-client\src\utils\uploadEditor.ts
 * @Description  :
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import { ShowMsgTip } from '@/utils/message'
import { RequestStrategyGeneral } from '@/utils/requestStrategyGeneral'
import {
  UploadControllerEvents,
  UploadController,
  MultiThreadSplitor,
  type UploadFileSuccessInfo,
} from '@/utils/chunkUpload'
import { HashAlgorithm } from '@/utils/hash'

export const uploadEditor = async (
  file: File,
  isEncrypt: boolean = true,
  isNoFree: boolean = true,
  chunkSizeServer = 1024 * 1024 * 10,
  hashAlgorithmServer: HashAlgorithm = HashAlgorithm.SHA256,
): Promise<string | undefined> => {
  const requestStrategy = new RequestStrategyGeneral(file)
  const splitStrategy = new MultiThreadSplitor(file, chunkSizeServer, hashAlgorithmServer)
  const uploadController = new UploadController(file, requestStrategy, splitStrategy)

  return new Promise((resolve, reject) => {
    uploadController.on(UploadControllerEvents.CHECK_WHOLE_HASH, (fileName: string) => {
      ShowMsgTip(ShowMsgTip.MsgType.info, `正在校验:${fileName},请稍后...`, 3000)
    })

    uploadController.on(UploadControllerEvents.END, (info: UploadFileSuccessInfo) => {
      const msg = `上传成功：${info.fileName}`
      ShowMsgTip(ShowMsgTip.MsgType.success, msg, 5000)
      resolve(info.fileUrl)
    })

    // 初始化UploadController
    uploadController.init(isEncrypt, !isNoFree).catch((error) => {
      // 处理错误
      console.error(error)
      reject(error)
    })
  })
}
