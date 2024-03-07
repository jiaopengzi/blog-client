/**
 * @Author       : jiaopengzi
 * @Date         : 2024-01-27 16:23:49
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-03-07 09:57:55
 * @FilePath     : \blog-client\src\api\upload\uploadFile.ts
 * @Description  : 上传文件
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import request from '@/api/request'
import type { AxiosPromise, AxiosProgressEvent } from 'axios'
import { routerGroup } from '@/api/routerGroup'

export interface UploadFileResponse {
  code: number
  msg: string
  data: any
}

export function uploadFile(
  formData: FormData,
  progressCallback: (progressEvent: AxiosProgressEvent) => void,
): AxiosPromise<UploadFileResponse> {
  return request({
    url: routerGroup + '/upload/file',
    method: 'post',
    data: formData,
    onUploadProgress: (progressEvent) => {
      // 检查 total 和 loaded 是否已定义
      if (progressCallback && progressEvent.progress !== undefined) {
        progressCallback(progressEvent)
      }
    },
  })
}
