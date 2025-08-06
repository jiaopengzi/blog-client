/*
 * FilePath    : blog-client\src\components\common\post-detail\hooks\useOrder.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 订单相关的hook
 */

import { type Ref, ref } from "vue"
import { useRouter } from "vue-router"

import { type MembershipRes } from "@/api/membership/common"
import { ProductType } from "@/api/order/common"
import { type Product } from "@/api/order/create"
import { orderCreateAPI, type OrderCreateRequest } from "@/api/order/create"
import { handleResErr, ResponseCode } from "@/api/response"
import { ContentPayType } from "@/components/common/pay-content"
import { RouteNames } from "@/router"
import { useUserStore } from "@/stores/user"
import { MessageUtil } from "@/utils/message"

export function useOrder(postId: Ref<string>) {
    const router = useRouter()
    const userStore = useUserStore()
    const isPayLoading = ref(false) // 是否正在加载支付信息
    const returnUrl = ref<string>("") // 支付完成后返回的URL

    const orderReq = ref<OrderCreateRequest>({
        products: [
            {
                related_id: postId.value,
                product_type: ProductType.Post, // 产品类型为文章
                quantity: "1", // 数量
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
            router.push({ name: RouteNames.Checkout })
        } else {
            isPayLoading.value = false
            handleResErr(res.data)
            MessageUtil.error(handleResErr(res))
        }
    }

    // 处理支付单篇文章
    const handlePaySingle = async (val: ContentPayType) => {
        // 更新返回URL
        await updateUrl()
        // 如果用户没有登录，且访问的页面需要登录，则跳转到登录页
        if (!userStore.isLogin) {
            await router.push({ name: RouteNames.Login, query: { redirect: orderReq.value.return_url } }) // 重定向到登录页带上当前页面路径参数
            return
        }

        await createOrder()
    }

    // 处理支付成为 VIP
    const handlePayVip = async (val: ContentPayType) => {
        // 更新返回URL
        await updateUrl()
        // 如果用户没有登录，且访问的页面需要登录，则跳转到登录页
        if (!userStore.isLogin) {
            await router.push({ name: RouteNames.Login, query: { redirect: orderReq.value.return_url } }) // 重定向到登录页带上当前页面路径参数
            return
        }
        // 更新路由
        await router.push({ name: RouteNames.Page, params: { customPath: "vip" } })
    }

    // 处理支付成为会员
    const handlePayMembership = async (val: MembershipRes) => {
        const product: Product = {
            related_id: val.id,
            product_type: ProductType.Membership, // 产品类型为会员
            quantity: "1", // 数量
        }

        orderReq.value.products = [product] // 更新订单请求数据中的产品列表

        // 更新返回URL
        await updateUrl()

        // 如果用户没有登录，且访问的页面需要登录，则跳转到登录页
        if (!userStore.isLogin) {
            await router.push({ name: RouteNames.Login, query: { redirect: orderReq.value.return_url } }) // 重定向到登录页带上当前页面路径参数
            return
        }

        await createOrder()
    }

    return {
        handlePaySingle,
        handlePayVip,
        handlePayMembership,
        isPayLoading,
    }
}
