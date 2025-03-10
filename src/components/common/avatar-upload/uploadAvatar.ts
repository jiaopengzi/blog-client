/**
 * @FilePath     : \blog-client\src\components\common\avatar-upload\uploadAvatar.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 上传头像
 */

import { HashAlgorithm } from "@/utils/hash"
import { uploadFileCommon } from "@/utils/uploadFileCommon"

import { RequestStrategyAvatar } from "./requestStrategyAvatar"

export const uploadAvatar = async (
    file: File,
    isEncrypt: boolean = true,
    isNoFree: boolean = true,
    chunkSizeServer = 1024 * 1024 * 10,
    hashAlgorithmServer: HashAlgorithm = HashAlgorithm.SHA256,
): Promise<string | undefined> => {
    return await uploadFileCommon(file, isEncrypt, isNoFree, chunkSizeServer, hashAlgorithmServer, RequestStrategyAvatar)
}
