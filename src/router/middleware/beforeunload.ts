/**
 * @FilePath     : \blog-client\src\router\middleware\beforeunload.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 页面关闭事件
 */

import { LocalStorageKey } from "@/stores/local"
import { useUserStore } from "@/stores/user"

/**
 * 监听页面关闭事件, 即用户手动修改ULR或关闭页面, 用于提示用户是否保存未保存的数据
 *
 * 参考：https://developer.mozilla.org/zh-CN/docs/Web/API/Window/beforeunload_event
 */
export const beforeunloadMiddleware = async () => {
    const userStore = useUserStore()

    // 监听页面关闭事件,即用户手动修改ULR或关闭页面
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
        if (userStore.isEditing) {
            event.preventDefault()
            event.returnValue = "确认离开当前未保存编辑页面吗？"
        }

        // 清除需要处理的本地存储
        localStorage.removeItem(LocalStorageKey.OptionsApp)
        localStorage.removeItem(LocalStorageKey.OptionsHeadInfo)
        localStorage.removeItem(LocalStorageKey.OptionsNavList)
        localStorage.removeItem(LocalStorageKey.OptionsNavObj)
        localStorage.removeItem(LocalStorageKey.OptionsFooterInfo)
        localStorage.removeItem(LocalStorageKey.PostDetailEditEnable)
    }

    // 监听是否编辑状态, 如果用户正在编辑, 跳转到其他页面时, 提示是否离开编辑页面
    // 根据状态添加或移除 beforeunload 事件监听
    window.addEventListener("beforeunload", handleBeforeUnload)

    return true
}
