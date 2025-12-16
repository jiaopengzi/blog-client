/*
 * FilePath    : blog-client\src\api\pay\common.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 支付共用内容
 */

// 趋势类别
export enum TrendCategory {
    OrderCount = "order_count", // 订单数量
    OrderAmount = "order_amount", // 订单金额
    OrderPaidCount = "order_paid_count", // 支付订单
    OrderPaidAmount = "order_paid_amount", // 支付金额
    UserCount = "user_count", // 用户数量
    MembershipCount = "membership_count", // 会员数量
}

// 趋势类别显示
export const TrendCategoryDisplay: Record<TrendCategory, string> = {
    [TrendCategory.OrderCount]: "订单数量",
    [TrendCategory.OrderAmount]: "订单金额",
    [TrendCategory.OrderPaidCount]: "支付订单",
    [TrendCategory.OrderPaidAmount]: "支付金额",
    [TrendCategory.UserCount]: "用户数量",
    [TrendCategory.MembershipCount]: "会员数量",
}

// 趋势类别选项
export const getTrendCategoryOptions = () => {
    return Object.values(TrendCategory).map((value) => ({
        label: TrendCategoryDisplay[value as TrendCategory],
        value: value as TrendCategory,
    }))
}

// 时间维度
export enum TimeDimension {
    Hour = "hour", // 小时维度
    Day = "day", // 天维度
    Week = "week", // 周维度
    Month = "month", // 月维度
    Year = "year", // 年维度
}

// 时间维度显示
export const TimeDimensionDisplay: Record<TimeDimension, string> = {
    [TimeDimension.Hour]: "小时",
    [TimeDimension.Day]: "天",
    [TimeDimension.Week]: "周",
    [TimeDimension.Month]: "月",
    [TimeDimension.Year]: "年",
}

// 时间维度选项
export const getTimeDimensionOptions = () => {
    return Object.values(TimeDimension).map((value) => ({
        label: TimeDimensionDisplay[value as TimeDimension],
        value: value as TimeDimension,
    }))
}

// 统计数据响应键枚举
export enum StatsResKey {
    PostCount = "post_count", // 文章数量
    CommentCount = "comment_count", // 评论数量
    CommentCountPending = "comment_count_pending", // 待审核评论数量
    OrderCount = "order_count", // 订单数量
    OrderTotalAmount = "order_total_amount", // 订单总金额(分)
    OrderPaidCount = "order_paid_count", // 支付订单数量
    OrderPaidTotalAmount = "order_paid_total_amount", // 订单总支付金额(分)
    UserCount = "user_count", // 用户数量
}

// 统计数据响应键显示
export const StatsResKeyDisplay: Record<StatsResKey, string> = {
    [StatsResKey.PostCount]: "文章",
    [StatsResKey.CommentCount]: "评论",
    [StatsResKey.CommentCountPending]: "待审评论",
    [StatsResKey.OrderCount]: "订单数量",
    [StatsResKey.OrderTotalAmount]: "订单金额(元)",
    [StatsResKey.OrderPaidCount]: "支付订单数量",
    [StatsResKey.OrderPaidTotalAmount]: "支付金额(元)",
    [StatsResKey.UserCount]: "用户数量",
}

// 统计数据响应键选项
export const getStatsResKeyOptions = () => {
    return Object.values(StatsResKey).map((value) => ({
        label: StatsResKeyDisplay[value as StatsResKey],
        value: value as StatsResKey,
    }))
}

// 统计行
export interface Row {
    label: string // 标签
    value: number // 数值
}
