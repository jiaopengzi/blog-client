/**
 * @Author       : jiaopengzi
 * @Date         : 2024-09-21 15:33:42
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-09-21 15:43:39
 * @FilePath     : \blog-client\src\api\video\getKey.ts
 * @Description  : 获取播放密钥
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import request from '@/api/request'
import type { AxiosPromise } from 'axios'
import { routerGroup } from '@/api/routerGroup'
import { type Res } from '@/api/responseCode'

export function getKeyAPI(videoId: string): AxiosPromise<Res> {
  return request({
    url: `${routerGroup}/key/${videoId}`,
    method: 'get',
  })
}
