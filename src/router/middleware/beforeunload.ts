/**
 * @FilePath     : \blog-client\src\router\middleware\beforeunload.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 页面关闭事件
 */

import { watch } from "vue"
import { type RouteLocationNormalized } from "vue-router"

import { useUserStore } from "@/stores/user"

/**
 * 监听页面关闭事件, 即用户手动修改ULR或关闭页面, 用于提示用户是否保存未保存的数据
 *
 * 参考：https://developer.mozilla.org/zh-CN/docs/Web/API/Window/beforeunload_event
 */
export const beforeunloadMiddleware = async (to: RouteLocationNormalized, from: RouteLocationNormalized) => {
    const userStore = useUserStore()

    // 监听页面关闭事件,即用户手动修改ULR或关闭页面
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
        event.preventDefault()
        event.returnValue = ""
    }

    // 监听是否编辑状态, 如果用户正在编辑, 跳转到其他页面时, 提示是否离开编辑页面
    // 根据状态添加或移除 beforeunload 事件监听
    watch(
        () => userStore.isEditing,
        (newVal) => {
            if (newVal) {
                window.addEventListener("beforeunload", handleBeforeUnload)
            } else {
                window.removeEventListener("beforeunload", handleBeforeUnload)
            }
        },
    )

    return true
}
