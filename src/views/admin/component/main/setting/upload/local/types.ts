/**
 * @Author       : jiaopengzi
 * @Date         : 2025-02-05 14:03:20
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2025-02-05 15:19:51
 * @FilePath     : \blog-client\src\views\admin\component\main\setting\upload\local\types.ts
 * @Description  : 类型
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 */

import { type BaseConfigFormRef } from "@/components/common/base-config-form"

export interface UploadLocalFormRef extends HTMLElement {
    root: HTMLElement
    formRef: BaseConfigFormRef
}
