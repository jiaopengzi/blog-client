/**
 * @Author       : jiaopengzi
 * @Date         : 2023-10-07 13:55:26
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-10-07 14:36:08
 * @FilePath     : \blog-client\src\api\utils\UploadAvatar.ts
 * @Description  : 上传头像
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved.
 */
// src/api/user/UploadAvatar.ts
import request from '../request'
import type { AxiosPromise } from 'axios'
import { routerGroup } from '../routerGroup'

export interface UploadAvatarResponse {
  code: number
  msg: string
  data: any
}

export function uploadAvatar(formData: FormData): AxiosPromise<UploadAvatarResponse> {
  return request({
    url: routerGroup + '/utils/upload-avatar',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    data: formData,
  })
}
