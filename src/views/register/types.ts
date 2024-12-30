/**
 * @Author       : jiaopengzi
 * @Date         : 2024-12-30 12:17:30
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-30 12:17:42
 * @FilePath     : \blog-client\src\views\register\types.ts
 * @Description  :
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */
/**
 * @Author       : jiaopengzi
 * @Date         : 2024-12-30 12:17:30
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-30 12:17:38
 * @FilePath     : \blog-client\src\views\register\types.ts
 * @Description  : 类型
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

export interface RegisterForm {
    userName: string
    email: string
    captcha: string
    password: string
    rePassword: string
    acceptedTerms: boolean
}
