/**
 * @Author       : jiaopengzi
 * @Date         : 2024-12-31 17:30:34
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-31 18:08:11
 * @FilePath     : \blog-client\src\router\middleware\editor.ts
 * @Description  : 编辑器中间件
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import { type RouteLocationNormalized } from "vue-router"

import { useUserStore } from "@/stores/user"
import { confirmCommon } from "@/utils/confirm"

/**
 * 编辑器中间件 如果用户正在编辑，跳转到其他页面时，提示是否离开编辑页面
 *
 * @param to - 即将进入的路由对象
 * @param from - 当前导航正要离开的路由对象
 * @returns 如果用户正在编辑，且点击确认离开编辑页面，则返回 true；否则返回 false
 */
export const editorMiddleware = async (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
) => {
    const userStore = useUserStore()

    if (userStore.isEditing) {
        // 提示是否离开编辑页面
        try {
            await confirmCommon(
                "确认离开当前未保存编辑页面吗？",
                () => {
                    console.log("确认")
                    userStore.setIsEditing(false)
                },
                () => {
                    console.log("取消")
                    // 点击取消，不离开当前页面
                    throw new Error("Cancelled")
                },
            )
            return true
        } catch (e) {
            return false
        }
    } else {
        return true
    }
}
