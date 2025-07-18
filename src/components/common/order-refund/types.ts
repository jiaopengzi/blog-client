/*
 * FilePath    : blog-client\src\components\common\order-refund\types.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 类型
 */

// 订单退款表单数据类型
export interface OrderRefundForm {
    id: string // 订单ID
    refund_amount: number // 退款金额，单位为分
    reason: string // 退款原因，选填
    captcha: string // 验证码
}
