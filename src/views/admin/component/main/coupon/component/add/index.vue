<!--
 * FilePath    : blog-client\src\views\admin\component\main\coupon\component\add\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 添加优惠卷
-->

<template>
    <View :view-data="addForm" :is-show-id="false" :btn-loading="btnLoading" btn-submit-display="新增" @submit-data="submitData" />
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue"

import { CouponDiscountType, CouponStackable, CouponStatus } from "@/api/coupon/common"
import { type InsertCouponRequest } from "@/api/coupon/common"
import { insertCouponAPI } from "@/api/coupon/insert"
import { handleResErr, ResponseCode } from "@/api/response"
import { MessageUtil } from "@/utils/message"

import View from "../view"
import { type ViewForm } from "../view"

defineOptions({ name: "AddCoupon" })

const emit = defineEmits<{
    (event: "add-status", value: boolean): void // 添加用户状态
}>()

// 表单数据
const addForm = reactive<ViewForm>({
    code: "",
    discount_type: CouponDiscountType.FixedAmount,
    expire_time: {
        Time: null,
        Valid: false,
    },
    status: CouponStatus.Disabled,
    amount: "",
    is_stackable: CouponStackable.Disabled, // 默认禁用叠加
})

const btnLoading = ref(false)

const submitData = async (form: ViewForm) => {
    btnLoading.value = true

    const amount =
        form.discount_type === CouponDiscountType.FixedAmount
            ? (Number(form.amount) * 100).toString() // 将金额转换为分
            : form.amount // 折扣类型不需要转换

    const req: InsertCouponRequest = {
        code: form.code,
        description: form.description,
        discount_type: form.discount_type,
        amount: amount,
        min_spend: form.min_spend ? (Number(form.min_spend) * 100).toString() : "0",
        max_spend: form.max_spend ? (Number(form.max_spend) * 100).toString() : "0",
        is_stackable: form.is_stackable,
        use_limit: form.use_limit ? form.use_limit.toString() : "0",
        used_count: form.used_count ? form.used_count.toString() : "0",
        use_limit_per_user: form.use_limit_per_user ? form.use_limit_per_user.toString() : "0",
        status: form.status,
    }

    // 如果过期时间存在且是有效的，则设置为有效
    if (form.expire_time.Time && req.expire_time) {
        req.expire_time.Time = new Date(form.expire_time.Time) // 将字符串时间转换为有效的日期对象
        req.expire_time.Valid = true
    }

    // 如果过期时间不存在，则设置为无效
    if (!form.expire_time.Time && req.expire_time) {
        req.expire_time.Valid = false
    }

    const res = await insertCouponAPI(req)

    if (res.data.code === ResponseCode.CouponInsertSuccess) {
        btnLoading.value = false

        // 添加成功提示
        emit("add-status", true)
        MessageUtil.success(res.data.msg, 6000)
    } else {
        btnLoading.value = false
        // 添加失败提示
        MessageUtil.error(handleResErr(res), 6000)
    }
}
</script>
