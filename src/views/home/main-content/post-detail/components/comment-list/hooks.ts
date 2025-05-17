/*
 * FilePath    : blog-client\src\views\home\main-content\post-detail\components\comment-list\hooks.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 评论列表的hooks
 */

import { reactive, ref } from "vue"

import { CommentPinnedCode, type CommentRes } from "@/api/comment/common"
import { viewByPostIDAPI, type ViewCommentRequest } from "@/api/comment/viewByPostID"
import { getEmptyPagination, type Pagination, type Res, ResponseCode, type ResPromise } from "@/api/response"
import { usePaginationComment } from "@/components/hooks/usePagination"

export function useCommentList(postId: string) {
    const req = reactive<ViewCommentRequest>({ post_id: postId }) // 请求参数
    const isShowLoading = ref<boolean>(false) // 是否显示加载动画

    const pagination = reactive<Pagination<CommentRes>>(getEmptyPagination<CommentRes>()) // 分页数据

    async function getPaginate(): Promise<Pagination<CommentRes>> {
        isShowLoading.value = true // 显示加载动画
        // 获取标签列表
        const res = await viewByPostIDAPI(req)
        if (res.data.code === ResponseCode.CommentViewSuccess) {
            isShowLoading.value = false // 隐藏加载动画
            return res.data.data
        }

        isShowLoading.value = false // 隐藏加载动画
        return getEmptyPagination<CommentRes>()
    }

    // 删除评论
    const handleDelete = async (commentID: string): Promise<void> => {
        // 在pagination中删除评论
        const index = pagination.records.findIndex((item) => item.id === commentID)
        if (index !== -1) {
            pagination.records.splice(index, 1)
            // 总数减一
            pagination.total -= 1
        }

        // // 使用一个promise等待 2秒
        // await new Promise((resolve) => setTimeout(resolve, 2000))

        // // 更新分页数据
        // await updatePaginate()
    }

    // 处理置顶
    const handlePinned = async (commentID: string, isPinned: CommentPinnedCode): Promise<void> => {
        // 处理置顶
        const comment = pagination.records.find((item) => item.id === commentID)
        if (comment) {
            comment.is_pinned = isPinned
        }

        // 将置顶的评论放到最前面
        pagination.records.sort((a, b) => {
            if (a.is_pinned === CommentPinnedCode.IsPinned && b.is_pinned === CommentPinnedCode.NotIsPinned) {
                return -1
            } else if (a.is_pinned === CommentPinnedCode.NotIsPinned && b.is_pinned === CommentPinnedCode.IsPinned) {
                return 1
            }
            return 0
        })

        // // 使用一个promise等待 2秒
        // await new Promise((resolve) => setTimeout(resolve, 2000))

        // // 更新分页数据
        // await updatePaginate()
    }

    // 分页 hooks
    const { updateCurrentPage, updatePageSize, updatePaginate } = usePaginationComment(pagination, getPaginate, req)

    return {
        req, // 请求参数
        pagination, // 分页数据
        updateCurrentPage, // 更新当前页
        updatePageSize, // 更新每页显示条数
        updatePaginate, // 更新分页
        isShowLoading, // 是否显示加载动画
        handleDelete, // 删除评论
        handlePinned, // 处理置顶
    }
}
