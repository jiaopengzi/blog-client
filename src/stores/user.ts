/**
 * @Author       : jiaopengzi
 * @Date         : 2023-10-09 09:35:45
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-10-15 08:46:47
 * @FilePath     : \blog-client\src\stores\user.ts
 * @Description  : 用户信息
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved.
 */

// @ts-check
import { defineStore, acceptHMRUpdate } from "pinia"
import { ResponseCode, LocalStorageKey } from "@/api/responseCode"
import { type AxiosResponse } from "axios"
import { ShowMsgTip } from "@/utils/message"
import { type LoginRequest } from "@/api/user/login"
import { getAvatarUrl } from "@/utils/avatar"
import { type Res } from "@/api/responseCode"
import { getUserForbiddenMsg } from "@/utils/msg"

import {
    loginAPI,
    // QQ
    loginByQQUrl,
    loginByQQUrlCallback,
    bindQQUrl,
    bindQQUrlCallback,
    unBindQQ,
    // 微信
    loginByWeChatUrl,
    loginByWeChatUrlCallback,
    bindWeChatUrl,
    bindWeChatUrlCallback,
    unBindWeChat,
} from "@/api/user/login"
import type { UserInfo } from "@/api/user/getUserInfo"
import { emptyUserInfo, getUserInfoAPI } from "@/api/user/getUserInfo"
import { PermissionNames } from "@/utils/permissionRole"
import { getRolesByJson } from "@/api/permissionRole/role"

// 用户信息
export interface UserInfoStore {
    data: UserInfo
    isLogin: boolean // 是否登录
    avatar?: string // 头像
    isBindEmail: boolean // 是否绑定邮箱
    showDialogBindEmail?: boolean // 是否显示绑定邮箱弹窗
    permissions?: PermissionNames[] // 权限列表
}

// 创建空值用户信息
function createEmptyUserInfoStore(): UserInfoStore {
    return {
        data: emptyUserInfo(),
        isLogin: false,
        avatar: "",
        isBindEmail: false,
        showDialogBindEmail: false,
        permissions: [],
    }
}

