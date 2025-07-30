/*
 * FilePath    : blog-client\src\components\common\post-detail\hooks\useOrder.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 订单相关的hook
 */

import { type Ref, ref } from "vue"
import { useRouter } from "vue-router"

import { ProductType } from "@/api/order/common"
import { orderCreateAPI, type OrderCreateRequest } from "@/api/order/create"
import { handleResErr, ResponseCode } from "@/api/response"
import { ContentPayType } from "@/components/common/pay-content"
import { RouteNames } from "@/router"
import { MessageUtil } from "@/utils/message"

export function useOrder(postId: Ref<string>) {
    const router = useRouter()
    const isPayLoading = ref(false) // 是否正在加载支付信息
    const returnUrl = ref<string>("") // 支付完成后返回的URL

    const orderReq = ref<OrderCreateRequest>({
        products: [
            {
                related_id: postId.value,
                product_type: ProductType.Post, // 产品类型为文章
                quantity: "1", // 文章名称
            },
        ],
        remark: "",
        return_url: window.location.href,
    })

    // 更新返回URL
    const updateUrl = async () => {
        // 获取协议（例如 "http:" 或 "https:"）
        const protocol = window.location.protocol

        // 获取域名
        const domain = window.location.hostname

        // 获取端口
        const port = window.location.port

        // 获取当前路由的完整路径
        const fullPath = router.currentRoute.value.fullPath

        // 拼接完整的 URL
        returnUrl.value = `${protocol}//${domain}${port ? `:${port}` : ""}${fullPath}`
        orderReq.value.return_url = returnUrl.value // 更新订单请求数据中的返回URL
    }

    // 创建订单
    const createOrder = async () => {
        isPayLoading.value = true
        const res = await orderCreateAPI(orderReq.value)
        if (res.data.code === ResponseCode.OrderCreateSuccess) {
            isPayLoading.value = false

            // 已知 orderRes.value 就是 页面 RouteNames.Checkout 的props 如何跳转
            router.push({ name: RouteNames.Checkout })
        } else {
            isPayLoading.value = false
            handleResErr(res.data)
            MessageUtil.error(handleResErr(res))
        }
    }

    // 处理支付单篇文章
    const handlePaySingle = async (val: ContentPayType) => {
        console.log("============>val", val)
        // 更新返回URL
        await updateUrl()
        await createOrder()
    }

    // 处理支付成为 VIP
    const handlePayVip = async (val: ContentPayType) => {
        console.log("============>val", val)
        // 更新返回URL
        await updateUrl()
    }

    return {
        handlePaySingle,
        handlePayVip,
        isPayLoading,
    }
}
