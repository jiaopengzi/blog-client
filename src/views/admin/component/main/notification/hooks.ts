/*
 * FilePath    : blog-client\src\views\admin\component\main\notification\hooks.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 通知统计数据
 */

import { computed, onBeforeMount, ref, watch } from "vue"

import { NotificationStatusDisplay } from "@/api/notification/common"
import { getNotificationCountByStatusAPI, type NotificationCountByStatus } from "@/api/notification/getCountByStatus"
import { handleResErr, ResponseCode } from "@/api/response"
import { MessageUtil } from "@/utils/message"

import { type NotificationCountGroupItem, queryKey } from "./types"

// 获取评论统计数据
export function useHeader() {
    const allNotifications = ref<NotificationCountGroupItem>({} as NotificationCountGroupItem)
    const notificationCountStatus = ref<NotificationCountByStatus[]>([])
    const statusNotifications = ref<NotificationCountGroupItem[]>([])

    const allGroup = "all"
    const activeGroup = ref(allGroup)

    // 获取评论按照状态统计
    const getNotificationCountStatus = async () => {
        const res = await getNotificationCountByStatusAPI()
        if (res.data.code === ResponseCode.NotificationCountByStatusSuccess) {
            notificationCountStatus.value = res.data.data
        } else {
            MessageUtil.warning(handleResErr(res.data), 3000)
        }
    }

    watch(
        () => notificationCountStatus.value,
        (newVal) => {
            if (!newVal) return
            // 统计总数
            const allNotificationCount = newVal.reduce((prev, cur) => prev + cur.count, 0)
            allNotifications.value = {
                display: "全部",
                key: allGroup,
                count: allNotificationCount,
                index: 0,
                group: queryKey.Group,
            }

            // 清空
            statusNotifications.value = []

            newVal.forEach((item) => {
                const statusNotification: NotificationCountGroupItem = {
                    display: NotificationStatusDisplay[item.status],
                    key: item.status.toString(),
                    count: item.count,
                    index: item.status + 1,
                    group: queryKey.Status,
                }
                statusNotifications.value.push(statusNotification)
            })
        },
        { deep: true },
    )

    // 按 index 升序排序 构造 notificationCountGroup
    const notificationCountGroup = computed(() => {
        const countGroup = ref<NotificationCountGroupItem[]>([])

        // 全部
        if (allNotifications.value.count) {
            countGroup.value.push(allNotifications.value)
        }

        // 状态
        if (statusNotifications.value.length) {
            countGroup.value.push(...statusNotifications.value)
        }

        // 按照 index 升序排序
        return Object.values(countGroup.value)
            .slice()
            .sort((a, b) => a.index - b.index)
    })

    onBeforeMount(async () => {
        await getNotificationCountStatus()
    })

    return {
        notificationCountStatus,
        notificationCountGroup,
        allGroup,
        activeGroup,
        getNotificationCountStatus,
    }
}
