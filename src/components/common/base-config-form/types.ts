/**
 * @Author       : jiaopengzi
 * @Date         : 2025-01-16 10:08:32
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2025-02-05 14:04:29
 * @FilePath     : \blog-client\src\components\common\base-config-form\types.ts
 * @Description  : 类型
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 */

import { type Reactive } from "vue"

import type { Local, OSS } from "@/api/setting/getUpload"
import type { PgsqlSetupRequest, RedisNodeSetupRequest } from "@/api/setting/setup"

export type BaseConfigFormType = PgsqlSetupRequest | RedisNodeSetupRequest | Local | OSS

export interface BaseConfigFormRef extends HTMLElement {
    root: HTMLElement
    validateForm: () => Promise<boolean>
    configFormData: Reactive<BaseConfigFormType>
}