export const useUserStore = defineStore({
    id: "user",
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
            return this.avatar || ""
        },
        // 获取是否显示绑定邮箱弹窗
        getShowDialogBindEmail(): boolean {
            return this.showDialogBindEmail || false
        },
        // 获取权限列表
        getPermissions(): PermissionNames[] {
            return this.permissions || []
        },
    },

    actions: {
        // 设置头像
        setAvatar(avatar: string) {
            this.avatar = avatar
        },

        // 退出登录
        async logout() {
            // localStorage.removeItem(LocalStorageKey.AccessToken)
            localStorage.clear()
            this.$patch(createEmptyUserInfoStore())
            // 重定向到登录页
            window.location.href = "/"
        },

        // 登录
        async login(loginName: string, password: string) {
            const userInfoStore: UserInfoStore = await apiLogin(loginName, password)
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
        // 解绑QQ
        async unBindQQ() {
            const userInfoStore: UserInfoStore = await apiUnBindQQ()
            this.$patch(userInfoStore)
        },
        // 微信登录
        async loginByWeChat() {
            await apiLoginWeChat()
            this.$patch(createEmptyUserInfoStore())
        },

        // 微信登录回调
        async loginByWeChatCallback(code: string) {
            const userInfoStore: UserInfoStore = await apiLoginWeChatCallback(code)
            this.$patch(userInfoStore)
        },
        // 绑定微信
        async bindWeChat() {
            await apiBindWeChat()
            this.$patch(createEmptyUserInfoStore())
        },

        // 微信绑定回调
        async bindWeChatCallback(code: string) {
            const userInfoStore: UserInfoStore = await apiBindWeChatCallback(code)
            this.$patch(userInfoStore)
        },
        // 解绑微信
        async unBindWeChat() {
            const userInfoStore: UserInfoStore = await apiUnBindWeChat()
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

        // 是否具有权限
        hasPermission(permission: PermissionNames): boolean {
            return this.permissions?.includes(permission) || false
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

    const resObj = await handleResponse<Res>(loginAPI(req)) // 使用辅助函数处理请求

    return await handleLoginResult(resObj, ResponseCode.UserLoginSuccess)
}

// QQ登录
async function apiLoginQQ(): Promise<void> {
    await redirectToSocialLogin(loginByQQUrl(), ResponseCode.SocialLoginQQSuccess)
}

// QQ登录回调
async function apiLoginQQCallback(code: string): Promise<UserInfoStore> {
    const resObj: Res = await handleResponse<Res>(loginByQQUrlCallback(code)) // 使用辅助函数处理请求

    return await handleLoginResult(resObj, ResponseCode.SocialLoginQQCallbackSuccess)
}

// 绑定QQ
async function apiBindQQ(): Promise<void> {
    await redirectToSocialLogin(bindQQUrl(), ResponseCode.SocialLoginQQSuccess)
}

// 绑定QQ回调
async function apiBindQQCallback(code: string): Promise<UserInfoStore> {
    const resObj: Res = await handleResponse<Res>(bindQQUrlCallback(code)) // 使用辅助函数处理请求

    return await handleBindResult(resObj, ResponseCode.SocialBindQQCallbackSuccess)
}
// 解绑QQ
async function apiUnBindQQ(): Promise<UserInfoStore> {
    const resObj: Res = await handleResponse<Res>(unBindQQ()) // 使用辅助函数处理请求

    return await handleBindResult(resObj, ResponseCode.SocialUnBindQQSuccess)
}

// 微信登录
async function apiLoginWeChat(): Promise<void> {
    await redirectToSocialLogin(loginByWeChatUrl(), ResponseCode.SocialLoginWeChatSuccess)
}

// 微信登录回调
async function apiLoginWeChatCallback(code: string): Promise<UserInfoStore> {
    const resObj: Res = await handleResponse<Res>(loginByWeChatUrlCallback(code)) // 使用辅助函数处理请求
    return await handleLoginResult(resObj, ResponseCode.SocialLoginWeChatCallbackSuccess)
}

// 绑定微信
async function apiBindWeChat(): Promise<void> {
    await redirectToSocialLogin(bindWeChatUrl(), ResponseCode.SocialLoginWeChatSuccess)
}

// 绑定微信回调
async function apiBindWeChatCallback(code: string): Promise<UserInfoStore> {
    const resObj: Res = await handleResponse<Res>(bindWeChatUrlCallback(code)) // 使用辅助函数处理请求

    return await handleBindResult(resObj, ResponseCode.SocialBindWeChatCallbackSuccess)
}
// 解绑微信
async function apiUnBindWeChat(): Promise<UserInfoStore> {
    const resObj: Res = await handleResponse<Res>(unBindWeChat()) // 使用辅助函数处理请求

    return await handleBindResult(resObj, ResponseCode.SocialUnBindWeChatSuccess)
}

// 从token中获取用户信息
async function apiGetUserInfoByToken(): Promise<UserInfoStore> {
    try {
        const access_token = localStorage.getItem(LocalStorageKey.AccessToken)
        // 如果没有token 则返回空值用户信息
        if (!access_token) {
            return createEmptyUserInfoStore()
        }

        // 通过token获取用户信息
        const resUser = await getUserInfoAPI()
        const { data: dataUser } = resUser.data

        // 获取角色列表
        const resRole = await getRolesByJson()
        const { data: dataRole } = resRole.data

        // 判断是否获取成功
        if (
            resUser.data.code === ResponseCode.UserGetInfoSuccess &&
            resRole.data.code === ResponseCode.GetRoleSuccess
        ) {
            const meta = dataUser.user_meta.find((item) => item.meta_key === "role_name")
            const roleName = meta ? meta.meta_value : undefined

            // 循环 dataRole 获取权限列表
            const permissions: PermissionNames[] = []
            for (const role of dataRole.roles) {
                if (role.role_name === roleName) {
                    for (const permission of role.permission_names) {
                        permissions.push(permission)
                    }
                    break
                }
            }

            return {
                data: dataUser,
                isLogin: true,
                avatar: getAvatarUrl(dataUser),
                isBindEmail: !!dataUser?.user?.user_email,
                showDialogBindEmail: !dataUser?.user?.user_email,
                permissions,
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
    return (await requestPromise).data
}

/**
 * @description: 辅助函数：处理社交登录重定向
 * @param requestPromise 请求对象
 * @param successCode 请求成功的状态码
 * @return {void}
 */
async function redirectToSocialLogin(
    requestPromise: Promise<AxiosResponse<Res>>,
    successCode: ResponseCode,
): Promise<void> {
    const resObj = await handleResponse<Res>(requestPromise) // 使用辅助函数处理请求

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
async function handleLoginResult(resObj: Res, successCode: ResponseCode): Promise<UserInfoStore> {
    if (resObj.code === successCode) {
        // 显示登录成功提示
        ShowMsgTip(ShowMsgTip.MsgType.success, resObj.msg, 3000)

        // 登录成功 存入token
        localStorage.setItem(LocalStorageKey.AccessToken, resObj.data.access_token)

        return await apiGetUserInfoByToken() // 获取用户信息
    }

    // 显示登录失败提示
    // localStorage.removeItem(LocalStorageKey.AccessToken)
    localStorage.clear()

    const msg = getUserForbiddenMsg(resObj)

    ShowMsgTip(ShowMsgTip.MsgType.error, msg, 10000)

    return createEmptyUserInfoStore() // 获取用户信息
}

/**
 * @description: 辅助函数：处理绑定结果
 */
async function handleBindResult(resObj: Res, successCode: ResponseCode): Promise<UserInfoStore> {
    if (resObj.code === successCode) {
        // 显示登录成功提示
        ShowMsgTip(ShowMsgTip.MsgType.success, resObj.msg, 3000)
        return await apiGetUserInfoByToken() // 获取用户信息
    }

    // 显示登录失败提示
    ShowMsgTip(ShowMsgTip.MsgType.error, resObj.msg, 3000)
    // localStorage.removeItem(LocalStorageKey.AccessToken)
    localStorage.clear()
    return createEmptyUserInfoStore() // 获取用户信息
}

// 允许开发环境下进行热更新 HMR(Hot Module Replacement)
if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
}
