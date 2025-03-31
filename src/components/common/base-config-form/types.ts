/**
 * @FilePath     : \blog-client\src\components\common\base-config-form\types.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 类型
 */

import { type Reactive } from "vue"

import type { FFmpeg, Local, OSS } from "@/api/setting/getUpload"
import type { PgsqlSetupRequest, RedisNodeSetupRequest } from "@/api/setting/setup"
import type { ESForm } from "@/components/common/db-es"

export type BaseConfigFormType = ESForm | PgsqlSetupRequest | RedisNodeSetupRequest | Local | OSS | FFmpeg

export interface BaseConfigFormRef extends HTMLElement {
    root: HTMLElement
    validateForm: () => Promise<boolean>
    configFormData: Reactive<BaseConfigFormType>
}
