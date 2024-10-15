/**
 * @Author       : jiaopengzi
 * @Date         : 2024-03-20 16:30:57
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-10-15 09:04:01
 * @FilePath     : \blog-client\src\api\user\getUsers.ts
 * @Description  : 获取用户信息
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import request from '@/api/request'
import { routerGroup } from '@/api/routerGroup'
import type { AxiosPromise } from 'axios'
import type { DataWithImg, Pagination } from '@/components/common'
import { ResponseCode } from '@/api/responseCode'
import { ImgFit } from '@/components/common/index'
import { convertToBeijingTime } from '@/utils/dateTime'

export interface GetUsersRequest {
  current_page: number // 当前页
  page_size: number // 每页显示条数
  key_word?: string // 关键字
  role_name?: string // 角色
}

// 获取用户信息响应类型
export interface GetUsersResponse {
  code: number
  msg: string
  data: Pagination<User> // 您可以根据实际返回的数据结构替换为更具体的类型
}

// 获取用户信息 api 函数
export async function getUsersAPI(
  requestData: GetUsersRequest = { current_page: 1, page_size: 10 }, // 设置默认值,
  width: number = 30, // 默认值 50px
  height: number = 30, // 默认值 50px
  imgFit: ImgFit = ImgFit.Cover
): AxiosPromise<GetUsersResponse> {
  const urlStr = routerGroup + '/user/view'
  const response = await request({
    url: urlStr,
    method: 'post',
    data: requestData
  })
  // 在这里使用 map 函数来转换每个用户对象
  if (response.data.code === ResponseCode.UserGetAllSuccess) {
    response.data.data.records = response.data.data.records.map((user: any) =>
      formatUser(user, width, height, imgFit)
    )
    return response
  } else {
    response.data.data = emptyUsers()
    return response
  }
}

// 每行用户信息
export interface User extends DataWithImg {
  id: number // 用户 ID
  user_name: string // 用户名
  user_display_name: string // 昵称
  user_email: string // 邮箱
  role: string // 角色
  disable_expires_at: {
    Time: Date | null // 禁用到期时间
    Valid: boolean
  }
  post: number // 文章数量
  created_at: string // 注册时间
  user_avatar: string // 用户头像
}

/**
 * @description: 格式化用户信息
 * @param User 后端用户信息
 * @param width 图片宽度
 * @param height 图片高度
 * @param imgFit 图片填充方式
 * @return  {User} 格式化后的用户信息
 */
export function formatUser(
  { user_avatar, created_at, ...user }: any,
  width: number,
  height: number,
  imgFit: ImgFit
): User {
  const formattedUser: User = {
    ...user,
    created_at: convertToBeijingTime(created_at) // 使用 convertToBeijingTime 进行格式化
  }

  // 如果 user_avatar 不为空，添加 img 属性
  if (user_avatar) {
    formattedUser.img = {
      url: user_avatar,
      width: width,
      height: height,
      imgFit: imgFit
    }
  }

  return formattedUser
}

// 默认的 UserInfo 空对象
export function emptyUsers(): Pagination<User> {
  return {
    total: 0,
    current_page: 1,
    page_size: 10,
    page_count: 1,
    page_sizes: [10],
    records: []
  }
}
