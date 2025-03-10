/**
 * @FilePath     : \blog-client\src\components\hooks\useAccountFormValidation\type.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 类型定义
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

import { type Ref } from "vue"

/**
 * @description: 自定义校验函数类型
 */
export type ValidatorFunc = (rule: any, value: any, callback: (error?: string | Error | undefined) => void) => void

export interface FormValidationOptions {
    FormUserName?: Ref<string>
    FormEmail?: Ref<string>
    FormCaptcha?: Ref<string>
    FormPassword?: Ref<string>
    FormRePassword?: Ref<string>
    FormAcceptedTerms?: Ref<boolean>
    FormExcludingUserID?: Ref<string>
}
