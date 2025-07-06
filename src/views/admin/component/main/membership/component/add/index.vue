<!--
 * FilePath    : blog-client\src\views\admin\component\main\membership\component\add\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 添加会员
-->

<template>
    <View :view-data="addForm" :is-show-id="false" :btn-loading="btnLoading" btn-submit-display="新增" @submit-data="submitData" />
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue"

import { MembershipStatus } from "@/api/membership/common"
import { type InsertMembershipRequest } from "@/api/membership/common"
import { insertMembershipAPI } from "@/api/membership/insert"
import { handleResErr, ResponseCode } from "@/api/response"
import { MessageUtil } from "@/utils/message"

import View from "../view"
import { type ViewForm } from "../view"

defineOptions({ name: "AddMembership" })

const emit = defineEmits<{
    (event: "add-status", value: boolean): void // 添加用户状态
}>()

// 表单数据
const addForm = reactive<ViewForm>({
    role: "", // 会员角色
    price: "", // 价格(元)
    duration_time: "0", // 有效时间(0表示永久有效)
    purchase_discount: 0, // 购买折扣(0-100)
    status: MembershipStatus.Disabled, // 状态
})

const btnLoading = ref(false)

const submitData = async (form: ViewForm) => {
    btnLoading.value = true

    // 将价格从元转换为分
    const req: InsertMembershipRequest = {
        role: form.role, // 会员角色
        price: (parseFloat(form.price) * 100).toFixed(0), // 价格(分)
        duration_time: form.duration_time?.toString(), // 有效时间
        purchase_discount: form.purchase_discount, // 购买折扣
        download_count: form.download_count, // 下载次数
        watch_count: form.watch_count, // 观看次数
        status: form.status, // 状态
        description: form.description, // 描述信息
    }

    const res = await insertMembershipAPI(req)

    if (res.data.code === ResponseCode.MembershipInsertSuccess) {
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
