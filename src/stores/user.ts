/**
 * @FilePath     : \blog-client\src\stores\user.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 用户信息 store
 */

import { acceptHMRUpdate, defineStore } from "pinia"

import { SocialLoginType } from "@/api/common"
import { type Res, ResponseCode, type ResResponse } from "@/api/response"
import { emptyUserInfo, getUserInfoAPI, type UserInfo } from "@/api/user/getUserInfo"
import { loginAPI, type LoginRequest } from "@/api/user/login"
import { socialBind, socialBindCallback, socialLogin, socialLoginCallback, socialUnBind } from "@/api/user/socialLogin"
import { LocalStorageKey } from "@/stores/local"
import { PermissionNames } from "@/stores/permissionRole"
import { getAvatarUrl } from "@/utils/avatar"
import { MessageUtil } from "@/utils/message"
import { getUserForbiddenMsg } from "@/utils/msg"

import { usePermissionRoleStore } from "./permissionRole"

// 用户信息
export interface UserInfoStore {
    data: UserInfo
    isLogin: boolean // 是否登录
    avatar?: string // 头像
    isBindEmail: boolean // 是否绑定邮箱
    showDialogBindEmail?: boolean // 是否显示绑定邮箱弹窗
    permissions?: PermissionNames[] // 权限列表
    isEditing?: boolean // 是否正在编辑
    isSetupDB: boolean // 是否已经设置数据库
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
        isEditing: false,
        isSetupDB: true,
    }
}

export const useUserStore = defineStore("user", {
    state: () => createEmptyUserInfoStore(),

    getters: {
        // 获取用户ID
        getUserID(): string {
            return this.data.user.id
        },

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

        // 获取是否正在编辑
        getIsEditing(): boolean {
            return this.isEditing || false
        },

        // 获取是否已经设置数据库
        getIsSetupDB(): boolean {
            return this.isSetupDB
        },
    },

    actions: {
        // 设置头像
        setAvatar(avatar: string) {
            this.avatar = avatar
        },

        // 退出登录
        async logout() {
            localStorageClearByLogout()
            this.$patch(createEmptyUserInfoStore())
            // 重定向到登录页
            window.location.href = "/"
        },

        // 登录
        async login(loginName: string, password: string) {
            const userInfoStore: UserInfoStore = await apiLogin(loginName, password)
            this.$patch(userInfoStore)
        },

        // 社交登录
        async socialLogin(loginType: SocialLoginType) {
            await redirectToSocialLogin(socialLogin(loginType), ResponseCode.SocialLoginSuccess)
        },

        // 社交登录回调
        async socialLoginCallback(code: string, loginType: SocialLoginType) {
            const resObj = await handleResponse<Res<unknown>>(socialLoginCallback(code, loginType))
            const userInfoStore = await handleLoginResult(resObj, ResponseCode.SocialLoginCallbackSuccess)

            this.$patch(userInfoStore)
        },

        // 社交绑定
        async socialBind(loginType: SocialLoginType) {
            await redirectToSocialLogin(socialBind(loginType), ResponseCode.SocialLoginSuccess)
        },

        // 社交绑定回调
        async socialBindCallback(code: string, loginType: SocialLoginType) {
            const resObj = await handleResponse<Res<unknown>>(socialBindCallback(code, loginType))
            const userInfoStore = await handleBindResult(resObj, ResponseCode.SocialBindCallbackSuccess)

            this.$patch(userInfoStore)
        },

        // 社交解绑
        async socialUnBind(loginType: SocialLoginType) {
            const resObj = await handleResponse<Res<unknown>>(socialUnBind(loginType))

            const userInfoStore = await handleBindResult(resObj, ResponseCode.SocialUnBindSuccess)

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

        // 设置是否正在编辑
        setIsEditing(isEditing: boolean) {
            this.isEditing = isEditing
        },

        // 设置是否已经设置数据库
        setIsSetupDB(isSetupDB: boolean) {
            this.isSetupDB = isSetupDB
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

    const resObj = await handleResponse<Res<unknown>>(loginAPI(req)) // 使用辅助函数处理请求

    return await handleLoginResult(resObj, ResponseCode.UserLoginSuccess)
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
        const permissionRoleStore = usePermissionRoleStore()
        const dataRole = permissionRoleStore.getSystemRoles

        // 判断是否获取成功
        if (resUser.data.code === ResponseCode.UserGetInfoSuccess && dataRole.roles.length > 0) {
            const meta = dataUser.user_meta.find((item) => item.meta_key === "role_name")
            const roleName = meta ? meta.meta_value : void 0

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
                isSetupDB: true,
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
async function handleResponse<T>(requestPromise: Promise<ResResponse<T>>): Promise<T> {
    return (await requestPromise).data
}

/**
 * @description: 辅助函数：处理社交登录重定向
 * @param requestPromise 请求对象
 * @param successCode 请求成功的状态码
 * @return {void}
 */
async function redirectToSocialLogin(requestPromise: Promise<ResResponse<Res<string>>>, successCode: ResponseCode): Promise<void> {
    const resObj = await handleResponse<Res<string>>(requestPromise) // 使用辅助函数处理请求

    if (resObj.code === successCode) {
        window.location.href = resObj.data // 重定向到第社交登录页面
    }
}

/**
 * @description: 辅助函数：处理登录结果
 * @param resObj 请求对象
 * @param successCode 请求成功的状态码
 * @return {UserInfoStore} 用户信息
 */
async function handleLoginResult(resObj: Res<unknown>, successCode: ResponseCode): Promise<UserInfoStore> {
    if (resObj.code === successCode) {
        // 显示登录成功提示
        MessageUtil.success(resObj.msg, 3000)

        // 登录成功 存入token
        if (typeof resObj.data === "object" && resObj.data !== null && "access_token" in resObj.data) {
            localStorage.setItem(LocalStorageKey.AccessToken, (resObj.data as { access_token: string }).access_token)
        }

        return await apiGetUserInfoByToken() // 获取用户信息
    }

    // 显示登录失败提示
    localStorageClearByLogout()

    const msg = getUserForbiddenMsg(resObj as Res<number>)

    MessageUtil.error(msg, 10000)

    return createEmptyUserInfoStore() // 获取用户信息
}

/**
 * @description: 辅助函数：处理绑定结果
 */
async function handleBindResult(resObj: Res<unknown>, successCode: ResponseCode): Promise<UserInfoStore> {
    if (resObj.code === successCode) {
        // 显示登录成功提示
        MessageUtil.success(resObj.msg, 3000)
        return await apiGetUserInfoByToken() // 获取用户信息
    }

    // 显示登录失败提示
    MessageUtil.error(resObj.msg, 3000)

    localStorageClearByLogout()
    return createEmptyUserInfoStore() // 获取用户信息
}

// 退出登录的时候清除对应 localStorage
function localStorageClearByLogout() {
    localStorage.removeItem(LocalStorageKey.AccessToken)
}

// 允许开发环境下进行热更新 HMR(Hot Module Replacement)
if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
}
