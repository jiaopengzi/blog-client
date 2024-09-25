/**
 * @Author       : jiaopengzi
 * @Date         : 2024-08-12 17:20:29
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-08-12 17:24:08
 * @FilePath     : \blog-client\src\api\upload\confirmAfterUploadBySignedUrl.ts
 * @Description  : 使用 签名URL 上传文件 后确认
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import request from '@/api/request'
import type { AxiosPromise } from 'axios'
import { routerGroup } from '@/api/routerGroup'
import { type Res } from '@/api/responseCode'

// ConfirmAfterUploadBySignedUrlRequest
// 使用 签名URL 上传文件 后确认请求
export interface ConfirmAfterUploadBySignedUrlRequest {
  file_id: string // 文件ID
}

// 普通文件使用 签名URL 上传文件 后确认
export function confirmAfterUploadBySignedUrlAPI(
  requestData: ConfirmAfterUploadBySignedUrlRequest,
): AxiosPromise<Res> {
  return request({
    url: routerGroup + '/upload/confirm-after-upload-by-signed-url',
    method: 'post',
    data: requestData,
  })
}

// 头像使用 签名URL 上传文件 后确认
export function confirmAfterUploadBySignedUrlAvatarAPI(
  requestData: ConfirmAfterUploadBySignedUrlRequest,
): AxiosPromise<Res> {
  return request({
    url: routerGroup + '/upload/avatar/confirm-after-upload-by-signed-url',
    method: 'post',
    data: requestData,
  })
}
