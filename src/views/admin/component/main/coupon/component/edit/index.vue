<!--
 * FilePath    : blog-client\src\views\admin\component\main\coupon\component\edit\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 编辑优惠卷
-->

<template>
    <View :view-data="editData" :is-show-id="true" :btn-loading="btnLoading" btn-submit-display="提交修改" @submit-data="submitData" />
</template>

<script lang="ts" setup>
import { ref } from "vue"

import { CouponDiscountType, type UpdateCouponRequest } from "@/api/coupon/common"
import { updateCouponAPI } from "@/api/coupon/update"
import { handleResErr, ResponseCode } from "@/api/response"
import { MessageUtil } from "@/utils/message"

import View from "../view"
import { type ViewForm } from "../view"

defineOptions({ name: "EditCoupon" })

const emit = defineEmits<{
    (event: "edit-status", value: boolean): void // 编辑状态
}>()

// props
const { editData } = defineProps<{
    editData: ViewForm
}>()

const btnLoading = ref(false)

const submitData = async (form: ViewForm) => {
    btnLoading.value = true
    const amount =
        form.discount_type === CouponDiscountType.FixedAmount
            ? (form.amount * 100).toString() // 将金额转换为分
            : form.amount.toString() // 折扣类型不需要转换

    const req: UpdateCouponRequest = {
        id: form.id ? form.id.toString() : "",
        code: form.code,
        description: form.description,
        discount_type: form.discount_type,
        amount: amount,
        min_spend: form.min_spend ? (form.min_spend * 100).toString() : "0",
        max_spend: form.max_spend ? (form.max_spend * 100).toString() : "0",
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

    const res = await updateCouponAPI(req)

    if (res.data.code === ResponseCode.CouponUpdateSuccess) {
        btnLoading.value = false

        // 添加成功提示
        emit("edit-status", true)
        MessageUtil.success(res.data.msg, 6000)
    } else {
        btnLoading.value = false
        // 添加失败提示
        MessageUtil.error(handleResErr(res), 6000)
    }
}
</script>
