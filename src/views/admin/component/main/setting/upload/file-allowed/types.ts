/**
 * @FilePath     : \blog-client\src\views\admin\component\main\setting\upload\file-allowed\types.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 类型
 */

import { type FileAllowed } from "@/api/setting/getUpload"

export interface FileAllowedRef extends HTMLElement {
    root: HTMLElement
    validateForm: () => Promise<boolean>
    formDataResult: FileAllowed[]
}
