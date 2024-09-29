/**
 * @Author       : jiaopengzi
 * @Date         : 2024-09-29 10:00:59
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-09-29 11:06:16
 * @FilePath     : \blog-client\src\api\upload\getUploadFileUrl.ts
 * @Description  : 获取上传文件的 url
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import request from '@/api/request'
import { routerGroup } from '@/api/routerGroup'
import type { AxiosPromise } from 'axios'
import { type Res } from '@/api/responseCode'

export interface GetUploadFileUrlRequest {
  file_id: string // 文件 id
}

// 获取上传文件的 url
export function getUploadFileUrlAPI(requestData: GetUploadFileUrlRequest): Promise<Res> {
  const urlStr = routerGroup + '/upload/get-upload-file-url'
  return request({
    url: urlStr,
    method: 'post',
    data: requestData,
  })
}
