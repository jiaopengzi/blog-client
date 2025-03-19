/**
 * @FilePath     : \blog-client\src\views\admin\component\main\post-write\useSwitchItem.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 开关项
 */

import { reactive, ref } from "vue"

import { CommentStatusCode } from "@/api/post/common"
import type { SwitchItem, SwitchItemLabel } from "@/components/common/switch-group"
import { LocalStorageKey } from "@/stores/local"
import { usePermissionRoleStore } from "@/stores/permissionRole"

import type { UpsertPostForm } from "./index"

/**
 * 使用开关项
 * @param postInfoForm 文章表单
 */
export function useSwitchItem(postInfoForm: UpsertPostForm) {
    // 公用开关项标签
    const commonSwitchItemLabel: SwitchItemLabel = {
        active: "开启",
        inactive: "关闭",
    }

    // 常规设置是否展示
    const defaultStatusIsShow = ref(localStorage.getItem(LocalStorageKey.IsShowSeoAtPostWrite) == "true")
    const defaultStatus: SwitchItem[] = reactive([
        {
            name: "defaultStatus",
            display: "常规设置",
            namePosition: "left",
            status: localStorage.getItem(LocalStorageKey.IsShowSeoAtPostWrite) == "true",
            label: {
                active: "展开",
                inactive: "折叠",
            },
        },
    ])

    // 更新常规设置是否展示
    const updateDefaultStatus = (items: SwitchItem[]) => {
        defaultStatusIsShow.value = items[0].status
        localStorage.setItem(LocalStorageKey.IsShowSeoAtPostWrite, items[0].status.toString())
    }

    // 角色付费管理
    const rolePaidList: SwitchItem[] = reactive([])

    const rolePaidLabel: SwitchItemLabel = {
        active: "免费",
        inactive: "付费",
    }

    // 初始化角色付费管理都为付费状态，后续根据后端数据进行修改
    const initRolePaidManagement = () => {
        const permissionRoleStore = usePermissionRoleStore()
        // 首先从 系统角色列表 获取角色列表
        const { roles: rolesSystem } = permissionRoleStore.getRoleList
        // 历遍 rolesSystem 构造 rolePaidList
        rolesSystem.forEach((role) => {
            const switchItem: SwitchItem = {
                name: role.role_name,
                display: role.description,
                namePosition: "left",
                status: false,
                label: rolePaidLabel,
                minWidth: 180,
            }
            rolePaidList.push(switchItem)
        })

        // TODO 从商城角色列表获取角色列表
    }

    // 更新角色付费管理
    const updateRolePaidList = (items: SwitchItem[]) => {
        // 更新 postInfoForm.pay_roles,筛选出 status 为 true 的角色
        postInfoForm.pay_roles = items
            .filter((i) => i.status)
            .map((i) => {
                return i.name
            })
    }

    // 评论状态
    const commentStatus: SwitchItem[] = reactive([
        {
            name: "commentStatus",
            status: true,
            label: commonSwitchItemLabel,
        },
    ])

    // 更新评论状态
    const updateCommentStatus = (items: SwitchItem[]) => {
        // 更新 postInfoForm.comment_status
        postInfoForm.comment_status = items[0].status ? CommentStatusCode.Open : CommentStatusCode.Close
    }

    // 文章显示方式
    const postShowMethod: SwitchItem[] = reactive([
        {
            name: "is_pinned",
            display: "文章置顶",
            namePosition: "left",
            status: false,
            label: commonSwitchItemLabel,
            minWidth: 180,
        },
        {
            name: "is_recommended",
            display: "推荐阅读",
            namePosition: "left",
            status: false,
            label: commonSwitchItemLabel,
            minWidth: 180,
        },
    ])

    // 更新文章显示方式
    const updatePostShowMethod = (items: SwitchItem[]) => {
        items.forEach((item) => {
            ;(postInfoForm as unknown as Record<string, number>)[item.name] = item.status ? 1 : 0
        })
    }

    return {
        defaultStatusIsShow,
        updateDefaultStatus,
        defaultStatus,
        rolePaidList,
        initRolePaidManagement,
        updateRolePaidList,
        commentStatus,
        updateCommentStatus,
        postShowMethod,
        updatePostShowMethod,
    }
}
