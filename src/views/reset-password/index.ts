/**
 * @Author       : jiaopengzi
 * @Date         : 2024-01-12 18:25:25
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-01-12 18:25:25
 * @FilePath     : \blog-client\src\views\resetpassword\index.ts
 * @Description  :
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

export { default } from "./index.vue"

export interface ResetPasswordForm {
    email: string
    captcha: string
    password: string
    rePassword: string
}
