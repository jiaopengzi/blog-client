/*
 * FilePath    : blog-client\src\api\billingCenter\common.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 计费中心共用内容
 */

import { PayType } from "@/api/pay/common"

// 计费中心验证码用途
export enum BillingCenterPurpose {
    Register = "Register", // 注册
    ResetCert = "ResetCert", // 重置证书
}

// 计费中心验证码用途显示
export const BillingCenterPurposeDisplay: Record<BillingCenterPurpose, string> = {
    [BillingCenterPurpose.Register]: "注册",
    [BillingCenterPurpose.ResetCert]: "重置证书",
}

// 交易流水类型
export enum TransactionType {
    All = 0, // 全部
    Reward = 1, // 奖励
    Recharge = 2, // 充值
    Consume = 3, // 消费
    Refund = 4, // 退款
    Penalty = 5, // 处罚
}

// 交易流水类型显示
export const TransactionTypeDisplay: Record<TransactionType, string> = {
    [TransactionType.All]: "📋全部",
    [TransactionType.Reward]: "🎁奖励",
    [TransactionType.Recharge]: "💰充值",
    [TransactionType.Consume]: "✅消费",
    [TransactionType.Refund]: "↩️退款",
    [TransactionType.Penalty]: "⚠️处罚",
}

// 获取交易流水类型选项
export const getTransactionTypeOptions = () => {
    return Object.values(TransactionType)
        .filter((value) => typeof value === "number")
        .map((value) => ({
            label: TransactionTypeDisplay[value as TransactionType],
            value: value as TransactionType,
        }))
}

// 货币类型
export enum Currency {
    CNY = 1, // 人民币
}

// 货币类型显示
export const CurrencyDisplay: Record<Currency, string> = {
    [Currency.CNY]: "人民币",
}

// 获取货币类型选项
export const getCurrencyOptions = () => {
    return Object.values(Currency)
        .filter((value) => typeof value === "number")
        .map((value) => ({
            label: CurrencyDisplay[value as Currency],
            value: value as Currency,
        }))
}

// 计费中心账号信息响应
export interface BillingCenterAccountRes {
    user_id: string // 用户ID
    currency: Currency // 货币类型
    balance: number // 余额(分)
    total_recharge: number // 总充值(分)
    total_consume: number // 总消费(分)
    consume_spent_numerator: number // 消费比例分子
    consume_spent_denominator: number // 消费比例分母
    consume_spent_min_amount: number // 最低消费(分)
    notify_threshold: number // 通知阈值(分), 0=不启用
    notify_enabled: boolean // 通知开关
}

// 计费中心授权信息响应
export interface BillingCenterLicenseRes {
    issued_at: string // 颁发/生效日期, RFC3339 格式
    modified_at: string // 最近修改时间, RFC3339 格式
    version: string // 许可证版本
    content: string // 许可证详细内容(markdown)
}

// 计费中心注册响应
export interface BillingCenterRegisterRes {
    id: string // 应用ID
    created_at: string // 创建时间
    cert: string // 服务器证书
}

// 计费中心重置证书响应
export interface BillingCenterResetCertRes {
    cert: string // 服务器证书
}

// 充值下单响应
export interface BillingCenterRechargeRes {
    order_id: string // 订单ID
    pay_type: PayType // 支付类型
    pay_url: string // 支付链接
    time_expire: string // 过期时间
}

// 充值查询响应
export interface BillingCenterRechargeQueryRes {
    order_id: string // 订单ID
    pay_status: string // 支付状态
}

// 带标签的枚举值对象
export interface LabelValue<T> {
    value: T // 枚举值
    label: string // 显示标签
}

// 交易流水响应
export interface TransactionFlowRes {
    id: string // 流水ID
    created_at: string // 创建时间
    user_id: string // 用户ID
    related_id: string // 关联ID
    currency: LabelValue<Currency> // 货币类型
    type: LabelValue<TransactionType> // 交易类型
    amount: string // 金额(带符号, 单位元)
    balance_before: string // 变动前余额(元)
    balance_after: string // 变动后余额(元)
    description: string // 描述
}
