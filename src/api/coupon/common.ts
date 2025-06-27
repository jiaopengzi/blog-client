/*
 * FilePath    : blog-client\src\api\coupon\common.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 优惠卷共用内容
 */

import { type PgSqlDateTime } from "@/api/common"
import type { DataWithImg } from "@/components/common"

// 定义优惠券叠加使用状态
export enum CouponStackable {
    Disabled = 1, // 禁用叠加使用
    Enabled = 2, // 启用叠加使用
}

// 优惠券叠加使用显示
export const CouponStackableDisplay: Record<CouponStackable, string> = {
    [CouponStackable.Disabled]: "禁用叠加使用",
    [CouponStackable.Enabled]: "启用叠加使用",
}

// 获取优惠券叠加使用选项
export const getCouponStackableOptions = () => {
    return [
        { label: CouponStackableDisplay[CouponStackable.Disabled], value: CouponStackable.Disabled },
        { label: CouponStackableDisplay[CouponStackable.Enabled], value: CouponStackable.Enabled },
    ]
}

// 折扣方式
export enum CouponDiscountType {
    FixedAmount = 1, // 固定金额折扣
    Percentage = 2, // 百分比折扣
}

// 折扣方式显示
export const CouponDiscountTypeDisplay: Record<CouponDiscountType, string> = {
    [CouponDiscountType.FixedAmount]: "固定金额折扣",
    [CouponDiscountType.Percentage]: "百分比折扣",
}

// 获取折扣方式选项
export const getDiscountTypeOptions = () => {
    return [
        { label: CouponDiscountTypeDisplay[CouponDiscountType.FixedAmount], value: CouponDiscountType.FixedAmount },
        { label: CouponDiscountTypeDisplay[CouponDiscountType.Percentage], value: CouponDiscountType.Percentage },
    ]
}

// 优惠卷状态
export enum CouponStatus {
    Disabled = 1, // 禁用
    Enabled = 2, //
}

// 优惠卷状态显示
export const CouponStatusDisplay: Record<CouponStatus, string> = {
    [CouponStatus.Disabled]: "禁用",
    [CouponStatus.Enabled]: "启用",
}

// 获取优惠卷状态选项
export const getCouponStatusOptions = () => {
    return [
        { label: CouponStatusDisplay[CouponStatus.Disabled], value: CouponStatus.Disabled },
        { label: CouponStatusDisplay[CouponStatus.Enabled], value: CouponStatus.Enabled },
    ]
}

export interface InsertCouponRequest {
    code: string // 优惠码
    description?: string // 优惠券描述
    discount_type: CouponDiscountType // 优惠类型 1 固定金额折扣, 2 百分比折扣
    amount: string // 优惠数量(金额/百分比) 单位分
    expire_time?: PgSqlDateTime // 过期时间
    min_spend?: string // 最小消费金额(分)
    max_spend?: string // 最大消费金额(分)
    is_stackable?: CouponStackable // 是否允许叠加使用,默认 1 禁用 2 启用
    use_limit?: string // 使用次数限制
    used_count?: string // 已使用次数
    use_limit_per_user?: string // 单人使用次数限制
    status: CouponStatus // 状态 1禁用, 2启用
}

export interface UpdateCouponRequest extends InsertCouponRequest {
    id: string // 优惠卷id
}

// 优惠卷
export interface CouponRes extends DataWithImg {
    id: string // id
    created_at: string // 创建时间
    updated_at: string // 更新时间
    code: string // 优惠码
    description: string // 优惠券描述
    discount_type: CouponDiscountType // 优惠类型 1 固定金额折扣, 2 百分比折扣
    amount: number // 优惠数量(金额/百分比) 单位分
    expire_time: PgSqlDateTime // 过期时间
    min_spend: number // 最小消费金额(分)
    max_spend: number // 最大消费金额(分)
    is_stackable: CouponStackable // 是否允许叠加使用,默认 1 禁用 2 启用
    use_limit: number // 使用次数限制
    used_count: number // 已使用次数
    use_limit_per_user: number // 单人使用次数限制
    status: CouponStatus // 状态 1禁用, 2启用
}
