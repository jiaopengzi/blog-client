/*
 * FilePath    : blog-client\src\views\admin\component\main\coupon\hooks.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 优惠券统计数据
 */

import { computed, onBeforeMount, ref, watch } from "vue"

import { CouponStatusDisplay } from "@/api/coupon/common"
import { type CouponCountByStatus, getCouponCountByStatusAPI } from "@/api/coupon/getCountByStatus"
import { ResponseCode } from "@/api/response"

import { type CouponCountGroupItem, queryKey } from "./types"

export function useHeader() {
    const allCoupons = ref<CouponCountGroupItem>({} as CouponCountGroupItem)
    const couponCountStatus = ref<CouponCountByStatus[]>([])
    const statusCoupons = ref<CouponCountGroupItem[]>([])

    const allGroup = "all"
    const activeGroup = ref(allGroup)

    // 按照状态统计
    const getCouponCountStatus = async () => {
        const res = await getCouponCountByStatusAPI()
        if (res.data.code === ResponseCode.CouponCountByStatusSuccess) {
            couponCountStatus.value = res.data.data
            // } else {
            //     MessageUtil.warning(handleResErr(res), 3000)
        }
    }

    watch(
        () => couponCountStatus.value,
        (newVal) => {
            if (!newVal) return
            // 统计总数
            const allCouponCount = newVal.reduce((prev, cur) => prev + cur.count, 0)
            allCoupons.value = {
                display: "全部",
                key: allGroup,
                count: allCouponCount,
                index: 0,
                group: queryKey.Group,
            }

            // 清空
            statusCoupons.value = []

            newVal.forEach((item) => {
                const statusCoupon: CouponCountGroupItem = {
                    display: CouponStatusDisplay[item.status],
                    key: item.status.toString(),
                    count: item.count,
                    index: item.status + 1,
                    group: queryKey.Status,
                }
                statusCoupons.value.push(statusCoupon)
            })
        },
        { deep: true },
    )

    // 按 index 升序排序 构造 couponCountGroup
    const couponCountGroup = computed(() => {
        const countGroup = ref<CouponCountGroupItem[]>([])

        // 全部
        if (allCoupons.value.count) {
            countGroup.value.push(allCoupons.value)
        }

        // 状态
        if (statusCoupons.value.length) {
            countGroup.value.push(...statusCoupons.value)
        }

        // 按照 index 升序排序
        return Object.values(countGroup.value)
            .slice()
            // oxlint-disable-next-line unicorn/no-array-sort
            .sort((a, b) => a.index - b.index)
    })

    onBeforeMount(async () => {
        await getCouponCountStatus()
    })

    return {
        couponCountStatus,
        couponCountGroup,
        allGroup,
        activeGroup,
        getCouponCountStatus,
    }
}
