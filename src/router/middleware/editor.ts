/**
 * @FilePath     : \blog-client\src\router\middleware\editor.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 编辑器中间件
 */

import { type RouteLocationNormalized } from "vue-router"

import { useUserStore } from "@/stores/user"
import { confirmCommon } from "@/utils/confirm"

import { RouteNames } from "../types"
/**
 * 编辑器中间件 如果用户正在编辑，跳转到其他页面时，提示是否离开编辑页面
 *
 * @param to - 即将进入的路由对象
 * @param from - 当前导航正要离开的路由对象
 * @returns 如果用户正在编辑，且点击确认离开编辑页面，则返回 true；否则返回 false
 */
export const editorMiddleware = async (to: RouteLocationNormalized) => {
    const userStore = useUserStore()

    if (userStore.isEditing) {
        // 当前情况为从主页编辑按钮进入编辑页面，直接阻止跳转
        if (to.name === RouteNames.PostWrite) {
            return false
        }

        // 提示是否离开编辑页面
        try {
            let flag = true
            // 等待用户确认
            await confirmCommon(
                "确认离开当前未保存编辑页面吗？",
                () => {
                    console.log("确认")
                    userStore.setIsEditing(false)
                    flag = true
                },
                () => {
                    console.log("取消")
                    flag = false
                },
            )

            return flag
        } catch (e) {
            console.error("用户取消了离开编辑页面的操作", e)
            return false
        }
    } else {
        return true
    }
}
