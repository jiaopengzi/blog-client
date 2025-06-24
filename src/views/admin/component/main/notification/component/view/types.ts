/*
 * FilePath    : blog-client\src\views\admin\component\main\notification\component\view\types.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 类型
 */

import { type PgSqlDateTime } from "@/api/common"
import { NotificationCategory, NotificationFormat, NotificationPushStatus, NotificationStatus } from "@/api/notification/common"

export interface ViewForm {
    id?: string // ID
    to_list?: string // 通知接收人列表,逗号分隔
    exclude_to_list?: string // 排除的接收人列表,逗号分隔
    subject: string // 通知主题
    content: string // 通知内容
    push_time: PgSqlDateTime // 推送时间
    push_status?: NotificationPushStatus // 是否已推送, 1未推送,2推送中,3已推送
    category: NotificationCategory // 通知类别
    status: NotificationStatus // 状态 1禁用, 2启用
    format: NotificationFormat // 通知格式 1html, 2纯文本
}
