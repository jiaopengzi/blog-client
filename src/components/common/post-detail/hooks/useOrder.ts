/*
 * FilePath    : blog-client-nuxt\src\components\common\post-detail\hooks\useOrder.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 订单相关的 hook
 */

import { type Ref, ref } from "vue"

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
    const isPayLoading = ref(false)
    const returnUrl = ref<string>("") // 支付完成后返回的 URL

    // SSR 守卫(feature02): 服务端无 window, return_url 先置空, 客户端下单前由 updateUrl 校准
    const orderReq = ref<OrderCreateRequest>({
        products: [
            {
                related_id: postId.value,
                product_type: ProductType.Post, // 产品类型为文章
                quantity: "1",
            },
        ],
        remark: "",
        return_url: typeof window !== "undefined" ? window.location.href : "",
    })

    const updateUrl = async () => {
        // 获取协议 (例如 "http:" 或 "https:")
        const protocol = window.location.protocol

        const domain = window.location.hostname

        const port = window.location.port

        const fullPath = router.currentRoute.value.fullPath

        returnUrl.value = `${protocol}//${domain}${port ? `:${port}` : ""}${fullPath}`
        orderReq.value.return_url = returnUrl.value
    }

    const createOrder = async () => {
        isPayLoading.value = true
        const res = await orderCreateAPI(orderReq.value)
        if (res.data.code === ResponseCode.OrderCreateSuccess) {
            isPayLoading.value = false
            router.push({ name: RouteNames.Checkout })
        } else {
            isPayLoading.value = false
            MessageUtil.error(handleResErr(res))
        }
    }

    const handlePaySingle = async (_val: ContentPayType) => {
        await updateUrl()

        // 如果用户没有登录, 且访问的页面需要登录, 则跳转到登录页
        if (!userStore.isLogin) {
            await router.push({ name: RouteNames.Login, query: { redirect: orderReq.value.return_url } }) // 重定向到登录页带上当前页面路径参数
            return
        }

        await createOrder()
    }

    const handlePayVip = async (_val: ContentPayType) => {
        await updateUrl()

        // 如果用户没有登录, 且访问的页面需要登录, 则跳转到登录页
        if (!userStore.isLogin) {
            await router.push({ name: RouteNames.Login, query: { redirect: orderReq.value.return_url } }) // 重定向到登录页带上当前页面路径参数
            return
        }

        await router.push({ name: RouteNames.Page, params: { customPath: "vip" } })
    }

    const handlePayKey = async (val: Product) => {
        orderReq.value.products = [val]

        await updateUrl()

        // 如果用户没有登录, 且访问的页面需要登录, 则跳转到登录页
        if (!userStore.isLogin) {
            await router.push({ name: RouteNames.Login, query: { redirect: orderReq.value.return_url } }) // 重定向到登录页带上当前页面路径参数
            return
        }

        await createOrder()
    }

    const handlePayMembership = async (val: MembershipRes) => {
        const product: Product = {
            related_id: val.id,
            product_type: ProductType.Membership, // 产品类型为会员
            quantity: "1",
        }

        orderReq.value.products = [product]

        await updateUrl()

        // 如果用户没有登录, 且访问的页面需要登录, 则跳转到登录页
        if (!userStore.isLogin) {
            await router.push({ name: RouteNames.Login, query: { redirect: orderReq.value.return_url } }) // 重定向到登录页带上当前页面路径参数
            return
        }

        await createOrder()
    }

    return {
        handlePaySingle,
        handlePayVip,
        handlePayKey,
        handlePayMembership,
        isPayLoading,
    }
}
