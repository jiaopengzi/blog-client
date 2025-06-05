<!--
 * @FilePath     : \blog-client\src\views\admin\component\main\post-tag\component\edit\index.vue
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved. 
 * @Description  : 编辑标签
-->

<template>
    <View :view-data="editData" :is-show-id="true" :btn-loading="btnLoading" btn-submit-display="提交修改" @submit-data="submitData" />
</template>

<script lang="ts" setup>
import { ref } from "vue"

import { updatePostTagAPI, type UpdatePostTagRequest } from "@/api/postTag/update"
import { ResponseCode } from "@/api/response"
import { pollingGetStreamIDsStatus } from "@/utils/getStreamIDsStatus"
import { MessageUtil } from "@/utils/message"

import View from "../view"
import { type ViewForm } from "../view"

defineOptions({ name: "EditTag" })

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
    const req: UpdatePostTagRequest = {
        id: form.id ? form.id.toString() : "",
        name: form.name,
        slug: form.slug,
        description: form.description,
        thumbnail: form.thumbnail,
        order: form.order ? form.order.toString() : "0",
    }
    const { data } = await updatePostTagAPI(req)

    if (data.code === ResponseCode.PostTagUpdateSuccess) {
        // 轮询后端是否完成
        await pollingGetStreamIDsStatus(data.data.stream_ids)
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
