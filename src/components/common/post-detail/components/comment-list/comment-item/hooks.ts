/*
 * FilePath    : blog-client-nuxt\src\components\common\post-detail\components\comment-list\comment-item\hooks.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 评论列表单条评论的 hooks
 */

import { ref } from "vue"

import { deleteCommentAdminAPI, deleteCommentAPI, type DeleteCommentRequest } from "@/api/comment/delete"
import { updateCommentAdminAPI, updateCommentAPI, type UpdateCommentRequest } from "@/api/comment/update"
import { handleResErr, ResponseCode } from "@/api/response"
import { pollingGetStreamIDsStatus } from "@/utils/getStreamIDsStatus"
import { MessageUtil } from "@/utils/message"

/**
 * @param isAdmin 是否是管理员, 默认为 false
 */
export function useCommentItem(isAdmin: boolean = false) {
    const loadingDelete = ref<boolean>(false)
    const loadingUpdate = ref<boolean>(false)

    async function deleteComment(id: string): Promise<void> {
        loadingDelete.value = true
        const req: DeleteCommentRequest = {
            id_list: [id], // 待删除的评论 ID 列表
        }

        let res
        if (isAdmin) {
            res = await deleteCommentAdminAPI(req)
        } else {
            res = await deleteCommentAPI(req)
        }

        if (res.data.code === ResponseCode.CommentDeleteSuccess) {
            // 保证有数据且包含 stream_items 字段才进行轮询
            if (res.data.data && res.data.data.stream_items) {
                await pollingGetStreamIDsStatus(res.data.data.stream_items)
            }

            MessageUtil.success("删除成功")
            loadingDelete.value = false
            return
        }

        MessageUtil.error(handleResErr(res))
        loadingDelete.value = false
    }

    async function updateComment(req: UpdateCommentRequest): Promise<void> {
        loadingUpdate.value = true

        let res
        if (isAdmin) {
            res = await updateCommentAdminAPI(req)
        } else {
            res = await updateCommentAPI(req)
        }

        if (res.data.code === ResponseCode.CommentUpdateSuccess) {
            // 保证有数据且包含 stream_items 字段才进行轮询
            if (res.data.data && res.data.data.stream_items) {
                await pollingGetStreamIDsStatus(res.data.data.stream_items)
            }

            MessageUtil.success("更新成功")
            loadingUpdate.value = false
            return
        }

        MessageUtil.error(handleResErr(res))
        loadingUpdate.value = false
    }

    return {
        loadingDelete, // 删除评论加载状态
        loadingUpdate, // 更新评论加载状态
        deleteComment, // 删除评论
        updateComment, // 更新评论
    }
}
