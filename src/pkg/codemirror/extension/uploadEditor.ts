/**
 * @Author       : jiaopengzi
 * @Date         : 2024-09-30 11:00:20
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-09-30 11:02:12
 * @FilePath     : \blog-client\src\pkg\codemirror\extension\uploadEditor.ts
 * @Description  : 编辑器上传
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import { HashAlgorithm } from "@/utils/hash"
import { uploadFileCommon } from "@/utils/uploadFileCommon"

import { RequestStrategyEditor } from "./requestStrategyEditor"

export const uploadEditor = async (
    file: File,
    isEncrypt: boolean = true,
    isNoFree: boolean = true,
    chunkSizeServer = 1024 * 1024 * 10,
    hashAlgorithmServer: HashAlgorithm = HashAlgorithm.SHA256,
): Promise<string | undefined> => {
    return await uploadFileCommon(file, isEncrypt, isNoFree, chunkSizeServer, hashAlgorithmServer, RequestStrategyEditor)
}
