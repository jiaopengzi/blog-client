/**
 * @FilePath     : \blog-client\src\components\hooks\useAccountFormValidation\rules.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 生成校验规则
 */

import type { FormItemRule } from "element-plus"

import { RegexPatterns } from "@/utils/regexPatterns"

import type { ValidatorFunc } from "./type"

/**
 * @description: 表单校验规则
 * @return  FormRules<loginForm> 表单校验规则 trigger: 'blur' 表示失去焦点时校验 'change' 表示值改变时校验
 */

/**
 * @description: 创建登录名校验规则
 * @param validatorFunc 自定义校验函数
 * @return {FormItemRule[]} 校验规则
 */
export function createLoginNameRules(validatorFunc: ValidatorFunc): FormItemRule[] {
    return [
        { required: true, message: "请输入用户名或邮箱！", trigger: ["blur", "change"] },
        {
            pattern: RegexPatterns.LoginName,
            message: "6-20位小写字母或数字 | 邮箱",
            trigger: ["blur", "change"],
        },
        { validator: validatorFunc, trigger: "blur" },
    ]
}

/**
 * @description: 创建用户名校验规则
 * @param validatorFunc 自定义校验函数
 * @return {FormItemRule[]} 校验规则
 */
export function createUserNameRules(validatorFunc?: ValidatorFunc): FormItemRule[] {
    const rules: FormItemRule[] = [
        { required: true, message: "请输入用户名！", trigger: ["blur", "change"] },
        {
            pattern: RegexPatterns.UserName,
            message: "用户名长度:6-20的小写字母或数字",
            trigger: ["blur", "change"],
        },
    ]

    if (validatorFunc) {
        rules.push({ validator: validatorFunc, trigger: "blur" })
    }

    return rules
}

/**
 * @description: 创建密码校验规则
 * @param isRequired 是否必填, 默认必填
 * @return {FormItemRule[]} 校验规则
 */
export function createPasswordRules(isRequired: boolean = true): FormItemRule[] {
    const rules: FormItemRule[] = [
        {
            pattern: RegexPatterns.Password,
            message: "必须包含：大小写字母+数字,长度:6-64",
            trigger: ["blur", "change"],
        },
    ]

    if (!isRequired) {
        return rules
    }

    return [{ required: true, message: "请输入密码", trigger: ["blur", "change"] }, ...rules]
}

/**
 * @description: 创建邮箱校验规则
 * @param validatorFunc 自定义校验函数
 * @return {FormItemRule[]} 校验规则
 */
export function createEmailRules(validatorFunc?: ValidatorFunc): FormItemRule[] {
    const rules: FormItemRule[] = [
        { required: true, message: "请输入邮箱地址", trigger: ["blur", "change"] },
        { pattern: RegexPatterns.Email, message: "请输入有效的邮箱", trigger: ["blur", "change"] },
    ]

    if (validatorFunc) {
        rules.push({ validator: validatorFunc, trigger: "blur" })
    }

    return rules
}

/**
 * @description: 创建验证码校验规则
 * @param validatorFactory 自定义校验函数
 * @return {FormItemRule[]} 校验规则
 */
export function createCaptchaRules(validatorFunc?: ValidatorFunc): FormItemRule[] {
    const rules: FormItemRule[] = [
        { required: true, message: "请输入验证码", trigger: ["blur", "change"] },
        { pattern: RegexPatterns.Captcha, message: "验证码为6位的数字", trigger: ["blur", "change"] },
    ]

    if (validatorFunc) {
        rules.push({ validator: validatorFunc, trigger: "blur" })
    }

    return rules
}

/**
 * @description: 创建新密码校验规则
 * @param validatorFunc 自定义校验函数
 * @return {FormItemRule[]} 校验规则
 */
export function createRePasswordRules(validatorFunc: ValidatorFunc): FormItemRule[] {
    return [{ required: true, validator: validatorFunc, trigger: ["blur", "change"] }]
}

/**
 * @description: 创建同意条款校验规则
 * @param validatorFunc 自定义校验函数
 * @return {FormItemRule[]} 校验规则
 */
export function createAcceptedTermsRules(validatorFunc: ValidatorFunc): FormItemRule[] {
    return [{ type: "boolean", required: true, validator: validatorFunc, trigger: "change" }]
}

/**
 * @description: 创建昵称校验规则
 * @return {FormItemRule[]} 校验规则
 */
export function createNickNameRules(): FormItemRule[] {
    return [
        { required: true, message: "请输入昵称！", trigger: ["blur", "change"] },
        {
            pattern: RegexPatterns.NickName,
            message: "昵称长度1-20字符",
            trigger: ["blur", "change"],
        },
    ]
}
