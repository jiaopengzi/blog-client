/*
 * FilePath    : blog-client\src\views\admin\component\main\coupon\component\view\types.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 类型
 */

import { type PgSqlDateTime } from "@/api/common"
import { CouponDiscountType, CouponStackable, CouponStatus } from "@/api/coupon/common"

export interface ViewForm {
    id?: string // ID
    code: string // 优惠码
    description?: string // 优惠券描述
    discount_type: CouponDiscountType // 优惠类型 1 固定金额折扣, 2 百分比折扣
    amount: number // 优惠数量(金额/百分比) 单位分
    expire_time: PgSqlDateTime // 过期时间
    min_spend?: number // 最小消费金额(分)
    max_spend?: number // 最大消费金额(分)
    is_stackable: CouponStackable // 是否允许叠加使用,默认 1 禁用 2 启用
    use_limit?: number // 使用次数限制
    used_count?: number // 已使用次数
    use_limit_per_user?: number // 单人使用次数限制
    status: CouponStatus // 状态 1禁用, 2启用
}
