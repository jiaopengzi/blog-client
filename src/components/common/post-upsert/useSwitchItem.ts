/*
 * FilePath    : blog-client\src\components\common\post-upsert\useSwitchItem.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 开关组件逻辑
 */

import { type Reactive, reactive, ref } from "vue"

import { CommentStatusCode, PostType } from "@/api/post/common"
import type { SwitchItem, SwitchItemLabel } from "@/components/common/switch-group"
import { usePayRolesSwitchItem } from "@/components/hooks/usePayRolesSwitchItem"
import { LocalStorageKey } from "@/stores/local"

import type { UpsertPostForm } from "./types"

/**
 * 使用开关项
 * @param postInfoForm 文章表单
 */
export function useSwitchItem(postInfoForm: Reactive<UpsertPostForm>) {
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
        defaultStatusIsShow.value = items[0]!.status
        localStorage.setItem(LocalStorageKey.IsShowSeoAtPostWrite, items[0]!.status.toString())
    }

    // 展开常规设置
    const unfoldDefaultStatus = () => {
        defaultStatus[0]!.status = true
        defaultStatusIsShow.value = true
        localStorage.setItem(LocalStorageKey.IsShowSeoAtPostWrite, "true")
    }

    // 折叠常规设置
    const foldDefaultStatus = () => {
        defaultStatus[0]!.status = false
        defaultStatusIsShow.value = false
        localStorage.setItem(LocalStorageKey.IsShowSeoAtPostWrite, "false")
    }

    // 评论状态
    const commentStatus: SwitchItem[] = reactive([
        {
            name: "commentStatus",
            status: postInfoForm.comment_status === CommentStatusCode.Open,
            label: commonSwitchItemLabel,
        },
    ])

    // 更新评论状态
    const updateCommentStatus = (items: SwitchItem[]) => {
        // 更新 postInfoForm.comment_status
        postInfoForm.comment_status = items[0]!.status ? CommentStatusCode.Open : CommentStatusCode.Close
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

    // 付费角色开关项
    const { rolePaidList, initRolePaidManagement, updateRolePaidList } = usePayRolesSwitchItem(
        postInfoForm,
        postInfoForm.post_type === PostType.Page ? true : false, // 如果是页面类型，则默认开启
    )

    return {
        defaultStatusIsShow,
        updateDefaultStatus,
        defaultStatus,
        unfoldDefaultStatus,
        foldDefaultStatus,
        commentStatus,
        updateCommentStatus,
        postShowMethod,
        updatePostShowMethod,
        rolePaidList,
        initRolePaidManagement,
        updateRolePaidList,
    }
}
