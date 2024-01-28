/**
 * @Author       : jiaopengzi
 * @Date         : 2024-01-27 16:23:49
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-01-27 16:29:29
 * @FilePath     : \blog-client\src\api\utils\uploadFile.ts
 * @Description  :
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import request from '@/api/request'
import type { AxiosPromise } from 'axios'
import { routerGroup } from '@/api/routerGroup'

export interface UploadFileResponse {
  code: number
  msg: string
  data: any
}

export function uploadFile(formData: FormData): AxiosPromise<UploadFileResponse> {
  return request({
    url: routerGroup + '/utils/upload-file',
    method: 'post',
    data: formData,
  })
}
