/**
 * @Author       : jiaopengzi
 * @Date         : 2024-09-25 20:06:48
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-13 18:26:32
 * @FilePath     : \blog-client\src\utils\requestStrategyBase.ts
 * @Description  : 上传请求策略基类
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import { ShowMsgTip } from "@/utils/message"
import { ResponseCode, handleErrInfo } from "@/api/responseCode"
import { type UploadRequestOptions } from "element-plus"
import type { RequestStrategy, Chunk, UploadFileInfo } from "@/utils/chunkUpload"
import { type ConfirmBeforeUploadRequest } from "@/api/upload/confirmBeforeUpload"
import { type GetUploadFileUrlRequest } from "@/api/upload/getUploadFileUrl"
import { type ChunkMetadata } from "@/api/upload/chunk"
import type { AxiosPromise } from "axios"
import type { Res } from "@/api/responseCode"
import { uploadFileBySignedUrlAPI } from "@/api/upload/uploadFileBySignedUrl"
import { type ConfirmAfterUploadBySignedUrlRequest } from "@/api/upload/confirmAfterUploadBySignedUrl"

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
    abstract confirmBeforeUploadAPI(req: ConfirmBeforeUploadRequest): AxiosPromise<Res>
    // abstract uploadFileBySignedUrlAPI(
    //   file: File,
    //   signedUrl: string,
    //   headers: Record<string, string>,
    //   onProgress: (percent: number) => void,
    // ): AxiosPromise<Res>
    abstract confirmAfterUploadBySignedUrlAPI(
        req: ConfirmAfterUploadBySignedUrlRequest,
    ): AxiosPromise<Res>
    abstract handleConfirmBeforeUploadError(errorMessage: string): void
    abstract uploadChunkAPI(formData: FormData, meta: ChunkMetadata): AxiosPromise<Res>
    abstract getUploadFileUrlAPI(req: GetUploadFileUrlRequest): AxiosPromise<Res>

    async confirmBeforeUpload(req: ConfirmBeforeUploadRequest): Promise<UploadFileInfo> {
        return await this.confirmBeforeUploadAPI(req)
            .then((response) => {
                const data = response.data.data
                if (response.data.code === ResponseCode.ConfirmBeforeUploadSuccess) {
                    this.uploadFileInfo = data
                    return data
                } else {
                    const errorMessage = handleErrInfo(response)

                    this.handleConfirmBeforeUploadError(errorMessage)

                    const error: any = new Error(response.data.msg)
                    if (this.elUploadRequestOptions) {
                        this.elUploadRequestOptions.onError(error)
                    }
                    return
                }
            })
            .catch(() => {
                const errorMessage = "上传前确认失败，请重试"
                ShowMsgTip(ShowMsgTip.MsgType.error, errorMessage, 6000)
                const error: any = new Error(errorMessage)
                if (this.elUploadRequestOptions) {
                    this.elUploadRequestOptions.onError(error)
                }
            })
    }

    async uploadFileBySignedUrl(
        file: File,
        signedUrl: string,
        headers: Record<string, string>,
        onProgress: (percent: number) => void,
    ): Promise<any> {
        if (this.uploadFileInfo?.upload_strategy.signed_url) {
            // await this.uploadFileBySignedUrlAPI(file, signedUrl, headers, onProgress)
            await uploadFileBySignedUrlAPI(file, signedUrl, headers, onProgress)
        }
    }

    async confirmAfterUploadBySignedUrl(
        req: ConfirmAfterUploadBySignedUrlRequest,
    ): AxiosPromise<Res> {
        return await this.confirmAfterUploadBySignedUrlAPI(req)
    }

    async uploadChunk(chunk: Chunk): AxiosPromise<Res> {
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

    async getUploadFileUrl(file_id: string): AxiosPromise<Res> {
        return await this.getUploadFileUrlAPI({ file_id })
    }
}
