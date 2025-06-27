<!--
 * FilePath    : blog-client\src\views\admin\component\main\notification\component\edit\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 编辑通知
-->

<template>
    <View
        :view-data="editData"
        :is-show-id="true"
        :is-show-send-test="true"
        :btn-loading="btnLoading"
        btn-submit-display="提交修改"
        @submit-data="submitData"
    />
</template>

<script lang="ts" setup>
import { ref } from "vue"

import { type UpdateNotificationRequest } from "@/api/notification/common"
import { updateNotificationAPI } from "@/api/notification/update"
import { handleResErr, ResponseCode } from "@/api/response"
import { pollingGetStreamIDsStatus } from "@/utils/getStreamIDsStatus"
import { MessageUtil } from "@/utils/message"

import View from "../view"
import { type ViewForm } from "../view"

defineOptions({ name: "EditNotification" })

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
    const req: UpdateNotificationRequest = {
        id: form.id ? form.id.toString() : "",
        to_list: form.to_list, // 接收人列表
        exclude_to_list: form.exclude_to_list, // 排除接收人列表
        subject: form.subject, // 通知主题
        content: form.content, // 通知内容
        push_time: form.push_time, // 推送时间
        category: form.category, // 通知类别
        status: form.status, // 状态
        format: form.format, // 通知格式
    }

    // 如果推送时间存在且是有效的，则设置为有效
    if (form.push_time.Time && req.push_time) {
        req.push_time.Time = new Date(form.push_time.Time) // 将字符串时间转换为有效的日期对象
        req.push_time.Valid = true
    }

    // 如果推送时间不存在，则设置为无效
    if (!form.push_time.Time && req.push_time) {
        req.push_time.Valid = false
    }

    const res = await updateNotificationAPI(req)

    if (res.data.code === ResponseCode.NotificationUpdateSuccess) {
        // 轮询后端是否完成
        await pollingGetStreamIDsStatus(res.data.data.items)
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
