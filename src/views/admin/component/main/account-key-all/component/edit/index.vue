<!--
 * FilePath    : blog-client\src\views\admin\component\main\account-key-all\component\edit\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 编辑账号密钥
-->

<template>
    <View :view-data="editData" :is-show-id="true" :btn-loading="btnLoading" btn-submit-display="提交修改" @submit-data="submitData" />
</template>

<script lang="ts" setup>
import { ref } from "vue"

import { type UpdateAccountKeyRequest } from "@/api/accountKey/common"
import { updateAccountKeyAPI } from "@/api/accountKey/update"
import { ResponseCode } from "@/api/response"
import { yuanToFen } from "@/utils/amount"
import { pollingGetStreamIDsStatus } from "@/utils/getStreamIDsStatus"
import { MessageUtil } from "@/utils/message"

import View from "../view"
import { type ViewForm } from "../view"
import { formatTime } from "../view/hooks"

defineOptions({ name: "EditAccountKey" })

const emit = defineEmits<{
    (event: "edit-status", value: boolean): void // 编辑状态
}>()

// props
const { editData } = defineProps<{
    editData: ViewForm // 需要编辑的用户ID
}>()

const btnLoading = ref(false)

const submitData = async (form: ViewForm) => {
    btnLoading.value = true
    // 将 itemStr 转为数组
    const items = form.itemStr ? form.itemStr.split("\n").filter((item) => item.trim() !== "") : []
    // 格式化时间
    form = formatTime(form)

    const req: UpdateAccountKeyRequest = {
        id: form.id ? form.id.toString() : "",
        title: form.title,
        description: form.description,
        price: yuanToFen(form.price?.toString() || "0", true) as string, // 转为分
        purchase_min: form.purchase_min,
        purchase_max: form.purchase_max,
        user_max: form.user_max,
        purchase_start: form.purchase_start,
        purchase_end: form.purchase_end,
        // pay_roles: form.pay_roles,
    }

    if (items.length > 0) {
        req.items = items
    }

    const { data } = await updateAccountKeyAPI(req)

    if (data.code === ResponseCode.AccountKeyUpdateSuccess) {
        // 保证有数据且包含 stream_items 字段才进行轮询
        if (data.data && data.data.stream_items) {
            await pollingGetStreamIDsStatus(data.data.stream_items)
        }

        btnLoading.value = false

        // 添加成功提示
        emit("edit-status", true)
        MessageUtil.success(data.msg, 6000)
    } else {
        btnLoading.value = false
        // 添加失败提示
        MessageUtil.error(data.msg, 0)
    }
}
</script>
