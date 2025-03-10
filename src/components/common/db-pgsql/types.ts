/**
 * @FilePath     : \blog-client\src\components\common\db-pgsql\types.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 类型
 */

import { type BaseConfigFormRef } from "@/components/common/base-config-form"

export interface PgsqlDatabaseFormRef extends HTMLElement {
    root: HTMLElement
    formRef: BaseConfigFormRef
}
