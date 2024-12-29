<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-11-06 14:47:08
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-11-25 11:22:21
 * @FilePath     : \blog-client\src\views\admin\component\main\post-category\component\edit\index.vue
 * @Description  : 编辑分类
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
import { type UpdatePostCategoryRequest, updatePostCategoryAPI } from "@/api/postCategory/update"
import { ResponseCode } from "@/api/response"
import View from "../view"
import { type ViewForm } from "../view"

defineOptions({ name: "EditCategory" })

const emit = defineEmits<{
    (event: "edit-status", value: boolean): void // 编辑状态
}>()

// props
const { editData } = defineProps<{
    editData: ViewForm // 需要编辑的用户ID
}>()

const submitData = async (form: ViewForm) => {
    const req: UpdatePostCategoryRequest = {
        id: form.id ? form.id.toString() : "",
        name: form.name,
        slug: form.slug,
        description: form.description,
        thumbnail: form.thumbnail,
        order: form.order,
        parent: form.parent,
    }
    const { data } = await updatePostCategoryAPI(req)

    if (data.code === ResponseCode.PostCategoryUpdateSuccess) {
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
