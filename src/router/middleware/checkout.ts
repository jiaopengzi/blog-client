/*
 * FilePath    : blog-client\src\router\middleware\checkout.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 支付页状态更新
 */

import { type RouteLocationNormalized } from "vue-router"

import { useOptionsStore } from "@/stores/options"

import { RouteNames } from "../types"

/**
 * 支付页中间件, 进入支付页时更新支付信息配置
 *
 * @param to - 即将进入的路由对象
 * @param from - 当前导航正要离开的路由对象
 */
export const checkoutMiddleware = async (to: RouteLocationNormalized) => {
    if (to.name === RouteNames.Checkout) {
        const optionsStore = useOptionsStore()
        await optionsStore.updatePayConfig()
    }

    return true
}
