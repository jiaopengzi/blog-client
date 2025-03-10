/**
 * @FilePath     : \blog-client\src\pkg\codemirror\extension\uploadEditor.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 编辑器上传
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
