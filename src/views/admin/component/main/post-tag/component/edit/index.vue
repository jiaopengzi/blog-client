<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-11-04 16:21:40
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-11-25 11:22:11
 * @FilePath     : \blog-client\src\views\admin\component\main\post-tag\component\edit\index.vue
 * @Description  : 编辑标签
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->

<template>
    <View
        :view-data="editData"
        :is-show-id="true"
        btn-submit-display="提交修改"
        @submit-data="submitData"
    />
</template>

<script lang="ts" setup>
import { MessageUtil } from "@/utils/message"
import { type UpdatePostTagRequest, updatePostTagAPI } from "@/api/postTag/update"
import { ResponseCode } from "@/api/response"
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

const submitData = async (form: ViewForm) => {
    const req: UpdatePostTagRequest = {
        id: form.id ? form.id.toString() : "",
        name: form.name,
        slug: form.slug,
        description: form.description,
        thumbnail: form.thumbnail,
        order: form.order,
    }
    const { data } = await updatePostTagAPI(req)

    if (data.code === ResponseCode.PostTagUpdateSuccess) {
        // 添加成功提示
        emit("edit-status", true)
        MessageUtil.success(data.msg, 6000)
    } else {
        // 添加失败提示
        MessageUtil.error(data.msg, 0)
    }
    console.log("submit!")
}
</script>
