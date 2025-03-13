/**
 * @FilePath     : \blog-client\src\views\admin\component\main\social\social-login-config\types.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 类型
 */

import { type LoginConfig } from "@/api/setting/getSocialLogin"

export interface SocialLoginConfigRef extends HTMLElement {
    root: HTMLElement
    validateForm: () => Promise<boolean>
    formDataResult: LoginConfig
}
