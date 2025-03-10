/**
 * @FilePath     : \blog-client\src\components\common\db-redis\types.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : redis 数据库配置表单类型定义
 */

import { type BaseConfigFormRef } from "@/components/common/base-config-form"

export interface RedisDatabaseFormRef extends HTMLElement {
    root: HTMLElement
    formRef: BaseConfigFormRef
}
