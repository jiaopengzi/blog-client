/**
 * @Author       : jiaopengzi
 * @Date         : 2025-01-16 10:06:12
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2025-02-05 15:19:33
 * @FilePath     : \blog-client\src\components\common\db-pgsql\types.ts
 * @Description  :
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 */
import { type BaseConfigFormRef } from "@/components/common/base-config-form"

export interface PgsqlDatabaseFormRef extends HTMLElement {
    root: HTMLElement
    formRef: BaseConfigFormRef
}
