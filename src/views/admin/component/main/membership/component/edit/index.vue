<!--
 * FilePath    : blog-client\src\views\admin\component\main\membership\component\edit\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 编辑会员
-->

<template>
    <View :view-data="editData" :is-show-id="true" :btn-loading="btnLoading" btn-submit-display="提交修改" @submit-data="submitData" />
</template>

<script lang="ts" setup>
import { ref } from "vue"

import { type UpdateMembershipRequest } from "@/api/membership/common"
import { updateMembershipAPI } from "@/api/membership/update"
import { handleResErr, ResponseCode } from "@/api/response"
import { MessageUtil } from "@/utils/message"

import View from "../view"
import { type ViewForm } from "../view"

defineOptions({ name: "EditMembership" })

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
    const req: UpdateMembershipRequest = {
        id: form.id ? form.id.toString() : "",
        role: form.role, // 会员角色
        price: (parseFloat(form.price) * 100).toFixed(0), // 价格(分)
        duration_time: form.duration_time?.toString(), // 有效时间
        purchase_discount: form.purchase_discount, // 购买折扣
        download_count: form.download_count, // 下载次数
        watch_count: form.watch_count, // 观看次数
        status: form.status, // 状态
        description: form.description, // 描述信息
    }

    const res = await updateMembershipAPI(req)

    if (res.data.code === ResponseCode.MembershipUpdateSuccess) {
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
