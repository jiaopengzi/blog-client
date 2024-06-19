/**
 * @Author       : jiaopengzi
 * @Date         : 2023-08-12 13:03:36
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-06-19 10:23:39
 * @FilePath     : \blog-client\src\api\user\checkLoginName.ts
 * @Description  : 检查登录名是否存在
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved.
 */

import request from '@/api/request'
import { routerGroup } from '@/api/routerGroup'
import type { AxiosPromise } from 'axios'
import { type Res } from '@/api/responseCode'

export interface CheckLoginNameRequest {
  login_name: string
}

// 检测用户名是否存在
export function checkLoginNameAPI(requestData: CheckLoginNameRequest): AxiosPromise<Res> {
  const urlStr = routerGroup + '/user/check-loginname'
  return request({
    url: urlStr,
    method: 'post',
    data: requestData,
  })
}
