/**
 * @Author       : jiaopengzi
 * @Date         : 2024-09-29 10:52:39
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-09-30 10:56:54
 * @FilePath     : \blog-client\src\components\common\avatar-upload\uploadAvatar.ts
 * @Description  : 上传头像
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
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
