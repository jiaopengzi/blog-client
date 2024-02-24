/**
 * @Author       : jiaopengzi
 * @Date         : 2023-10-07 13:55:26
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-01-27 16:29:36
 * @FilePath     : \blog-client\src\api\utils\uploadAvatar.ts
 * @Description  : 上传头像
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved.
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
    url: routerGroup + '/utils/upload-avatar',
    method: 'post',
    data: formData,
  })
}
