/**
 * @FilePath     : \blog-client\src\api\user\getUserInfo.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 获取用户信息
 */

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

// 用户信息
export interface UserInfo {
    user: User
    user_meta: [
        {
            // id: number
            // created_at: string
            // updated_at: string
            // deleted_at: string
            user_id: number
            meta_key: string
            meta_value: string
        },
    ]
    user_mobile: {
        // id: number
        // created_at: string
        // updated_at: string
        // deleted_at: string
        user_id: number
        mobile: string
        region: string
    }
    user_qq: {
        // id: number
        // created_at: string
        // updated_at: string
        // deleted_at: string
        user_id: number
        openid: string
        nickname: string
        sex: string
        province: string
        city: string
        avatar: string
    }
    user_wechat: {
        // id: number
        // created_at: string
        // updated_at: string
        // deleted_at: string
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
                user_id: 0,
                meta_key: "",
                meta_value: "",
            },
        ],
        user_mobile: {
            // id: 0,
            // created_at: '',
            // updated_at: '',
            // deleted_at: '',
            user_id: 0,
            mobile: "",
            region: "",
        },
        user_qq: {
            // id: 0,
            // created_at: '',
            // updated_at: '',
            // deleted_at: '',
            user_id: 0,
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
            user_id: 0,
            openid: "",
            unionid: "",
            nickname: "",
            sex: "",
            country: "",
            province: "",
            city: "",
            avatar: "",
        },
    }
}
