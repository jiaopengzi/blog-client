/**
 * @Author       : jiaopengzi
 * @Date         : 2024-01-12 18:23:52
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-01-12 18:24:26
 * @FilePath     : \blog-client\src\views\register\index.ts
 * @Description  :
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

export { default } from './index.vue'

export interface RegisterForm {
  userName: string
  email: string
  captcha: string
  password: string
  rePassword: string
  acceptedTerms: string[]
}
