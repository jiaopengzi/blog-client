/**
 * @Author       : jiaopengzi
 * @Date         : 2023-10-09 09:35:45
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-10-22 11:32:22
 * @FilePath     : \blog-client\src\stores\user.ts
 * @Description  : 用户信息
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved.
 */

// @ts-check
import { defineStore, acceptHMRUpdate } from 'pinia'
import { ResponseCode, LocalStorageKey } from '@/api/responseCode'
import type { AxiosResponse } from 'axios'
import { ShowMsgTip } from '@/utils/Message'
import { MsgType } from '@/components/common/index'
import type { LoginRequest, LoginResponse } from '@/api/user/Login'
import {
  loginByJosn,
  loginByWechatUrl,
  loginByWechatUrlCallback,
  loginByQQUrl,
  bindQQUrl,
  unBindQQ,
  loginByQQUrlCallback,
  bindQQUrlCallback,
} from '@/api/user/Login'
import type { GetUserInfoResponse, UserInfo } from '@/api/user/GetUserInfo'
import { emptyUserInfo } from '@/api/user/GetUserInfo'
import { getUserInfoByJosn } from '@/api/user/GetUserInfo'

// 用户信息
interface UserInfoStore {
  data: UserInfo
  isLogin: boolean // 是否登录
  avatar?: string // 头像 优先使用data.user.user_avatar 如果没有则使用 data.user_qq.avatar 或者 data.user_wechat.Avatar
  isBindEmail: boolean // 是否绑定邮箱
  showDialogBindEmail?: boolean // 是否显示绑定邮箱弹窗
}

// 创建空值用户信息
function createEmptyUserInfoStore(): UserInfoStore {
  return {
    data: emptyUserInfo(),
    isLogin: false,
    avatar: '',
    isBindEmail: false,
    showDialogBindEmail: false,
  }
}

export const useUserStore = defineStore({
  id: 'user',
  state: () => createEmptyUserInfoStore(),

  getters: {
    // 获取用户信息
    getUserData(): UserInfo {
      return this.data
    },
    // 获取登录状态
    getIsLogin(): boolean {
      return this.isLogin
    },
    // 获取是否绑定邮箱
    getIsBindEmail(): boolean {
      return this.isBindEmail
    },
    // 获取头像
    getAvatar(): string {
      return this.avatar || ''
    },
    // 获取是否显示绑定邮箱弹窗
    getShowDialogBindEmail(): boolean {
      return this.showDialogBindEmail || false
    },
  },

  actions: {
    // 退出登录
    async logout() {
      localStorage.removeItem(LocalStorageKey.AccessToken)
      this.$patch(createEmptyUserInfoStore())
      // 重定向到登录页
      window.location.href = '/'
    },

    // 登录
    async login(loginName: string, password: string) {
      const userInfoStore: UserInfoStore = await apiLogin(loginName, password)
      this.$patch(userInfoStore)
    },

    // 微信登录
    async loginByWechat() {
      await apiLoginWechat()
      this.$patch(createEmptyUserInfoStore())
    },

    // 微信登录回调
    async loginByWechatCallback(code: string) {
      const userInfoStore: UserInfoStore = await apiLoginWechatCallback(code)
      this.$patch(userInfoStore)
    },

    // QQ登录
    async loginByQQ() {
      await apiLoginQQ()
      this.$patch(createEmptyUserInfoStore())
    },

    // QQ登录回调
    async loginByQQCallback(code: string) {
      const userInfoStore: UserInfoStore = await apiLoginQQCallback(code)
      this.$patch(userInfoStore)
    },

    // 绑定QQ
    async bindQQ() {
      await apiBindQQ()
      this.$patch(createEmptyUserInfoStore())
    },

    // QQ绑定回调
    async bindQQCallback(code: string) {
      const userInfoStore: UserInfoStore = await apiBindQQCallback(code)
      this.$patch(userInfoStore)
    },

    async unBindQQ() {
      const userInfoStore: UserInfoStore = await apiUnBindQQ()
      this.$patch(userInfoStore)
    },

    // 从token中获取用户信息
    /**
     * @description: 通过 token 获取用户信息
     * @param IsUpdate 是否强制从服务器获取用户信息 默认为 false
     * @return
     */
    async getUserInfoByToken(IsUpdate: boolean = false) {
      if (this.isLogin && !IsUpdate) {
        return
      }
      const userInfoStore: UserInfoStore = await apiGetUserInfoByToken()

      this.$patch(userInfoStore)
    },
    // 修改是否显示绑定邮箱弹窗
    async changeShowDialogBindEmail(status: boolean) {
      this.showDialogBindEmail = status
    },
  },
})

/**
 * @description: 账号密码登录
 * @param loginName 用户名
 * @param password 密码
 * @return {UserInfoStore} 用户信息
 */
async function apiLogin(loginName: string, password: string): Promise<UserInfoStore> {
  const req: LoginRequest = {
    login_name: loginName,
    password: password,
  }

  // const requestData: string = JSON.stringify(req) // 将请求对象 req 转换为字符串
  const resObj: LoginResponse = await handleResponse<LoginResponse>(loginByJosn(req)) // 使用辅助函数处理请求

  return await handleLoginResult(resObj, ResponseCode.UserLoginSuccess)
}

