/*
 * FilePath    : blog-client-nuxt\src\customElementsMount\PayMembership.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 会员支付
 */

import { type ComputedRef, createApp, h } from "vue"

import { type MembershipRes } from "@/api/membership/common"
import PayMembership from "@/components/common/pay-membership"

import { Names } from "../customElements/constants"
import { getComponentContainersFromCustomElements } from "./getComponentContainers"
import { convertEmits } from "./utils"

/**
 * @description: 挂载会员支付组件到自定义元素
 * @param container 自定义元素父容器
 * @param tagName 自定义元素标签名
 * @param emits 组件事件
 */
export const mountPayMembershipOnCustomElements = (
    container: HTMLElement,
    tagName: Names,
    createOrderLoading: ComputedRef<boolean>,

    // **注意这里函数的写法必须是 on 开头的后续跟驼峰格式的事件名**
    emits: {
        onPayMembership?: (val: MembershipRes) => void // 会员支付事件
    } = {},
) => {
    const componentContainers = getComponentContainersFromCustomElements(container, tagName)
    if (!componentContainers) return
    componentContainers.forEach((el) => {
        // 自动将 emits 的事件转为组件事件
        const vueEmits = convertEmits<MembershipRes>(emits)

        const app = createApp({
            render() {
                return h(PayMembership, {
                    loading: createOrderLoading.value,
                    ...vueEmits, // 将转换后的事件传递给组件
                })
            },
        })

        app.mount(el)
    })
}
