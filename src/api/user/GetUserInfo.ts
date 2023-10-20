/**
 * @Author       : jiaopengzi
 * @Date         : 2023-10-04 14:44:00
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-10-20 23:29:34
 * @FilePath     : \blog-client\src\api\user\GetUserInfo.ts
 * @Description  : 获取用户信息
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved.
 */

import request from '../request'
import { routerGroup } from '../routerGroup'
import type { AxiosPromise } from 'axios'

export interface GetUserInfoResponse {
  code: number
  msg: string
  data: UserInfo // 您可以根据实际返回的数据结构替换为更具体的类型
}

// 注册
export function getUserInfoByJosn(): AxiosPromise<GetUserInfoResponse> {
  const urlStr = routerGroup + '/user/info'
  return request({
    url: urlStr,
    method: 'post',
  })
}

// 用户信息
export interface UserInfo {
  user: {
    created_at: string
    id: number
    updated_at: string
    user_avatar: string
    user_display_name: string
    user_email: string
    user_name: string
    user_status: number
  }
  user_meta: [
    {
      created_at: string
      id: number
      updated_at: string
      user_id: number
      meta_key: string
      meta_value: string
    }
  ]
  user_mobile: {
    created_at: string
    id: number
    updated_at: string
    user_id: number
    mobile: string
    region: string
  }
  user_qq: {
    created_at: string
    id: number
    updated_at: string
    user_id: number
    openid: string
    nickname: string
    sex: string
    province: string
    city: string
    avatar: string
  }
  user_wechat: {
    created_at: string
    id: number
    updated_at: string
    userID: number
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
      created_at: '',
      id: 0,
      updated_at: '',
      user_avatar: '',
      user_display_name: '',
      user_email: '',
      user_name: '',
      user_status: 0,
    },
    user_meta: [
      {
        created_at: '',
        id: 0,
        updated_at: '',
        user_id: 0,
        meta_key: '',
        meta_value: '',
      },
    ],
    user_mobile: {
      created_at: '',
      id: 0,
      updated_at: '',
      user_id: 0,
      mobile: '',
      region: '',
    },
    user_qq: {
      created_at: '',
      id: 0,
      updated_at: '',
      user_id: 0,
      openid: '',
      nickname: '',
      sex: '',
      province: '',
      city: '',
      avatar: '',
    },
    user_wechat: {
      created_at: '',
      id: 0,
      updated_at: '',
      userID: 0,
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
