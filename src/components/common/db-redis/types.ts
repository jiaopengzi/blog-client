/**
 * @Author       : jiaopengzi
 * @Date         : 2025-01-16 10:19:55
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2025-01-16 10:19:59
 * @FilePath     : \blog-client\src\components\common\db-redis\types.ts
 * @Description  :
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 */
import { type DatabaseFormRef } from "@/components/common/db-base"

export interface RedisDatabaseFormRef extends HTMLElement {
    root: HTMLElement
    databaseFormRef: DatabaseFormRef
}
