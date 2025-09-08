/*
 * FilePath    : blog-client\src\api\accountKey\common.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 账号密钥共用内容
 */

import { type PgSqlDateTime } from "@/api/common"
import type { DataWithImg } from "@/components/common"

// 插入账号密钥请求参数
export interface InsertAccountKeyRequest {
    title?: string // 产品标题
    description?: string // 描述
    items?: string[] // 卡密内容
    price?: string // 价格
    purchase_min?: number // 最少购买数量
    purchase_max?: number // 最多购买数量
    user_max?: number // 同一用户最多购买数量
    purchase_start?: PgSqlDateTime // 开始购买时间
    purchase_end?: PgSqlDateTime // 结束购买时间
    pay_roles?: string[] // 付费角色
}

export interface UpdateAccountKeyRequest extends InsertAccountKeyRequest {
    id: string // 账号密钥ID
}

// 账号密钥响应
export interface AccountKeyRes extends DataWithImg {
    id: string // id
    created_at: string // 创建时间
    updated_at: string // 更新时间
    title: string // 产品标题
    related_id: string // 关联ID
    inventory: number // 库存
    sale_quantity: number // 销售数量
    price: string // 价格
    purchase_min: number // 最少购买数量
    purchase_max: number // 最多购买数量
    user_max: number // 同一用户最多购买数量
    purchase_start: PgSqlDateTime | null // 开始购买时间
    purchase_end: PgSqlDateTime | null // 结束购买时间
    description: string // 描述
}
