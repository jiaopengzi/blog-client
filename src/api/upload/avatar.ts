/**
 * @Author       : jiaopengzi
 * @Date         : 2023-12-01 22:04:48
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-06-19 12:45:05
 * @FilePath     : \blog-client\src\api\upload\avatar.ts
 * @Description  : 上传头像
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import request from '@/api/request'
import type { AxiosPromise } from 'axios'
import { routerGroup } from '@/api/routerGroup'
import { type Res } from '@/api/responseCode'

export function uploadAvatarAPI(requestData: FormData): AxiosPromise<Res> {
  return request({
    url: routerGroup + '/upload/avatar',
    method: 'post',
    data: requestData,
    headers: {
      'Content-Type': 'multipart/form-data', // 上传文件时指定类型
    },
  })
}
