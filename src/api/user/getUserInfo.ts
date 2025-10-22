/**
 * @FilePath     : \blog-client\src\api\user\getUserInfo.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 获取用户信息
 */

import type { PgSqlDateTime } from "@/api/common"
import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

// 获取用户信息
export function getUserInfoAPI(): ResPromise<Res<UserInfo>> {
    const urlStr = routerGroup + "/user/info"
    return request({
        url: urlStr,
        method: "get",
    })
}

// 用户信息
export interface User {
    id: string
    created_at: string
    updated_at: string
    user_name: string
    user_display_name: string
    user_email: string
    user_avatar: string
    disable_expires_at: string
    post: number
    role: string
}

// 用户元信息
export interface UserMeta {
    // id: number
    // created_at: string
    // updated_at: string
    // deleted_at: string
    user_id: string
    meta_key: string
    meta_value: string
}

// 用户手机号信息
export interface UserMobile {
    // id: number
    // created_at: string
    // updated_at: string
    // deleted_at: string
    user_id: string
    mobile: string
    region: string
}

// 用户qq信息
export interface UserQQ {
    // id: number
    // created_at: string
    // updated_at: string
    // deleted_at: string
    user_id: string
    openid: string
    nickname: string
    sex: string
    province: string
    city: string
    avatar: string
}

// 用户微信信息
export interface UserWechat {
    // id: number
    // created_at: string
    // updated_at: string
    // deleted_at: string
    user_id: string
    openid: string
    unionid: string
    nickname: string
    sex: string
    country: string
    province: string
    city: string
    avatar: string
}

// 会员信息
export interface membership {
    id: string
    created_at: string
    user_id: string
    membership_id: string
    role: string
    expire_time: PgSqlDateTime
}

// 用户信息
export interface UserInfo {
    user: User
    user_meta: UserMeta[]
    user_mobile: UserMobile
    user_qq: UserQQ
    user_wechat: UserWechat
    membership_items: membership[]
}

// 默认的 UserInfo 空对象
export function emptyUserInfo(): UserInfo {
    return {
        user: {
            id: "",
            created_at: "",
            updated_at: "",
            user_avatar: "",
            user_display_name: "",
            user_email: "",
            user_name: "",
            disable_expires_at: "",
            post: 0,
            role: "",
        },
        user_meta: [
            {
                // id: 0,
                // created_at: '',
                // updated_at: '',
                // deleted_at: '',
                user_id: "",
                meta_key: "",
                meta_value: "",
            },
        ],
        user_mobile: {
            // id: 0,
            // created_at: '',
            // updated_at: '',
            // deleted_at: '',
            user_id: "",
            mobile: "",
            region: "",
        },
        user_qq: {
            // id: 0,
            // created_at: '',
            // updated_at: '',
            // deleted_at: '',
            user_id: "",
            openid: "",
            nickname: "",
            sex: "",
            province: "",
            city: "",
            avatar: "",
        },
        user_wechat: {
            // id: 0,
            // created_at: '',
            // updated_at: '',
            // deleted_at: '',
            user_id: "",
            openid: "",
            unionid: "",
            nickname: "",
            sex: "",
            country: "",
            province: "",
            city: "",
            avatar: "",
        },
        membership_items: [
            {
                id: "",
                created_at: "",
                user_id: "",
                membership_id: "",
                role: "",
                expire_time: {
                    Time: null,
                    Valid: false,
                },
            },
        ],
    }
}
