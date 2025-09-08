/*
 * FilePath    : blog-client\src\views\admin\component\main\account-key-all\component\view\types.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 类型
 */

import { type PgSqlDateTime } from "@/api/common"

export interface ViewForm {
    id?: string // ID
    title?: string // 产品标题
    description?: string // 描述
    itemStr?: string // 卡密内容
    price?: number // 价格
    purchase_min?: number // 最少购买数量
    purchase_max?: number // 最多购买数量
    user_max?: number // 同一用户最多购买数量
    purchase_start: PgSqlDateTime // 开始购买时间
    purchase_end: PgSqlDateTime // 结束购买时间
    pay_roles?: string[] // 付费角色
}
