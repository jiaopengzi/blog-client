/**
 * @Author       : jiaopengzi
 * @Date         : 2023-12-01 22:04:48
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-03-07 09:57:34
 * @FilePath     : \blog-client\src\api\upload\uploadAvatar.ts
 * @Description  : 上传头像
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import request from '@/api/request'
import type { AxiosPromise } from 'axios'
import { routerGroup } from '@/api/routerGroup'

export interface UploadAvatarResponse {
  code: number
  msg: string
  data: any
}

export function uploadAvatar(formData: FormData): AxiosPromise<UploadAvatarResponse> {
  return request({
    url: routerGroup + '/upload/avatar',
    method: 'post',
    data: formData,
  })
}
