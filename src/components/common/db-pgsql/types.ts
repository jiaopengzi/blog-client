/**
 * @Author       : jiaopengzi
 * @Date         : 2025-01-16 10:06:12
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2025-01-16 10:19:27
 * @FilePath     : \blog-client\src\components\common\db-pgsql\types.ts
 * @Description  :
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 */
import { type DatabaseFormRef } from "@/components/common/db-base"

export interface PgsqlDatabaseFormRef extends HTMLElement {
    root: HTMLElement
    databaseFormRef: DatabaseFormRef
}
