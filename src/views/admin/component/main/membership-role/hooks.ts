/*
 * FilePath    : blog-client\src\views\admin\component\main\membership\hooks.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 会员统计数据
 */

import { computed, onBeforeMount, ref, watch } from "vue"

import { MembershipStatusDisplay } from "@/api/membership/common"
import { getMembershipCountByStatusAPI, type MembershipCountByStatus } from "@/api/membership/getCountByStatus"
import { ResponseCode } from "@/api/response"

import { type MembershipCountGroupItem, queryKey } from "./types"

// 获取评论统计数据
export function useHeader() {
    const allMemberships = ref<MembershipCountGroupItem>({} as MembershipCountGroupItem)
    const membershipCountStatus = ref<MembershipCountByStatus[]>([])
    const statusMemberships = ref<MembershipCountGroupItem[]>([])

    const allGroup = "all"
    const activeGroup = ref(allGroup)

    // 按照状态统计
    const getMembershipCountStatus = async () => {
        const res = await getMembershipCountByStatusAPI()
        if (res.data.code === ResponseCode.MembershipCountByStatusSuccess) {
            membershipCountStatus.value = res.data.data
            // } else {
            //     MessageUtil.warning(handleResErr(res), 3000)
        }
    }

    watch(
        () => membershipCountStatus.value,
        (newVal) => {
            if (!newVal) return
            // 统计总数
            const allMembershipCount = newVal.reduce((prev, cur) => prev + cur.count, 0)
            allMemberships.value = {
                display: "全部",
                key: allGroup,
                count: allMembershipCount,
                index: 0,
                group: queryKey.Group,
            }

            // 清空
            statusMemberships.value = []

            newVal.forEach((item) => {
                const statusMembership: MembershipCountGroupItem = {
                    display: MembershipStatusDisplay[item.status],
                    key: item.status.toString(),
                    count: item.count,
                    index: item.status + 1,
                    group: queryKey.Status,
                }
                statusMemberships.value.push(statusMembership)
            })
        },
        { deep: true },
    )

    // 按 index 升序排序 构造 membershipCountGroup
    const membershipCountGroup = computed(() => {
        const countGroup = ref<MembershipCountGroupItem[]>([])

        // 全部
        if (allMemberships.value.count) {
            countGroup.value.push(allMemberships.value)
        }

        // 状态
        if (statusMemberships.value.length) {
            countGroup.value.push(...statusMemberships.value)
        }

        // 按照 index 升序排序
        return Object.values(countGroup.value)
            .slice()
            .sort((a, b) => a.index - b.index)
    })

    onBeforeMount(async () => {
        await getMembershipCountStatus()
    })

    return {
        membershipCountStatus,
        membershipCountGroup,
        allGroup,
        activeGroup,
        getMembershipCountStatus,
    }
}
