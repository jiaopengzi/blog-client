/*
 * FilePath    : blog-client\src\components\hooks\usePayRolesSwitchItem\index.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 付费角色开关项
 */

import { reactive } from "vue"

import type { UpsertPostForm } from "@/components/common/post-upsert/types"
import type { SwitchItem, SwitchItemLabel } from "@/components/common/switch-group"
import { usePermissionRoleStore } from "@/stores/permissionRole"
// import type { ViewForm as AccountKeyForm } from "@/views/admin/component/main/account-key-all/component/view/types"

// type PayRolesForm = UpsertPostForm | AccountKeyForm
type PayRolesForm = UpsertPostForm

// 角色付费标签
const rolePaidLabel = (): SwitchItemLabel => {
    return {
        active: "免费",
        inactive: "付费",
    }
}

/**
 * 付费角色开关项
 * @param form - 包含 pay_roles 属性的表单对象
 * @param defaultActive - 角色的默认激活状态，默认为 false（付费）
 * @returns 角色付费管理列表及相关方法
 */
export function usePayRolesSwitchItem<T extends PayRolesForm>(form: T, defaultActive: boolean = false) {
    // 角色付费管理
    const rolePaidList: SwitchItem[] = reactive([])

    // 默认开关项
    const defaultSwitchItem = (): SwitchItem => {
        return {
            name: "",
            display: "",
            namePosition: "left",
            status: defaultActive,
            label: rolePaidLabel(),
            minWidth: 150,
        }
    }

    // 初始化角色付费管理都为付费状态，后续根据后端数据进行修改
    const initRolePaidManagement = async () => {
        const permissionRoleStore = usePermissionRoleStore()
        await permissionRoleStore.update(true) // 确保获取最新的角色数据

        // 首先从 系统角色列表 获取角色列表
        const { roles: rolesSystem } = permissionRoleStore.getSystemRoles

        // 历遍 rolesSystem 构造 rolePaidList
        rolesSystem.forEach((role) => {
            const switchItem: SwitchItem = defaultSwitchItem()
            switchItem.name = role.role_name
            switchItem.display = role.description

            rolePaidList.push(switchItem)
        })

        // 会员角色列表
        const membershipRoles = permissionRoleStore.getMembershipRoles

        // 如果有会员角色，则将其添加到 rolePaidList
        if (membershipRoles.length > 0) {
            membershipRoles.forEach((roleName) => {
                const switchItem = defaultSwitchItem()
                switchItem.name = roleName
                switchItem.display = roleName

                rolePaidList.push(switchItem)
            })
        }
    }

    // 更新角色付费管理
    const updateRolePaidList = (items: SwitchItem[]) => {
        // 更新 postInfoForm.pay_roles,筛选出 status 为 true 的角色
        form.pay_roles = items
            .filter((i) => i.status)
            .map((i) => {
                return i.name
            })
    }

    return {
        rolePaidList,
        initRolePaidManagement,
        updateRolePaidList,
    }
}
