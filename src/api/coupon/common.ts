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
export enum DiscountType {
    FixedAmount = 1, // 固定金额折扣
    Percentage = 2, // 百分比折扣
}

// 折扣方式显示
export const DiscountTypeDisplay: Record<DiscountType, string> = {
    [DiscountType.FixedAmount]: "固定金额折扣",
    [DiscountType.Percentage]: "百分比折扣",
}

// 获取折扣方式选项
export const getDiscountTypeOptions = () => {
    return [
        { label: DiscountTypeDisplay[DiscountType.FixedAmount], value: DiscountType.FixedAmount },
        { label: DiscountTypeDisplay[DiscountType.Percentage], value: DiscountType.Percentage },
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
    Code: string // 优惠码
    Description?: string // 优惠券描述
    DiscountType: DiscountType // 优惠类型 1 固定金额折扣, 2 百分比折扣
    Amount: string // 优惠数量(金额/百分比) 单位分
    ExpireTime?: PgSqlDateTime // 过期时间
    MinSpend?: string // 最小消费金额(分)
    MaxSpend?: string // 最大消费金额(分)
    IsStackable?: CouponStackable // 是否允许叠加使用,默认 1 禁用 2 启用
    UseLimit?: string // 使用次数限制
    UsedCount?: string // 已使用次数
    UseLimitPerUser?: string // 单人使用次数限制
    Status: CouponStatus // 状态 1禁用, 2启用
}

export interface UpdateCouponRequest extends InsertCouponRequest {
    id: string // 优惠卷id
}

// 优惠卷
export interface CouponRes extends DataWithImg {
    id: string // id
    created_at: string // 创建时间
    updated_at: string // 更新时间
    Code: string // 优惠码
    Description: string // 优惠券描述
    DiscountType: DiscountType // 优惠类型 1 固定金额折扣, 2 百分比折扣
    Amount: number // 优惠数量(金额/百分比) 单位分
    ExpireTime: PgSqlDateTime // 过期时间
    MinSpend: number // 最小消费金额(分)
    MaxSpend: number // 最大消费金额(分)
    IsStackable: CouponStackable // 是否允许叠加使用,默认 1 禁用 2 启用
    UseLimit: number // 使用次数限制
    UsedCount: number // 已使用次数
    UseLimitPerUser: number // 单人使用次数限制
    Status: CouponStatus // 状态 1禁用, 2启用
}
