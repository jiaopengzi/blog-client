/**
 * @Author       : jiaopengzi
 * @Date         : 2024-09-21 15:21:17
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-09-21 15:22:37
 * @FilePath     : \blog-client\src\api\video\getMainM3u8.ts
 * @Description  : 获取视频主 m3u8
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import request from '@/api/request'
import type { AxiosPromise } from 'axios'
import { routerGroup } from '@/api/routerGroup'
import { type Res } from '@/api/responseCode'

export function getMainM3u8API(videoId: string): AxiosPromise<Res> {
  return request({
    url: `${routerGroup}/video/${videoId}`,
    method: 'get',
  })
}
