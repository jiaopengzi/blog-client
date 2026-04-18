/**
 * @FilePath     : \blog-client\src\components\common\media-add\uploadByEl.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 使用 Element Plus 的上传组件上传文件
 */

import { type UploadRequestOptions } from "element-plus"

import type { FileAllowed } from "@/api/upload/getUploadFileRequirements"
import { MultiThreadSplitter, UploadController, UploadControllerEvents, type UploadFileSuccessInfo } from "@/utils/chunkUpload"
import { HashAlgorithm } from "@/utils/hash"
import { MessageUtil } from "@/utils/message"
import { Task, TaskQueue } from "@/utils/task"

import { RequestStrategyEl } from "./requestStrategyEl"

// 文件级串行队列，同时只处理 1 个文件，避免多文件并行导致内存溢出
const fileUploadQueue = new TaskQueue(1)

export const uploadByEl = async (
    options: UploadRequestOptions,
    isEncrypt: boolean = true,
    isNoFree: boolean = true,
    chunkSizeServer = 1024 * 1024 * 10,
    hashAlgorithmServer: HashAlgorithm = HashAlgorithm.SHA256,
    fileAllowedList: FileAllowed[] = [],
): Promise<string | undefined> => {
    return new Promise<string | undefined>((outerResolve, outerReject) => {
        const task = new Task(async () => {
            const file: File = options.file
            const requestStrategy = new RequestStrategyEl(options)
            requestStrategy.fileAllowedList = fileAllowedList
            // MultiThreadSplitter 在 Task 执行时才构造，避免入队时 eager slice
            const splitStrategy = new MultiThreadSplitter(file, chunkSizeServer, hashAlgorithmServer)
            const uploadController = new UploadController(file, requestStrategy, splitStrategy)

            return new Promise<void>((resolve, reject) => {
                uploadController.on(UploadControllerEvents.PROGRESS, (progress: number) => {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const evt: any = {
                        percent: progress * 100,
                    }
                    options.onProgress?.(evt)
                })

                uploadController.on(UploadControllerEvents.CHECK_WHOLE_HASH, (fileName: string) => {
                    MessageUtil.info(`正在校验:${fileName},请稍后...`, 3000)
                })

                uploadController.on(UploadControllerEvents.END, (info: UploadFileSuccessInfo) => {
                    options.onSuccess(info.fileName)
                    const msg = `上传成功：${info.fileName}`
                    MessageUtil.success(msg, 5000)
                    outerResolve(info.fileUrl)
                    resolve()
                })

                uploadController.on(UploadControllerEvents.ERROR, (error: Error) => {
                    MessageUtil.error(error.message, 6000)
                    options.onError(error as Parameters<typeof options.onError>[0])
                    outerReject(error)
                    reject(error)
                })

                // 初始化UploadController
                uploadController.init(isEncrypt, !isNoFree).catch((error) => {
                    // 处理错误
                    console.error(error)
                    options.onError(error)
                    outerReject(error)
                    reject(error)
                })
            })
        })
        fileUploadQueue.addAndStart(task)
    })
}
