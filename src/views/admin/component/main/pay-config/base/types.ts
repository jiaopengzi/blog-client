/*
 * FilePath    : blog-client\src\views\admin\component\main\app-option\base\types.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 网站选项表单类型
 */

import type { AliPayConf, WeChatPayConf } from "@/stores/options"

export interface FormRef extends HTMLElement {
    root: HTMLElement
    validateForm: () => Promise<boolean>
    formDataResult: FormView
}

export type FormView = WeChatPayConf | AliPayConf

export type KeyofFormView = keyof FormView
