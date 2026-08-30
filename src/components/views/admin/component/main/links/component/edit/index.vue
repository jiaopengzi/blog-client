<!--
 * FilePath    : blog-client-nuxt\src\components\views\admin\component\main\links\component\edit\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 编辑链接
-->

<template>
    <View :view-data="editData" :is-show-id="true" :is-admin="isAdmin" :btn-loading="btnLoading" btn-submit-display="提交修改" @submit-data="submitData" />
</template>

<script lang="ts" setup>
import { ref } from "vue"

import type { UpdateLinkRequest } from "@/api/link/common"
import { updateLinkAPI } from "@/api/link/update"
import { ResponseCode } from "@/api/response"
import { pollingGetStreamIDsStatus } from "@/utils/getStreamIDsStatus"
import { MessageUtil } from "@/utils/message"

import View from "../view"
import { type ViewForm } from "../view"

defineOptions({ name: "EditLink" })

const { editData, isAdmin = true } = defineProps<{
    isAdmin?: boolean // 是否是管理员
    editData: ViewForm // 需要编辑的链接数据
}>()

const emit = defineEmits<{
    (event: "edit-status", value: boolean): void // 编辑状态
}>()

const btnLoading = ref(false)

const submitData = async (form: ViewForm) => {
    btnLoading.value = true
    const req: UpdateLinkRequest = {
        id: form.id ? form.id.toString() : "",
        name: form.name,
        url: form.url,
        thumbnail: form.thumbnail,
        description: form.description,
        status: form.status,
        order: form.order ? form.order.toString() : "0",
    }
    const { data } = await updateLinkAPI(req)

    if (data.code === ResponseCode.LinkUpdateSuccess) {
        // 保证有数据且包含 stream_items 字段才进行轮询
        if (data.data && data.data.stream_items) {
            await pollingGetStreamIDsStatus(data.data.stream_items)
        }

        btnLoading.value = false

        // 修改成功提示
        emit("edit-status", true)
        MessageUtil.success(data.msg, 6000)
    } else {
        btnLoading.value = false
        // 修改失败提示
        MessageUtil.error(data.msg, 0)
    }
}
</script>
