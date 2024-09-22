/**
 * @Author       : jiaopengzi
 * @Date         : 2024-09-21 15:23:19
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-09-21 16:18:24
 * @FilePath     : \blog-client\src\api\video\getM3u8.ts
 * @Description  : 获取视频m3u8
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import request from '@/api/request'
import type { AxiosPromise } from 'axios'
import { routerGroup } from '@/api/routerGroup'
import { type Res } from '@/api/responseCode'
import { type PlayLevelItem } from '@/stores/player'

export interface M3u8Response extends Res {
  data: {
    base_url: string
    m3u8: string
  }
}

export function getM3u8API(videoIdLevel: string): AxiosPromise<M3u8Response> {
  return request({
    url: `${routerGroup}/video/${videoIdLevel}`,
    method: 'get',
  })
}
