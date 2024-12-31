/**
 * @Author       : jiaopengzi
 * @Date         : 2024-12-28 15:27:53
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-31 17:16:28
 * @FilePath     : \blog-client\src\components\hooks\useGlobal\index.ts
 * @Description  : 全局钩子
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import { watch } from "vue"
import { useUserStore } from "@/stores/user"

/**
 * @description: 基础表格钩子
 * @param routeName 路由名称
 * @param viewAPI 获取数据的 API
 * @param viewResCode 获取数据的响应码
 * @param deleteAPI 删除数据的 API
 * @param deleteResCode 删除数据的响应码
 * @param queryParams 查询参数
 * @param options 可选参数
 */
export async function useGlobal() {
    const userStore = useUserStore()
    await userStore.getUserInfoByToken()

    // 监听页面关闭事件,即用户手动修改ULR或关闭页面
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
        // 参考：https://developer.mozilla.org/zh-CN/docs/Web/API/Window/beforeunload_event
        event.preventDefault()
        event.returnValue = ""
    }

    // 监听是否编辑状态
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
}
