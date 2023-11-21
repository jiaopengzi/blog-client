/**
 * @Author       : jiaopengzi
 * @Date         : 2023-10-04 14:44:00
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-10-29 20:00:00
 * @FilePath     : \blog-client\src\api\user\getUserInfo.ts
 * @Description  : 获取用户信息
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved.
 */

import request from '@/api/request'
import { routerGroup } from '@/api/routerGroup'
import type { AxiosPromise } from 'axios'

export interface GetUserInfoResponse {
  code: number
  msg: string
  data: UserInfo // 您可以根据实际返回的数据结构替换为更具体的类型
}

// 获取用户信息
export function getUserInfoByJosn(): AxiosPromise<GetUserInfoResponse> {
  const urlStr = routerGroup + '/user/info'
  return request({
    url: urlStr,
    method: 'get',
  })
}

// 用户信息
export interface UserInfo {
  user: {
    id: number
    created_at: string
    updated_at: string
    user_avatar: string
    user_display_name: string
    user_email: string
    user_name: string
    user_status: number
  }
  user_meta: [
    {
      id: number
      created_at: string
      updated_at: string
      deleted_at: string
      user_id: number
      meta_key: string
      meta_value: string
    }
  ]
  user_mobile: {
    id: number
    created_at: string
    updated_at: string
    deleted_at: string
    user_id: number
    mobile: string
    region: string
  }
  user_qq: {
    id: number
    created_at: string
    updated_at: string
    deleted_at: string
    user_id: number
    openid: string
    nickname: string
    sex: string
    province: string
    city: string
    avatar: string
  }
  user_wechat: {
    id: number
    created_at: string
    updated_at: string
    deleted_at: string
    user_id: number
    openid: string
    unionid: string
    nickname: string
    sex: string
    country: string
    province: string
    city: string
    avatar: string
  }
}

// 默认的 UserInfo 空对象
export function emptyUserInfo(): UserInfo {
  return {
    user: {
      id: 0,
      created_at: '',
      updated_at: '',
      user_avatar: '',
      user_display_name: '',
      user_email: '',
      user_name: '',
      user_status: 0,
    },
    user_meta: [
      {
        id: 0,
        created_at: '',
        updated_at: '',
        deleted_at: '',
        user_id: 0,
        meta_key: '',
        meta_value: '',
      },
    ],
    user_mobile: {
      id: 0,
      created_at: '',
      updated_at: '',
      deleted_at: '',
      user_id: 0,
      mobile: '',
      region: '',
    },
    user_qq: {
      id: 0,
      created_at: '',
      updated_at: '',
      deleted_at: '',
      user_id: 0,
      openid: '',
      nickname: '',
      sex: '',
      province: '',
      city: '',
      avatar: '',
    },
    user_wechat: {
      id: 0,
      created_at: '',
      updated_at: '',
      deleted_at: '',
      user_id: 0,
      openid: '',
      unionid: '',
      nickname: '',
      sex: '',
      country: '',
      province: '',
      city: '',
      avatar: '',
    },
  }
}
