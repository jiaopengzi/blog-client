/**
 * @Author       : jiaopengzi
 * @Date         : 2025-02-05 12:06:00
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2025-02-05 15:19:58
 * @FilePath     : \blog-client\src\views\admin\component\main\setting\upload\oss\types.ts
 * @Description  : 上传信息基础类型
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 */

import { type BaseConfigFormRef } from "@/components/common/base-config-form"

export interface UploadOSSFormRef extends HTMLElement {
    root: HTMLElement
    formRef: BaseConfigFormRef
}
