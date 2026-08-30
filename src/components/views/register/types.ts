/*
 * FilePath    : blog-client-nuxt\src\components\views\register\types.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 类型
 */

export interface RegisterForm {
    userName: string
    email: string
    captcha: string
    password: string
    rePassword: string
    acceptedTerms: boolean
}
