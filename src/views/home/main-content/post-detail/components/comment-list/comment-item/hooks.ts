/*
 * FilePath    : blog-client\src\views\home\main-content\post-detail\components\comment-list\comment-item\hooks.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 评论列表的单条评论的hooks
 */

import { ref } from "vue"

import { deleteCommentAPI, type DeleteCommentRequest } from "@/api/comment/delete"
import { updateCommentAPI, type UpdateCommentRequest } from "@/api/comment/update"
import { handleResErr, ResponseCode } from "@/api/response"
import { pollingGetStreamIDStatus } from "@/utils/getStreamIDStatus"
import { MessageUtil } from "@/utils/message"

export function useCommentItem() {
    const loadingDelete = ref<boolean>(false)
    const loadingUpdate = ref<boolean>(false)

    // 删除评论
    async function deleteComment(id: string): Promise<void> {
        loadingDelete.value = true // 显示加载动画
        const req: DeleteCommentRequest = {
            id_list: [id], // 删除的评论ID列表
        }
        // 删除评论
        const res = await deleteCommentAPI(req)
        if (res.data.code === ResponseCode.CommentDeleteSuccess) {
            // 轮询后端是否完成
            await pollingGetStreamIDStatus(res.data.data.stream_id)

            MessageUtil.success("删除成功") // 显示成功信息
            loadingDelete.value = false // 隐藏加载动画
            return
        }

        MessageUtil.error(handleResErr(res)) // 显示错误信息
        loadingDelete.value = false // 隐藏加载动画
    }

    // 更新评论
    async function updateComment(req: UpdateCommentRequest): Promise<void> {
        loadingUpdate.value = true // 显示加载动画
        // 获取标签列表
        const res = await updateCommentAPI(req)
        if (res.data.code === ResponseCode.CommentUpdateSuccess) {
            // 轮询后端是否完成
            await pollingGetStreamIDStatus(res.data.data.stream_id)

            MessageUtil.success("更新成功")
            loadingUpdate.value = false // 隐藏加载动画
            return
        }

        MessageUtil.error(handleResErr(res)) // 显示错误信息
        loadingUpdate.value = false // 隐藏加载动画
    }

    return {
        loadingDelete, // 删除评论加载状态
        loadingUpdate, // 更新评论加载状态
        deleteComment, // 删除评论
        updateComment, // 更新评论
    }
}
