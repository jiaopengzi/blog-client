/**
 * @FilePath     : \blog-client\src\utils\uploadFileCommon.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 上传文件公共方法
 */

import { MultiThreadSplitter, type RequestStrategy, UploadController, UploadControllerEvents, type UploadFileSuccessInfo } from "@/utils/chunkUpload"
import { HashAlgorithm } from "@/utils/hash"
import { MessageUtil } from "@/utils/message"

export const uploadFileCommon = async <T extends RequestStrategy>(
    file: File,
    isEncrypt: boolean,
    isNoFree: boolean,
    chunkSizeServer: number,
    hashAlgorithmServer: HashAlgorithm,
    RequestStrategyClass: new (file: File) => T,
): Promise<string | undefined> => {
    const requestStrategy = new RequestStrategyClass(file)
    const splitStrategy = new MultiThreadSplitter(file, chunkSizeServer, hashAlgorithmServer)
    const uploadController = new UploadController(file, requestStrategy, splitStrategy)

    return new Promise((resolve, reject) => {
        uploadController.on(UploadControllerEvents.CHECK_WHOLE_HASH, (fileName: string) => {
            MessageUtil.info(`正在校验:${fileName},请稍后...`, 3000)
        })

        uploadController.on(UploadControllerEvents.END, (info: UploadFileSuccessInfo) => {
            // const msg = `上传成功：${info.fileName}`
            // const msg = `上传成功1`
            // MessageUtil.success( msg, 5000)
            resolve(info.fileUrl)
        })

        uploadController.on(UploadControllerEvents.ERROR, (error: Error) => {
            // 处理错误
            // console.error(error)
            MessageUtil.error(error.message, 6000)
            reject(error)
        })

        // 初始化UploadController
        uploadController.init(isEncrypt, !isNoFree).catch((error) => {
            // 处理错误
            // console.error(error)
            reject(error)
        })
    })
}
