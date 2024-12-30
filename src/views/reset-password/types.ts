/**
 * @Author       : jiaopengzi
 * @Date         : 2024-12-30 12:20:10
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-30 12:20:17
 * @FilePath     : \blog-client\src\views\reset-password\types.ts
 * @Description  : 类型
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

export interface ResetPasswordForm {
    email: string
    captcha: string
    password: string
    rePassword: string
}
