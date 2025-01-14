/**
 * @Author       : jiaopengzi
 * @Date         : 2024-12-30 12:17:30
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2025-01-13 15:37:50
 * @FilePath     : \blog-client\src\views\register-admin\types.ts
 * @Description  :  类型
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 */

export interface RegisterForm {
    userName: string
    email: string
    password: string
    rePassword: string
    acceptedTerms: boolean
}
