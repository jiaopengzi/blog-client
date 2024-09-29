/**
 * @Author       : jiaopengzi
 * @Date         : 2023-12-01 22:04:48
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-09-29 17:43:43
 * @FilePath     : \blog-client\src\api\upload\setAvatar.ts
 * @Description  : 上传头像
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import request from '@/api/request'
import type { AxiosPromise } from 'axios'
import { routerGroup } from '@/api/routerGroup'
import { type Res } from '@/api/responseCode'

export interface SetAvatarRequest {
  user_id: string // 用户ID
  avatar_url: string // 头像URL
}

export function setAvatarAPI(req: SetAvatarRequest): Promise<Res> {
  return request({
    url: routerGroup + '/upload/avatar/set',
    method: 'post',
    data: req,
  })
}
