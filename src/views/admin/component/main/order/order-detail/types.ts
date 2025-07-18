/*
 * FilePath    : blog-client\src\views\admin\component\main\order\order-detail\types.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 类型
 */

export interface OrderRemark {
    id: string // 订单ID
    remark: string // 退款金额，单位为分
    remark_admin: string // 退款原因
}
