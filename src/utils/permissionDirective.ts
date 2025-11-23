/*
 * FilePath    : blog-client\src\utils\permissionDirective.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 权限指令
 */

import type { Directive, DirectiveBinding } from "vue"

import { PermissionNames } from "@/stores/permissionRole"
import { useUserStore } from "@/stores/user"

// 权限指令, 如果没有权限则移除元素.
export const permissionDirective: Directive = {
    mounted(el: HTMLElement, binding: DirectiveBinding<PermissionNames>) {
        // 获取用户信息
        const userStore = useUserStore()
        const permission = binding.value
        const hasPerm = userStore.hasPermission(permission)
        if (!hasPerm) {
            el.parentNode?.removeChild(el)
        }
    },
}
