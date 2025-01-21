/**
 * @Author       : jiaopengzi
 * @Date         : 2025-01-21 11:24:09
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2025-01-21 13:25:26
 * @FilePath     : \blog-client\src\views\admin\component\main\setting\social\social-login-config\types.ts
 * @Description  :
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 */

import { type LoginConfig } from "@/api/setting/getSocialLogin"

export interface SocialLoginConfigRef extends HTMLElement {
    root: HTMLElement
    validateForm: () => Promise<boolean>
    formDataResult: LoginConfig
}
