/**
 * @Author       : jiaopengzi
 * @Date         : 2024-01-27 16:23:49
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-08-04 14:58:05
 * @FilePath     : \blog-client\src\api\upload\file.ts
 * @Description  : 上传文件
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import request from '@/api/request'
import type { AxiosPromise, AxiosProgressEvent } from 'axios'
import { routerGroup } from '@/api/routerGroup'
import { type Res } from '@/api/responseCode'

export function uploadFileAPI(
  formData: FormData,
  progressCallback: (progressEvent: AxiosProgressEvent) => void,
): AxiosPromise<Res> {
  return request({
    url: routerGroup + '/upload/file',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data', // 上传文件时指定类型
    },
    onUploadProgress: (progressEvent) => {
      // 检查 total 和 loaded 是否已定义
      if (progressCallback && progressEvent.progress !== undefined) {
        progressCallback(progressEvent)
      }
    },
  })
}
