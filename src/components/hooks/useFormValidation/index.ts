/**
 * @Author       : jiaopengzi
 * @Date         : 2024-06-16 15:53:38
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-14 12:45:36
 * @FilePath     : \blog-client\src\components\hooks\useFormValidation\index.ts
 * @Description  : 用户表单校验
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

// useFormValidation.ts
import { type Ref } from "vue"
import { type CheckUserNameRequest, checkUserNameAPI } from "@/api/user/checkUserName"
import {
    type CheckUserNameExcludingUserIDRequest,
    checkUserNameExcludingUserIDAPI,
} from "@/api/user/checkUserNameExcludingUserID"
import { type CheckEmailRequest, CheckEmailAPI } from "@/api/user/checkEmail"
import {
    type CheckEmailExcludingUserIDRequest,
    checkEmailExcludingUserIDAPI,
} from "@/api/user/checkEmailExcludingUserID"
import { type CaptchaSendRequest, captchaSendAPI } from "@/api/captcha/send"
import { type CaptchaCheckRequest, captchaCheckAPI } from "@/api/captcha/check"
import {
    type GetDisableExpiresAtSecondsRequest,
    getDisableExpiresAtSecondsAPI,
} from "@/api/user/getDisableExpiresAtSeconds"
import { ResponseCode, CaptchaPurpose } from "@/api/responseCode"
import { getUserForbiddenMsg } from "@/utils/msg"

interface FormValidationOptions {
    FormUserName?: Ref<string>
    FormEmail?: Ref<string>
    FormCaptcha?: Ref<string>
    FormPassword?: Ref<string>
    FormRePassword?: Ref<string>
    FormAcceptedTerms?: Ref<boolean>
    FormExcludingUserID?: Ref<string>
}

export function useFormValidation(options: FormValidationOptions = {}) {
    const {
        FormUserName = "",
        FormEmail = "",
        FormCaptcha = "",
        FormPassword = "",
        FormRePassword = "",
        FormAcceptedTerms = false,
        FormExcludingUserID = "",
    } = options

    /**
     * @description:校验确认密码是否与密码一致
     * @param password 密码
     * @param rePassword 确认密码
     * @return  void
     */
    async function checkRePassword(password: string, rePassword: string): Promise<void> {
        try {
            if (rePassword === "") {
                throw new Error("请再次输入密码")
            } else if (rePassword !== password) {
                throw new Error("两次输入的密码不一致")
            }
        } catch (err: unknown) {
            console.log(err)
            throw err
        }
    }

    /**
     * @description: 确认密码 Validator
     * @return  void
     */
    function rePasswordValidator(
        rule: unknown,
        value: string,
        callback: (error?: string | Error | undefined) => void,
    ): void {
        // 在这里处理异步验证逻辑

        const formPassword = options.FormPassword?.value || ""
        const formRePassword = options.FormRePassword?.value || ""

        if (FormPassword === undefined) {
            callback("请输入密码")
            return
        }
        if (FormRePassword === undefined) {
            callback("请输入确认密码")
            return
        }
        checkRePassword(formPassword, formRePassword)
            .then(() => {
                callback() // 校验成功
            })
            .catch((err: Error) => {
                callback(err.message)
            })
    }

    /**
     * @description: 检查是否同意服务条款
     */
    async function checkAcceptedTerms(acceptedTerms: boolean): Promise<void> {
        try {
            if (acceptedTerms === false) {
                throw new Error("请勾选同意服务条款")
            }
        } catch (err: unknown) {
            console.log(err)
            throw err
        }
    }

    /**
     * @description: 是否同意 Validator
     * @return  void
     */
    function acceptedTermsValidator(
        rule: unknown,
        value: string,
        callback: (error?: string | Error | undefined) => void,
    ): void {
        if (FormAcceptedTerms === undefined) {
            callback("请勾选同意服务条款")
            return
        }
        const formAcceptedTerms = options.FormAcceptedTerms?.value || false
        checkAcceptedTerms(formAcceptedTerms)
            .then(() => {
                callback() // 校验成功
            })
            .catch((err: Error) => {
                callback(err.message)
            })
    }

    /**
     * @description: 验证码发送 异步函数
     * @return Promise<void> 验证码错误返回 Promise.reject()，否则返回 Promise.resolve()
     */
    async function checkSendCaptcha(email: string): Promise<void> {
        try {
            // 创建请求对象 加密内容
            const req: CaptchaSendRequest = {
                email: email,
                purpose: CaptchaPurpose.Register,
            }
            console.log("==========>发送验证码")

            const { data } = await captchaSendAPI(req) // 将 resStr 转换为对象

            if (data.code !== ResponseCode.CaptchaSendSuccess && data.data !== null) {
                // 历遍 data 中的错误信息 并抛出第一个key错误信息 停止循环
                for (const key in data.data) {
                    if (Object.prototype.hasOwnProperty.call(data.data, key)) {
                        throw new Error((data.data as Record<string, string>)[key]) // 抛出错误信息
                    }
                }
            }
            if (data.code !== ResponseCode.CaptchaSendSuccess && data.data === null) {
                throw new Error(data.msg) // 抛出错误信息
            }
        } catch (err: unknown) {
            console.log(err)
            throw err
        }
    }

    /**
     * @description: 用户名查重 异步函数
     * @return  Promise<void> 用户名存在返回 Promise.reject()，否则返回 Promise.resolve()
     */
    async function checkUserName(userName: string): Promise<void> {
        try {
            // 创建请求对象 加密内容
            const req: CheckUserNameRequest = {
                user_name: userName,
            }

            const { data } = await checkUserNameAPI(req)

            if (data.code === ResponseCode.UserNameExist) {
                throw new Error(data.msg)
            }
        } catch (err: unknown) {
            console.log(err)
            throw err
        }
    }

    /**
     * @description: 用户名查重 Validator
     * @param rule 校验规则
     * @param value 对应输入框的值
     * @param callback 回调函数，如果用户名存在，则传入错误提示字符串
     */
    function checkUserNameValidator(
        rule: unknown,
        value: string,
        callback: (error?: string | Error | undefined) => void,
    ): void {
        // 在这里处理异步验证逻辑
        if (FormUserName === undefined) {
            callback("请输入用户名")
            return
        }
        const formUserName = options.FormUserName?.value || ""
        checkUserName(formUserName)
            .then(() => {
                callback() // 校验成功
            })
            .catch((err: Error) => {
                callback(err.message) // 如果失败（用户名已经存在），则传入错误提示字符串
            })
    }

    /**
     * @description: 用户名查重 异步函数，排除指定用户ID
     * @return  Promise<void> 用户名存在返回 Promise.reject()，否则返回 Promise.resolve()
     */
    async function checkUserNameExcludingUserID(
        excludingUserID: string,
        userName: string,
    ): Promise<void> {
        try {
            // 创建请求对象 加密内容
            const req: CheckUserNameExcludingUserIDRequest = {
                excluding_user_id: excludingUserID,
                user_name: userName,
            }

            const { data } = await checkUserNameExcludingUserIDAPI(req)

            if (data.code === ResponseCode.UserNameExistExcludingUserID) {
                throw new Error(data.msg)
            }
        } catch (err: unknown) {
            console.log(err)
            throw err
        }
    }

    /**
     * @description: 用户名查重 Validator 排除指定用户ID
     * @param rule 校验规则
     * @param value 对应输入框的值
     * @param callback 回调函数，如果用户名存在，则传入错误提示字符串
     */
    function checkUserNameExcludingUserIDValidator(
        rule: unknown,
        value: string,
        callback: (error?: string | Error | undefined) => void,
    ): void {
        if (FormExcludingUserID === undefined) {
            callback("请输入用户ID")
            return
        }

        // 在这里处理异步验证逻辑
        if (FormUserName === undefined) {
            callback("请输入用户名")
            return
        }

        const formExcludingUserID = options.FormExcludingUserID?.value || ""
        const formUserName = options.FormUserName?.value || ""

        checkUserNameExcludingUserID(formExcludingUserID, formUserName)
            .then(() => {
                callback() // 校验成功
            })
            .catch((err: Error) => {
                callback(err.message) // 如果失败（用户名已经存在），则传入错误提示字符串
            })
    }

    /**
     * @description: 邮箱查重 异步函数
     * @return
     */
    async function checkEmail(email: string): Promise<void> {
        // 创建请求对象 加密内容
        const req: CheckEmailRequest = {
            email: email,
        }

        try {
            const { data } = await CheckEmailAPI(req)
            if (data.code === ResponseCode.UserEmailExist) {
                throw new Error(data.msg)
            }
        } catch (err: unknown) {
            console.log(err)
            throw err
        }
    }

    /**
     * @description: 用户名查重 Validator
     * @param rule 校验规则
     * @param value 对应输入框的值
     * @param callback 回调函数，如果用户名存在，则传入错误提示字符串
     */
    function checkEmailValidator(
        rule: unknown,
        value: string,
        callback: (error?: string | Error | undefined) => void,
    ): void {
        if (FormExcludingUserID === undefined) {
            callback("请输入用户ID")
            return
        }

        // 在这里处理异步验证逻辑
        if (FormEmail === undefined) {
            callback("请输入邮箱")
            return
        }
        const formEmail = options.FormEmail?.value || ""
        checkEmail(formEmail)
            .then(() => {
                callback() // 校验成功
            })
            .catch((err: Error) => {
                callback(err.message) // 如果失败（邮箱已经存在），则传入错误提示字符串
            })
    }

    /**
     * @description: 邮箱查重 异步函数 排除指定用户ID
     * @return
     */
    async function checkEmailExcludingUserID(
        excludingUserID: string,
        email: string,
    ): Promise<void> {
        // 创建请求对象 加密内容
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
            console.log(err)
            throw err
        }
    }

    /**
     * @description: 用户名查重 Validator 排除指定用户ID
     * @param rule 校验规则
     * @param value 对应输入框的值
     * @param callback 回调函数，如果用户名存在，则传入错误提示字符串
     */
    function checkEmailExcludingUserIDValidator(
        rule: unknown,
        value: string,
        callback: (error?: string | Error | undefined) => void,
    ): void {
        // 在这里处理异步验证逻辑
        if (FormEmail === undefined) {
            callback("请输入邮箱")
            return
        }
        const formExcludingUserID = options.FormExcludingUserID?.value || ""
        const formEmail = options.FormEmail?.value || ""
        checkEmailExcludingUserID(formExcludingUserID, formEmail)
            .then(() => {
                callback() // 校验成功
            })
            .catch((err: Error) => {
                callback(err.message) // 如果失败（邮箱已经存在），则传入错误提示字符串
            })
    }

    // 验证码校验 异步函数
    async function checkCaptcha(email: string, captcha: string): Promise<void> {
        try {
            // 创建请求对象 加密内容
            const req: CaptchaCheckRequest = {
                email: email,
                captcha: captcha,
                purpose: CaptchaPurpose.Register,
            }
            const { data } = await captchaCheckAPI(req)

            if (data.code !== ResponseCode.CaptchaCheckSuccess) {
                throw new Error(data.msg)
            }
        } catch (err: unknown) {
            console.log(err)
            throw err
        }
    }

    // 校验验证码 Validator
    function checkCaptchaValidator(
        rule: unknown,
        value: string,
        callback: (error?: string | Error | undefined) => void,
    ): void {
        // 在这里处理异步验证逻辑
        if (FormEmail === undefined) {
            callback("请输入邮箱")
            return
        }
        if (FormCaptcha === undefined) {
            callback("请输入验证码")
            return
        }

        const formEmail = options.FormEmail?.value || ""
        const formCaptcha = options.FormCaptcha?.value || ""
        checkCaptcha(formEmail, formCaptcha)
            .then(() => {
                callback() // 校验成功
            })
            .catch((err: Error) => {
                callback(err.message) // 如果失败（用户名已经存在），则传入错误提示字符串
            })
    }

    /**
     * @description: 用户名查重 异步函数
     * @return  Promise<void> 用户名存在返回 Promise.reject()，否则返回 Promise.resolve()
     */
    async function checkLoginName(loginName: string): Promise<void> {
        try {
            // 创建请求对象 加密内容
            const req: GetDisableExpiresAtSecondsRequest = {
                login_name: loginName,
            }

            const { data } = await getDisableExpiresAtSecondsAPI(req)

            const msg = getUserForbiddenMsg(data)
            if (data.code === ResponseCode.UserForbidden) {
                throw new Error(msg)
            }
        } catch (err: unknown) {
            console.log(err)
            throw err
        }
    }

    /**
     * @description: 用户名查重 Validator
     * @param rule 校验规则
     * @param value 对应输入框的值
     * @param callback 回调函数，如果用户名存在，则传入错误提示字符串
     */
    function checkLoginNameValidator(
        rule: unknown,
        value: string,
        callback: (error?: string | Error | undefined) => void,
    ): void {
        // 在这里处理异步验证逻辑
        if (FormUserName === undefined) {
            callback("请输入用户名")
            return
        }
        const formUserName = options.FormUserName?.value || ""
        checkLoginName(formUserName)
            .then(() => {
                callback() // 校验成功
            })
            .catch((err: Error) => {
                callback(err.message) // 如果失败（用户名已经存在），则传入错误提示字符串
            })
    }

    return {
        checkUserName,
        checkUserNameExcludingUserID,
        checkUserNameValidator,
        checkUserNameExcludingUserIDValidator,
        checkEmail,
        checkEmailValidator,
        checkEmailExcludingUserID,
        checkEmailExcludingUserIDValidator,
        checkCaptcha,
        checkCaptchaValidator,
        checkSendCaptcha,
        checkRePassword,
        rePasswordValidator,
        checkAcceptedTerms,
        acceptedTermsValidator,
        checkLoginName,
        checkLoginNameValidator,
    }
}
