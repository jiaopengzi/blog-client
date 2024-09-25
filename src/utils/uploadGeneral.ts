/**
 * @Author       : jiaopengzi
 * @Date         : 2024-09-25 20:18:37
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-09-25 20:19:40
 * @FilePath     : \blog-client\src\utils\uploadGeneral.ts
 * @Description  : 通用文件上传
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import { RequestStrategyGeneral } from '@/utils/requestStrategyGeneral'
import { uploadCommon } from './uploadCommon'
import { type UploadRequestOptions } from 'element-plus'
import { HashAlgorithm } from '@/utils/hash'

export const uploadFile = async (
  options: UploadRequestOptions,
  isEncrypt: boolean = true,
  isNoFree: boolean = true,
  chunkSizeServer = 1024 * 1024 * 10,
  hashAlgorithmServer: HashAlgorithm = HashAlgorithm.SHA256,
) => {
  await uploadCommon(
    options,
    isEncrypt,
    isNoFree,
    chunkSizeServer,
    hashAlgorithmServer,
    RequestStrategyGeneral,
  )
}
