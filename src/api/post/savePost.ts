/**
 * @Author       : jiaopengzi
 * @Date         : 2024-01-10 17:17:58
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-01-10 17:38:06
 * @FilePath     : \blog-client\src\api\post\savePost.ts
 * @Description  : 保存文章
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import request from '@/api/request'
import { routerGroup } from '@/api/routerGroup'
import type { AxiosPromise } from 'axios'

export interface savePostRequest {
  post: string
  title: string
  tags: string
  category: string
  summary: string
  content: string
  status: string
  isComment: string
  isTop: string
  isOriginal: string
  isPrivate: string
  password: string
  views: string
  likes: string
}

export interface savePostResponse {
  code: number
  msg: string
  data: any // 您可以根据实际返回的数据结构替换为更具体的类型
}

// 注册
export function RegisterByJosn(requestData: savePostRequest): AxiosPromise<savePostResponse> {
  const urlStr = routerGroup + '/post/save'
  return request({
    url: urlStr,
    method: 'post',
    data: requestData,
  })
}
