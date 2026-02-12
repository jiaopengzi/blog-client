/*
 * FilePath    : blog-client\src\components\common\pay-qr-code\types.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 类型
 */

import type { PayType } from "@/api/pay/common"

export interface PayQrCodeProps {
    qrCodeUrl?: string // 二维码图片URL
    payType?: PayType // 支付方式
    amount?: string // 支付金额元
}