// 微信登录
async function apiLoginWechat(): Promise<void> {
  await redirectToSocialLogin(loginByWechatUrl(), ResponseCode.SocialLoginWechatSuccess)
}

// 微信登录回调
async function apiLoginWechatCallback(code: string): Promise<UserInfoStore> {
  const resObj: LoginResponse = await handleResponse<LoginResponse>(loginByWechatUrlCallback(code)) // 使用辅助函数处理请求

  return await handleLoginResult(resObj, ResponseCode.SocialLoginWechatCallbackSuccess)
}

// QQ登录
async function apiLoginQQ(): Promise<void> {
  await redirectToSocialLogin(loginByQQUrl(), ResponseCode.SocialLoginQQSuccess)
}

// QQ登录回调
async function apiLoginQQCallback(code: string): Promise<UserInfoStore> {
  const resObj: LoginResponse = await handleResponse<LoginResponse>(loginByQQUrlCallback(code)) // 使用辅助函数处理请求

  return await handleLoginResult(resObj, ResponseCode.SocialLoginQQCallbackSuccess)
}

// 绑定QQ
async function apiBindQQ(): Promise<void> {
  await redirectToSocialLogin(bindQQUrl(), ResponseCode.SocialLoginQQSuccess)
}

// 绑定QQ回调
async function apiBindQQCallback(code: string): Promise<UserInfoStore> {
  const resObj: LoginResponse = await handleResponse<LoginResponse>(bindQQUrlCallback(code)) // 使用辅助函数处理请求

  return await handleBindResult(resObj, ResponseCode.SocialBindQQCallbackSuccess)
}

async function apiUnBindQQ(): Promise<UserInfoStore> {
  const resObj: LoginResponse = await handleResponse<LoginResponse>(unBindQQ()) // 使用辅助函数处理请求

  return await handleBindResult(resObj, ResponseCode.SocialUnBindQQSuccess)
}

// 从token中获取用户信息
async function apiGetUserInfoByToken(): Promise<UserInfoStore> {
  try {
    const res: AxiosResponse = await getUserInfoByJosn()
    const resStr: string = JSON.stringify(res)
    const resObj: GetUserInfoResponse = JSON.parse(resStr).data

    if (resObj.code === ResponseCode.UserGetInfoSuccess) {
      return {
        data: resObj.data,
        isLogin: true,
        avatar:
          resObj.data?.user?.user_avatar ||
          resObj.data?.user_wechat?.avatar ||
          resObj.data?.user_qq?.avatar ||
          '',
        isBindEmail: !!resObj.data?.user?.user_email, // 是否绑定邮箱
        showDialogBindEmail: !resObj.data?.user?.user_email, // 是否显示绑定邮箱弹窗
      }
    }
  } catch (err: unknown) {
    console.error(err)
  }

  return createEmptyUserInfoStore()
}

/**
 * @description: 辅助函数：处理请求并解析数据
 * @param requestPromise 请求对象
 * @return  {T} 返回解析后的数据
 */
async function handleResponse<T>(requestPromise: Promise<AxiosResponse<T>>): Promise<T> {
  const response = await requestPromise
  const responseString = JSON.stringify(response)
  return JSON.parse(responseString).data
}

/**
 * @description: 辅助函数：处理社交登录重定向
 * @param requestPromise 请求对象
 * @param successCode 请求成功的状态码
 * @return {void}
 */
async function redirectToSocialLogin(
  requestPromise: Promise<AxiosResponse<LoginResponse>>,
  successCode: ResponseCode
): Promise<void> {
  const resObj: LoginResponse = await handleResponse<LoginResponse>(requestPromise) // 使用辅助函数处理请求

  if (resObj.code === successCode) {
    window.location.href = resObj.data // 重定向到第三方登录页面
  }
}

/**
 * @description: 辅助函数：处理登录结果
 * @param resObj 请求对象
 * @param successCode 请求成功的状态码
 * @return {UserInfoStore} 用户信息
 */
async function handleLoginResult(
  resObj: LoginResponse,
  successCode: ResponseCode
): Promise<UserInfoStore> {
  console.log(resObj.code)
  if (resObj.code === successCode) {
    // 显示登录成功提示
    ShowMsgTip(MsgType.success, resObj.msg, 3000)

    // 登录成功 存入token
    localStorage.setItem(LocalStorageKey.AccessToken, resObj.data.access_token)

    return await apiGetUserInfoByToken() // 获取用户信息
  }

  // 显示登录失败提示
  localStorage.removeItem(LocalStorageKey.AccessToken)
  ShowMsgTip(MsgType.error, resObj.msg, 3000)
  return createEmptyUserInfoStore() // 获取用户信息
}

async function handleBindResult(
  resObj: LoginResponse,
  successCode: ResponseCode
): Promise<UserInfoStore> {
  console.log(resObj.code)
  if (resObj.code === successCode) {
    // 显示登录成功提示
    ShowMsgTip(MsgType.success, resObj.msg, 3000)
    return await apiGetUserInfoByToken() // 获取用户信息
  }

  // 显示登录失败提示
  ShowMsgTip(MsgType.error, resObj.msg, 3000)
  localStorage.removeItem(LocalStorageKey.AccessToken)
  return createEmptyUserInfoStore() // 获取用户信息
}

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
}
