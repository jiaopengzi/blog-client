/**
 * @Author       : jiaopengzi
 * @Date         : 2025-02-04 16:54:22
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2025-02-04 17:03:48
 * @FilePath     : \blog-client\src\views\admin\component\main\setting\upload\file-allowed\types.ts
 * @Description  :
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 */

import { type FileAllowed } from "@/api/setting/getUpload"

export interface FileAllowedRef extends HTMLElement {
    root: HTMLElement
    validateForm: () => Promise<boolean>
    formDataResult: FileAllowed[]
}
