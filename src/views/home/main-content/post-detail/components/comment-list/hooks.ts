/*
 * FilePath    : blog-client\src\views\home\main-content\post-detail\components\comment-list\hooks.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 评论列表的hooks
 */

import type { Completion } from "@codemirror/autocomplete"
import { type Reactive, reactive, ref } from "vue"

import { CommentPinnedCode, type CommentRes } from "@/api/comment/common"
import { viewByPostIDAPI, type ViewCommentRequest } from "@/api/comment/viewByPostID"
import { getEmptyPagination, type Pagination, ResponseCode } from "@/api/response"
import { usePaginationComment } from "@/components/hooks/usePagination"

export function useCommentList(req: Reactive<ViewCommentRequest>) {
    const isShowLoading = ref<boolean>(false) // 是否显示加载动画

    const pagination = reactive<Pagination<CommentRes>>(getEmptyPagination<CommentRes>()) // 分页数据

    const mentions = ref<Completion[]>([]) // @提及数据

    // 处理 @ 提及
    const updateMentions = (comments: CommentRes[]): Completion[] => {
        // 处理 @ 提及示例
        // [
        //      { label: "@jiaopengzi", apply: "[@jiaopengzi](user_name)" },
        // ]
        const mentions: Completion[] = []
        const map = new Map<string, string>() // 用于去重
        comments.forEach((comment) => {
            if (comment.user_info) {
                const { user_name, user_display_name } = comment.user_info
                if (!map.has(user_name)) {
                    map.set(user_name, user_display_name)
                    mentions.push({
                        label: `@${user_display_name}`,
                        apply: `[@${user_display_name}](${user_name})`,
                    })
                }
            }
        })

        return mentions
    }

    async function getPaginate(): Promise<Pagination<CommentRes>> {
        isShowLoading.value = true // 显示加载动画
        // 获取标签列表
        const res = await viewByPostIDAPI(req)
        if (res.data.code === ResponseCode.CommentViewSuccess) {
            isShowLoading.value = false // 隐藏加载动画
            // 更新 @ 提及数据
            mentions.value = updateMentions(res.data.data.records)
            return res.data.data
        }

        isShowLoading.value = false // 隐藏加载动画

        // 更新 @ 提及数据
        mentions.value = updateMentions([])
        return getEmptyPagination<CommentRes>()
    }

    // 分页 hooks
    const { updateCurrentPage, updatePageSize, updatePaginate } = usePaginationComment(pagination, getPaginate, req)

    // 删除评论
    const handleDelete = async (commentID: string): Promise<void> => {
        // 更新分页数据
        await updatePaginate()
    }

    // 处理置顶
    const handlePinned = async (commentID: string, isPinned: CommentPinnedCode): Promise<void> => {
        // 更新分页数据
        await updatePaginate()
    }

    return {
        req, // 请求参数
        pagination, // 分页数据
        updateCurrentPage, // 更新当前页
        updatePageSize, // 更新每页显示条数
        updatePaginate, // 更新分页
        mentions, // @ 提及数据
        isShowLoading, // 是否显示加载动画
        handleDelete, // 删除评论
        handlePinned, // 处理置顶
    }
}
