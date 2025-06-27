/**
 * @FilePath     : \blog-client\src\components\hooks\useAccountFormValidation\api\user.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 用户相关API
 */

import { ResponseCode } from "@/api/response"
import { checkEmailAPI, type CheckEmailRequest } from "@/api/user/checkEmail"
import { checkEmailExcludingUserIDAPI, type CheckEmailExcludingUserIDRequest } from "@/api/user/checkEmailExcludingUserID"
import { checkUserNameAPI, type CheckUserNameRequest } from "@/api/user/checkUserName"
import { checkUserNameExcludingUserIDAPI, type CheckUserNameExcludingUserIDRequest } from "@/api/user/checkUserNameExcludingUserID"
import { getDisableExpiresAtSecondsAPI, type GetDisableExpiresAtSecondsRequest } from "@/api/user/getDisableExpiresAtSeconds"
import { getUserForbiddenMsg } from "@/utils/msg"

/**
 * @description: 用户名校验规则
 * @param {string} userName 用户名
 */
export async function checkUserName(userName: string): Promise<void> {
    try {
        const req: CheckUserNameRequest = {
            user_name: userName,
        }

        const { data } = await checkUserNameAPI(req)

        if (data.code === ResponseCode.UserNameExist) {
            throw new Error(data.msg)
        }
    } catch (err: unknown) {
        console.error(err)
        throw err
    }
}

/**
 * @description: 用户名查重 异步函数，排除指定用户ID
 * @param {string} excludingUserID 排除的用户ID
 * @param {string} userName 用户名
 */
export async function checkUserNameExcludingUserID(excludingUserID: string, userName: string): Promise<void> {
    try {
        const req: CheckUserNameExcludingUserIDRequest = {
            excluding_user_id: excludingUserID,
            user_name: userName,
        }

        const { data } = await checkUserNameExcludingUserIDAPI(req)

        if (data.code === ResponseCode.UserNameExistExcludingUserID) {
            throw new Error(data.msg)
        }
    } catch (err: unknown) {
        console.error(err)
        throw err
    }
}

/**
 * @description: 邮箱查重 异步函数
 * @param {string} email 邮箱
 */
export async function checkEmail(email: string): Promise<void> {
    const req: CheckEmailRequest = {
        email: email,
    }

    try {
        const { data } = await checkEmailAPI(req)
        if (data.code === ResponseCode.UserEmailExist) {
            throw new Error(data.msg)
        }
    } catch (err: unknown) {
        console.error(err)
        throw err
    }
}

/**
 * @description: 邮箱查重 异步函数 排除指定用户ID
 * @param {string} excludingUserID 排除的用户ID
 * @param {string} email 邮箱
 */
export async function checkEmailExcludingUserID(excludingUserID: string, email: string): Promise<void> {
    const req: CheckEmailExcludingUserIDRequest = {
        excluding_user_id: excludingUserID,
        email: email,
    }

    try {
        const { data } = await checkEmailExcludingUserIDAPI(req)

        if (data.code === ResponseCode.EmailExistExcludingUserID) {
            throw new Error(data.msg)
        }
    } catch (err: unknown) {
        console.error(err)
        throw err
    }
}

/**
 * @description: 用户名查重 异步函数
 * @param {string} loginName 登录名
 */
export async function checkLoginName(loginName: string): Promise<void> {
    try {
        const req: GetDisableExpiresAtSecondsRequest = {
            login_name: loginName,
        }

        const { data } = await getDisableExpiresAtSecondsAPI(req)

        const msg = getUserForbiddenMsg(data)

        if (data.code === ResponseCode.UserForbidden) {
            throw new Error(msg)
        }
    } catch (err: unknown) {
        console.error(err)
        throw err
    }
}
