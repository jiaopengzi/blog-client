/*
 * FilePath    : blog-client\src\api\notification\common.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 通知共用内容
 */

import { type PgSqlDateTime } from "@/api/common"
import type { DataWithImg } from "@/components/common"

// 通知状态
export enum NotificationStatus {
    Disabled = 1, // 禁用
    Enabled = 2, // 启用
}

// 通知状态显示
export const NotificationStatusDisplay: Record<NotificationStatus, string> = {
    [NotificationStatus.Disabled]: "禁用",
    [NotificationStatus.Enabled]: "启用",
}

// 获取通知状态选项
export const getNotificationStatusOptions = () => {
    return [
        { label: NotificationStatusDisplay[NotificationStatus.Disabled], value: NotificationStatus.Disabled },
        { label: NotificationStatusDisplay[NotificationStatus.Enabled], value: NotificationStatus.Enabled },
    ]
}

// 通知推送状态
export enum NotificationPushStatus {
    NotPushed = 1, // 未推送
    Pushing = 2, // 推送中
    IsPushed = 3, // 已推送
}

// 通知推送状态显示
export const NotificationPushStatusDisplay: Record<NotificationPushStatus, string> = {
    [NotificationPushStatus.NotPushed]: "未推送",
    [NotificationPushStatus.Pushing]: "推送中",
    [NotificationPushStatus.IsPushed]: "已推送",
}

// 获取通知推送状态选项
export const getNotificationPushStatusOptions = () => {
    return [
        { label: NotificationPushStatusDisplay[NotificationPushStatus.NotPushed], value: NotificationPushStatus.NotPushed },
        { label: NotificationPushStatusDisplay[NotificationPushStatus.Pushing], value: NotificationPushStatus.Pushing },
        { label: NotificationPushStatusDisplay[NotificationPushStatus.IsPushed], value: NotificationPushStatus.IsPushed },
    ]
}

// 通知格式
export enum NotificationFormat {
    HTML = 1, // HTML
    PlainText = 2, // 纯文本
}

// 通知格式显示
export const NotificationFormatDisplay: Record<NotificationFormat, string> = {
    [NotificationFormat.HTML]: "HTML",
    [NotificationFormat.PlainText]: "纯文本",
}

// 获取通知格式选项
export const getNotificationFormatOptions = () => {
    return [
        { label: NotificationFormatDisplay[NotificationFormat.HTML], value: NotificationFormat.HTML },
        { label: NotificationFormatDisplay[NotificationFormat.PlainText], value: NotificationFormat.PlainText },
    ]
}

// 通知类别
export enum NotificationCategory {
    ScheduledTask = 1, // 定时任务
    UserRegister = 2, // 用户注册
    UserLogin = 3, // 用户登录
}

// 通知类别显示
export const NotificationCategoryDisplay: Record<NotificationCategory, string> = {
    [NotificationCategory.ScheduledTask]: "定时任务",
    [NotificationCategory.UserRegister]: "用户注册",
    [NotificationCategory.UserLogin]: "用户登录",
}

// 获取通知类别选项
export const getNotificationCategoryOptions = () => {
    return [
        { label: NotificationCategoryDisplay[NotificationCategory.ScheduledTask], value: NotificationCategory.ScheduledTask },
        { label: NotificationCategoryDisplay[NotificationCategory.UserRegister], value: NotificationCategory.UserRegister },
        { label: NotificationCategoryDisplay[NotificationCategory.UserLogin], value: NotificationCategory.UserLogin },
    ]
}

export interface InsertNotificationRequest {
    to_list?: string // 通知接收人列表,逗号分隔
    exclude_to_list?: string // 排除的接收人列表,逗号分隔
    subject: string // 通知主题
    content: string // 通知内容
    push_time?: PgSqlDateTime // 推送时间
    push_status?: NotificationPushStatus // 是否已推送, 1未推送,2推送中,3已推送
    category: NotificationCategory // 通知类别
    status: NotificationStatus // 状态 1禁用, 2启用
    format: NotificationFormat // 通知格式 1html, 2纯文本
}

export interface UpdateNotificationRequest extends InsertNotificationRequest {
    id: string // 通知id
}

// 通知
export interface NotificationRes extends DataWithImg {
    id: string // id
    created_at: string // 创建时间
    updated_at: string // 更新时间
    to_list: string // 通知接收人列表,逗号分隔
    exclude_to_list: string // 排除的接收人列表,逗号分隔
    subject: string // 通知主题
    content: string // 通知内容
    push_time: PgSqlDateTime // 推送时间
    push_status: NotificationPushStatus // 是否已推送, 1未推送,2推送中,3已推送
    category: NotificationCategory // 通知类别
    status: NotificationStatus // 状态 1禁用, 2启用
    format: NotificationFormat // 通知格式 1html, 2纯文本
}
