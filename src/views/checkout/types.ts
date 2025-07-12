/*
 * FilePath    : blog-client\src\views\checkout\types.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 结算类型
 */

import { PayType } from "@/api/pay/common"

export interface ViewForm {
    order_id: string
    pay_type: PayType
    coupon_code?: string
}
