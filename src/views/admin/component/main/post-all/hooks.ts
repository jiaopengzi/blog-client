/**
 * @Author       : jiaopengzi
 * @Date         : 2024-12-03 16:37:27
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-04 11:40:39
 * @FilePath     : \blog-client\src\views\admin\component\main\post-all\hooks.ts
 * @Description  :
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import { ref, watch, onBeforeMount } from "vue"
import { type PostCountGroup } from "./index"
import { getPostCountByAuthorAPI, type PostCountByAuthor } from "@/api/post/getPostCountByAuthor"
import { getPostCountByStatusAPI, type PostCountByStatus } from "@/api/post/getPostCountByStatus"
import { getPostCountByMonthAPI, type PostCountByMonth } from "@/api/post/getPostCountByMonth"
import { ResponseCode, handleErrInfo } from "@/api/responseCode"
import { ShowMsgTip } from "@/utils/message"
import { PostStatusDisplay, PostStatusCode } from "@/api/post/common"

// 获取文章统计数据
export function useHeader(userID: string = "") {
    const postCountAuthor = ref<PostCountByAuthor[]>([])
    const postCountStatus = ref<PostCountByStatus[]>([])
    const postCountMonth = ref<PostCountByMonth[]>([])
    const postCountGroup = ref<PostCountGroup[]>([])
    const allGroup = "all"
    const activeGroup = ref(allGroup)

    // 获取 postCountAuthor
    const getPostCountAuthor = async () => {
        const res = await getPostCountByAuthorAPI()
        if (res.data.code === ResponseCode.PostCountByAuthorSuccess) {
            postCountAuthor.value = res.data.data
        } else {
            ShowMsgTip(ShowMsgTip.MsgType.warning, handleErrInfo(res.data), 3000)
        }
    }

    // 获取 postCountStatus
    const getPostCountStatus = async () => {
        const res = await getPostCountByStatusAPI()
        if (res.data.code === ResponseCode.PostCountByStatusSuccess) {
            postCountStatus.value = res.data.data
        } else {
            ShowMsgTip(ShowMsgTip.MsgType.warning, handleErrInfo(res.data), 3000)
        }
    }

    // 获取 postCountMonth
    const getPostCountMonth = async () => {
        const res = await getPostCountByMonthAPI()
        if (res.data.code === ResponseCode.PostCountByMonthSuccess) {
            postCountMonth.value = res.data.data
        } else {
            ShowMsgTip(ShowMsgTip.MsgType.warning, handleErrInfo(res.data), 3000)
        }
    }

    watch(
        postCountAuthor,
        () => {
            // 从 postCountAuthor 文章数量累加拿到文章总数量
            const allPostCount = postCountAuthor.value.reduce((prev, cur) => prev + cur.count, 0)
            // 构造 postCountGroup
            const allPosts: PostCountGroup = {
                display: "全部",
                key: allGroup,
                count: allPostCount,
                index: 0,
            }

            // 构造 全部
            postCountGroup.value.push(allPosts)

            // 构造 我的
            if (userID) {
                const myPost = postCountAuthor.value.find((item) => item.post_author === userID)
                if (myPost) {
                    const myPosts: PostCountGroup = {
                        display: "我的",
                        key: myPost.post_author,
                        count: myPost.count,
                        index: 1,
                    }
                    postCountGroup.value.push(myPosts)
                }
            }
        },
        { deep: true },
    )

    watch(
        postCountStatus,
        () => {
            // 构造按照状态统计的文章数量
            postCountStatus.value.forEach((item) => {
                const postStatus: PostCountGroup = {
                    display: PostStatusDisplay[item.post_status],
                    key: item.post_status.toString(),
                    count: item.count,
                    index: item.post_status + 1,
                }
                postCountGroup.value.push(postStatus)
            })
        },
        { deep: true },
    )

    watch(
        postCountGroup,
        () => {
            // 按照 index 排序
            postCountGroup.value.sort((a, b) => a.index - b.index)
        },
        { deep: true },
    )

    onBeforeMount(async () => {
        await getPostCountAuthor()
        await getPostCountStatus()
        await getPostCountMonth()
    })

    return {
        postCountAuthor,
        postCountStatus,
        postCountMonth,
        postCountGroup,
        allGroup,
        activeGroup,
    }
}
