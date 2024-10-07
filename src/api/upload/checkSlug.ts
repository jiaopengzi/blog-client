/**
 * @Author       : jiaopengzi
 * @Date         : 2024-10-07 09:29:08
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-10-07 09:30:55
 * @FilePath     : \blog-client\src\api\upload\checkSlug.ts
 * @Description  : 检验 slug 是否可用
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import request from '@/api/request'
import { routerGroup } from '@/api/routerGroup'
import { type Res } from '@/api/responseCode'

export interface CheckSlugRequest {
  file_id: string // 文件 id
  slug: string // slug
}

// 检验 slug 是否可用
export function checkSlugAPI(requestData: CheckSlugRequest): Promise<Res> {
  const urlStr = routerGroup + '/upload/check-slug'
  return request({
    url: urlStr,
    method: 'post',
    data: requestData,
  })
}
