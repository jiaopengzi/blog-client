/**
 * @FilePath     : \blog-client\src\utils\requestStrategyBase.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 上传请求策略基类
 */

import { type UploadRequestOptions } from "element-plus"

import type { Res, ResPromise } from "@/api/response"
import { handleResErr, ResponseCode } from "@/api/response"
import { type ChunkMetadata } from "@/api/upload/chunk"
import { type ConfirmAfterUploadBySignedUrlRequest } from "@/api/upload/confirmAfterUploadBySignedUrl"
import { type ConfirmBeforeUploadRequest } from "@/api/upload/confirmBeforeUpload"
import { type GetUploadFileUrlRequest } from "@/api/upload/getUploadFileUrl"
import { uploadFileBySignedUrlAPI } from "@/api/upload/uploadFileBySignedUrl"
import type { Chunk, RequestStrategy, UploadFileInfo } from "@/utils/chunkUpload"
import { MessageUtil } from "@/utils/message"

export const MultipartFormFileKey = "file"

export abstract class RequestStrategyBase implements RequestStrategy {
    elUploadRequestOptions: UploadRequestOptions | null = null
    file: File | null = null
    fileName: string
    uploadFileInfo: UploadFileInfo | null = null

    constructor(input: UploadRequestOptions | File) {
        if (input instanceof File) {
            this.file = input
            this.fileName = input.name
        } else {
            this.elUploadRequestOptions = input
            this.fileName = this.elUploadRequestOptions.file.name
        }
    }
    abstract confirmBeforeUploadAPI(req: ConfirmBeforeUploadRequest): ResPromise<Res<UploadFileInfo>>
    // abstract uploadFileBySignedUrlAPI(
    //   file: File,
    //   signedUrl: string,
    //   headers: Record<string, string>,
    //   onProgress: (percent: number) => void,
    // ): AxiosPromise<Res>
    abstract confirmAfterUploadBySignedUrlAPI(req: ConfirmAfterUploadBySignedUrlRequest): ResPromise<Res<void>>
    abstract handleConfirmBeforeUploadError(errorMessage: string): void
    abstract uploadChunkAPI(formData: FormData, meta: ChunkMetadata): ResPromise<Res<string>>
    abstract getUploadFileUrlAPI(req: GetUploadFileUrlRequest): ResPromise<Res<string>>

    async confirmBeforeUpload(req: ConfirmBeforeUploadRequest): Promise<UploadFileInfo> {
        const res = await this.confirmBeforeUploadAPI(req)

        const data = res.data.data
        if (res.data.code === ResponseCode.ConfirmBeforeUploadSuccess) {
            this.uploadFileInfo = data
            return data
        } else {
            const errorMessage = handleResErr(res)

            // 云存储配置校验失败属于全局性错误, 在基类统一处理, 不下放到子类
            if (res.data.code === ResponseCode.CheckCloudStorageConfigFailed) {
                MessageUtil.error(errorMessage, 10000)
            } else {
                this.handleConfirmBeforeUploadError(errorMessage)
            }

            const error: Error = new Error(res.data.msg)
            if (this.elUploadRequestOptions) {
                const uploadError = {
                    name: error.name,
                    message: error.message,
                    stack: error.stack,
                    status: 0,
                    method: "POST",
                    url: "",
                }
                this.elUploadRequestOptions.onError(uploadError)
            }
            return Promise.reject(error)
        }
    }

    async uploadFileBySignedUrl(file: File, signedUrl: string, headers: Record<string, string>, onProgress: (percent: number) => void): Promise<void> {
        if (this.uploadFileInfo?.upload_strategy.signed_url) {
            // await this.uploadFileBySignedUrlAPI(file, signedUrl, headers, onProgress)
            await uploadFileBySignedUrlAPI(file, signedUrl, headers, onProgress)
        }
    }

    async confirmAfterUploadBySignedUrl(req: ConfirmAfterUploadBySignedUrlRequest): ResPromise<Res<void>> {
        return await this.confirmAfterUploadBySignedUrlAPI(req)
    }

    async uploadChunk(chunk: Chunk): ResPromise<Res<string>> {
        if (!chunk.blob) {
            throw new Error(`uploadChunk: chunk.blob is missing (part_index=${chunk.part_index})`)
        }
        const formData = new FormData()
        formData.append(MultipartFormFileKey, chunk.blob, chunk.part_index + this.fileName)
        const meta: ChunkMetadata = {
            File_id: this.uploadFileInfo?.id ?? "",
            sub_dir: this.uploadFileInfo?.sub_dir ?? "",
            hash_key: chunk.hash_key,
            hash_algorithm: chunk.hash_algorithm,
            part_numbers: chunk.part_numbers,
            part_index: chunk.part_index,
            start: chunk.start,
            end: chunk.end,
        }
        return await this.uploadChunkAPI(formData, meta)
    }

    async getUploadFileUrl(file_id: string): ResPromise<Res<string>> {
        return await this.getUploadFileUrlAPI({ file_id })
    }
}
