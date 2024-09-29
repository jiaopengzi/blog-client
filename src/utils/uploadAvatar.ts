/**
 * @Author       : jiaopengzi
 * @Date         : 2024-09-25 19:55:27
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-09-29 11:26:37
 * @FilePath     : \blog-client\src\utils\uploadAvatar.ts
 * @Description  : 上传头像
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */
// src/utils/uploadAvatarService.ts

import { RequestStrategyAvatar } from '@/utils/requestStrategyAvatar'
import { uploadCommon } from './uploadCommon'
import { type UploadRequestOptions } from 'element-plus'
import { HashAlgorithm } from '@/utils/hash'

export const uploadFile = async (
  options: UploadRequestOptions,
  isEncrypt: boolean = true,
  isNoFree: boolean = true,
  chunkSizeServer = 1024 * 1024 * 10,
  hashAlgorithmServer: HashAlgorithm = HashAlgorithm.SHA256,
): Promise<string | undefined> => {
  return await uploadCommon(
    options,
    isEncrypt,
    isNoFree,
    chunkSizeServer,
    hashAlgorithmServer,
    RequestStrategyAvatar,
  )
}
