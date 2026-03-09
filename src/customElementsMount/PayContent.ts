/*
 * FilePath    : blog-client\src\customElementsMount\PayContent.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 付费内容挂载
 */

import { type ComputedRef, createApp, h } from "vue"

import { PayStrategy, type PostVideoTocTree } from "@/api/post/common"
import PayContent, { ContentPayType, type PayContentProps } from "@/components/common/pay-content"

import { Names } from "../customElements"
import { getComponentContainersFromCustomElements } from "./getComponentContainers"
import { convertEmits } from "./utils"

/**
 * @description: 挂载付费内容组件到自定义元素
 * @param container 自定义元素父容器
 * @param tagName 自定义元素标签名
 * @param contentPayType 付费内容类型
 * @param createOrderLoading 创建订单加载状态
 * @param emits 组件事件
 * @param isPaid 是否付费阅读
 * @param payStrategy 付费策略
 * @param price 价格
 * @param isAdminVideo 是否使用管理员视频接口
 * @param postId 文章ID
 * @param videoToc 付费视频目录
 */
export const mountPayContentOnCustomElements = (
    container: HTMLElement,
    tagName: Names,
    contentPayType: ContentPayType,
    createOrderLoading: ComputedRef<boolean>,

    // **注意这里函数的写法必须是on开头的后续跟驼峰格式的事件名**
    emits: {
        onPayVip?: (val: ContentPayType) => void // vip
        onPaySingle?: (val: ContentPayType) => void // 单独购买
    } = {},

    isPaid?: ComputedRef<boolean>, // 是否已经付费
    payStrategy?: ComputedRef<PayStrategy>, // 付费策略
    price?: ComputedRef<string>, // 价格(单位：分)
    onlyMarkdown?: boolean, // 仅渲染 markdown 内容
    isAdminVideo?: ComputedRef<boolean>, // 是否使用管理员视频接口
    postId?: ComputedRef<string>, // 文章ID
    videoToc?: ComputedRef<PostVideoTocTree[]>, // 付费视频目录
) => {
    const componentContainers = getComponentContainersFromCustomElements(container, tagName)
    if (!componentContainers) return
    componentContainers.forEach((el) => {
        const content = el.innerHTML

        const props: PayContentProps = {
            contentPayType,
            markdown: content,
        }

        // 自动将 emits 的事件转为组件事件(示例: onPayVip -> onPay-vip)
        const vueEmits = convertEmits<ContentPayType>(emits)

        const app = createApp({
            render() {
                return h(PayContent, {
                    ...props,
                    loading: createOrderLoading.value,
                    isPaid: isPaid?.value || false, // 是否已经付费
                    payStrategy: payStrategy?.value || PayStrategy.All, // 付费策略
                    price: price?.value || "0", // 价格(单位：分)
                    isAdminVideo: isAdminVideo?.value || false, // 是否使用管理员视频接口
                    postId: postId?.value || "", // 文章ID
                    videoToc: videoToc?.value || [], // 付费视频目录
                    onlyMarkdown,
                    ...vueEmits, // 将转换后的事件传递给组件
                })
            },
        })

        app.mount(el)
    })
}
