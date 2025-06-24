/*
 * FilePath    : blog-client\src\views\admin\component\main\comment\hooks.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 评论统计数据
 */

import { computed, onBeforeMount, ref, watch } from "vue"

import { CommentStatusDisplay } from "@/api/comment/common"
import { type CommentCountByStatus, getCommentCountByStatusAPI } from "@/api/comment/getCommentCountByStatus"
import { handleResErr, ResponseCode } from "@/api/response"
import { MessageUtil } from "@/utils/message"

import { type CommentCountGroupItem, queryKey } from "./types"

// 获取评论统计数据
export function useHeader() {
    const allComments = ref<CommentCountGroupItem>({} as CommentCountGroupItem)
    const commentCountStatus = ref<CommentCountByStatus[]>([])
    const statusComments = ref<CommentCountGroupItem[]>([])

    const allGroup = "all"
    const activeGroup = ref(allGroup)

    // 获取评论按照状态统计
    const getCommentCountStatus = async () => {
        const res = await getCommentCountByStatusAPI()
        if (res.data.code === ResponseCode.CommentCountByStatusSuccess) {
            commentCountStatus.value = res.data.data
        } else {
            MessageUtil.warning(handleResErr(res.data), 3000)
        }
    }

    watch(
        () => commentCountStatus.value,
        (newVal) => {
            if (!newVal) return
            // 统计总数
            const allCommentCount = newVal.reduce((prev, cur) => prev + cur.count, 0)
            allComments.value = {
                display: "全部",
                key: allGroup,
                count: allCommentCount,
                index: 0,
                group: queryKey.Group,
            }

            // 清空
            statusComments.value = []

            newVal.forEach((item) => {
                const statusComment: CommentCountGroupItem = {
                    display: CommentStatusDisplay[item.status],
                    key: item.status.toString(),
                    count: item.count,
                    index: item.status + 1,
                    group: queryKey.Status,
                }
                statusComments.value.push(statusComment)
            })
        },
        { deep: true },
    )

    // 按 index 升序排序 构造 commentCountGroup
    const commentCountGroup = computed(() => {
        const countGroup = ref<CommentCountGroupItem[]>([])

        // 全部
        if (allComments.value.count) {
            countGroup.value.push(allComments.value)
        }

        // 状态
        if (statusComments.value.length) {
            countGroup.value.push(...statusComments.value)
        }

        // 按照 index 升序排序
        return Object.values(countGroup.value)
            .slice()
            .sort((a, b) => a.index - b.index)
    })

    onBeforeMount(async () => {
        await getCommentCountStatus()
    })

    return {
        commentCountStatus,
        commentCountGroup,
        allGroup,
        activeGroup,
        getCommentCountStatus,
    }
}
