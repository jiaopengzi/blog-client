/*
 * FilePath    : blog-client\src\api\setting\getPayConfig.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 获取支付配置
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

// 微信支付配置
export interface WeChatPayConf {
    enabled: boolean // 是否启用微信支付
    mch_id: string // 商户号
    mch_certificate_serial_number: string // 商户证书序列号
    mch_private_key: string // 商户私钥
    app_id: string // 应用ID
    api_v3_key: string // APIv3密钥
    notify_host: string // 支付通知主机地址，包含协议端口，末尾不包含 /
    notify_path: string // 支付结果通知地址
    refund_path: string // 退款结果通知地址
}

// 支付宝支付配置
export interface AliPayConf {
    enabled: boolean // 是否启用支付宝支付
    app_id: string // 支付宝应用ID
    seller_id: string // 支付宝商户ID
    app_private_key: string // 支付商户私钥
    alipay_public_key: string // 支付宝公钥
    encrypt_key: string // 可选，接口内容加密密钥
    notify_host: string // 支付通知主机地址，包含协议端口，末尾不包含 /
    notify_path: string // 支付结果通知地址
    refund_path: string // 退款结果通知地址
    is_production: boolean // 是否为生产环境，默认为 false（沙箱环境）
}

export interface GetPayConfigResponse {
    wechat_pay: WeChatPayConf // 微信支付配置
    alipay: AliPayConf // 支付宝支付配置
}

// 获取支付配置
export function getPayConfigAPI(): ResPromise<Res<GetPayConfigResponse>> {
    const urlStr = routerGroup + "/setting/get-pay-config"
    return request({
        url: urlStr,
        method: "get",
    })
}
