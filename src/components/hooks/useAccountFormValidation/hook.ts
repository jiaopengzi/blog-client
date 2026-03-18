/**
 * @FilePath     : \blog-client\src\components\hooks\useAccountFormValidation\hook.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 用户表单校验
 */

// import { CaptchaPurpose } from "@/api/common"

import { RegexPatterns } from "@/utils/regexPatterns"

import { checkCaptcha, checkSendCaptcha } from "./api/captcha"
import { checkEmail, checkEmailExcludingUserID, checkLoginName, checkUserName, checkUserNameExcludingUserID } from "./api/user"
import {
    createAcceptedTermsRules,
    createCaptchaRules,
    createEmailRules,
    createLoginNameRules,
    createNickNameRules,
    createPasswordRules,
    createRePasswordRules,
    createUserNameRules,
} from "./rules"
import type { FormValidationOptions } from "./type"

export function useAccountFormValidation(options: FormValidationOptions = {}) {
    const {
        FormUserName = "",
        FormEmail = "",
        // FormCaptcha = "",
        FormPassword = "",
        FormRePassword = "",
        FormAcceptedTerms = false,
        FormExcludingUserID = "",
    } = options

    /**
     * @description: 判断当前值是否已通过前端基础校验, 未通过时跳过远端请求.
     * @param value 当前字段值.
     * @param pattern 当前字段对应的前端正则规则.
     * @return boolean true 表示仅执行前端校验, 不发起远端请求.
     */
    function shouldSkipRemoteValidation(value: string, pattern: RegExp): boolean {
        return value === "" || !pattern.test(value)
    }

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
    function rePasswordValidator(rule: unknown, value: string, callback: (error?: string | Error | undefined) => void): void {
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
    function acceptedTermsValidator(rule: unknown, value: string, callback: (error?: string | Error | undefined) => void): void {
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
     * @description: 用户名查重 Validator
     * @param rule 校验规则
     * @param value 对应输入框的值
     * @param callback 回调函数，如果用户名存在，则传入错误提示字符串
     */
    function checkUserNameValidator(rule: unknown, value: string, callback: (error?: string | Error | undefined) => void): void {
        // 在这里处理异步验证逻辑
        if (FormUserName === undefined) {
            callback("请输入用户名")
            return
        }
        const formUserName = value || options.FormUserName?.value || ""

        if (shouldSkipRemoteValidation(formUserName, RegexPatterns.UserName)) {
            callback()
            return
        }

        checkUserName(formUserName)
            .then(() => {
                callback() // 校验成功
            })
            .catch((err: Error) => {
                callback(err.message) // 如果失败（用户名已经存在），则传入错误提示字符串
            })
    }

    /**
     * @description: 用户名查重 Validator 排除指定用户ID
     * @param rule 校验规则
     * @param value 对应输入框的值
     * @param callback 回调函数，如果用户名存在，则传入错误提示字符串
     */
    function checkUserNameExcludingUserIDValidator(rule: unknown, value: string, callback: (error?: string | Error | undefined) => void): void {
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
        const formUserName = value || options.FormUserName?.value || ""

        if (shouldSkipRemoteValidation(formUserName, RegexPatterns.UserName)) {
            callback()
            return
        }

        checkUserNameExcludingUserID(formExcludingUserID, formUserName)
            .then(() => {
                callback() // 校验成功
            })
            .catch((err: Error) => {
                callback(err.message) // 如果失败（用户名已经存在），则传入错误提示字符串
            })
    }

    /**
     * @description: 用户名查重 Validator
     * @param rule 校验规则
     * @param value 对应输入框的值
     * @param callback 回调函数，如果用户名存在，则传入错误提示字符串
     */
    function checkEmailValidator(rule: unknown, value: string, callback: (error?: string | Error | undefined) => void): void {
        // 在这里处理异步验证逻辑
        if (FormEmail === undefined) {
            callback("请输入邮箱")
            return
        }
        const formEmail = value || options.FormEmail?.value || ""

        if (shouldSkipRemoteValidation(formEmail, RegexPatterns.Email)) {
            callback()
            return
        }

        checkEmail(formEmail)
            .then(() => {
                callback() // 校验成功
            })
            .catch((err: Error) => {
                callback(err.message) // 如果失败（邮箱已经存在），则传入错误提示字符串
            })
    }

    /**
     * @description: 用户名查重 Validator 排除指定用户ID
     * @param rule 校验规则
     * @param value 对应输入框的值
     * @param callback 回调函数，如果用户名存在，则传入错误提示字符串
     */
    function checkEmailExcludingUserIDValidator(rule: unknown, value: string, callback: (error?: string | Error | undefined) => void): void {
        // 在这里处理异步验证逻辑
        if (FormEmail === undefined) {
            callback("请输入邮箱")
            return
        }
        const formExcludingUserID = options.FormExcludingUserID?.value || ""
        const formEmail = value || options.FormEmail?.value || ""

        if (shouldSkipRemoteValidation(formEmail, RegexPatterns.Email)) {
            callback()
            return
        }

        checkEmailExcludingUserID(formExcludingUserID, formEmail)
            .then(() => {
                callback() // 校验成功
            })
            .catch((err: Error) => {
                callback(err.message) // 如果失败（邮箱已经存在），则传入错误提示字符串
            })
    }

    // // 验证码仅在提交表单时校验，不在单独远端校验，当前函数废弃
    // const checkCaptchaValidatorFactory = (purpose: CaptchaPurpose) => {
    //     return (rule: unknown, value: string, callback: (error?: string | Error | undefined) => void) => {
    //         // 在这里处理异步验证逻辑
    //         if (FormEmail === undefined) {
    //             callback("请输入邮箱")
    //             return
    //         }
    //         if (FormCaptcha === undefined) {
    //             callback("请输入验证码")
    //             return
    //         }

    //         const formEmail = options.FormEmail?.value || ""
    //         const formCaptcha = options.FormCaptcha?.value || ""
    //         checkCaptcha(formEmail, formCaptcha, purpose)
    //             .then(() => {
    //                 callback() // 校验成功
    //             })
    //             .catch((err: Error) => {
    //                 callback(err.message) // 如果失败（用户名已经存在），则传入错误提示字符串
    //             })
    //     }
    // }

    /**
     * @description: 用户名查重 Validator
     * @param rule 校验规则
     * @param value 对应输入框的值
     * @param callback 回调函数，如果用户名存在，则传入错误提示字符串
     */
    function checkLoginNameValidator(rule: unknown, value: string, callback: (error?: string | Error | undefined) => void): void {
        // 在这里处理异步验证逻辑
        if (FormUserName === undefined) {
            callback("请输入用户名")
            return
        }
        const formUserName = value || options.FormUserName?.value || ""

        if (shouldSkipRemoteValidation(formUserName, RegexPatterns.LoginName)) {
            callback()
            return
        }

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
        checkSendCaptcha,
        // checkCaptchaValidatorFactory,
        checkRePassword,
        rePasswordValidator,
        checkAcceptedTerms,
        acceptedTermsValidator,
        checkLoginName,
        checkLoginNameValidator,

        // 表单校验规则
        createLoginNameRules,
        createUserNameRules,
        createPasswordRules,
        createEmailRules,
        createCaptchaRules,
        createRePasswordRules,
        createAcceptedTermsRules,
        createNickNameRules,
    }
}
