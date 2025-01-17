/**
 * @Author       : jiaopengzi
 * @Date         : 2025-01-16 10:08:32
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2025-01-16 12:31:01
 * @FilePath     : \blog-client\src\components\common\db-base\types.ts
 * @Description  :
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 */

import { type Reactive } from "vue"

import type { PgsqlSetupRequest, RedisNodeSetupRequest } from "@/api/setting/setup"

export type DbFormType = PgsqlSetupRequest | RedisNodeSetupRequest

export interface DatabaseFormRef extends HTMLElement {
    root: HTMLElement
    validateForm: () => Promise<boolean>
    dbFormData: Reactive<DbFormType>
}
