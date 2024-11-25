<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-11-25 11:03:13
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-11-25 11:20:29
 * @FilePath     : \blog-client\src\views\admin\component\main\post-tag\component\view\index.vue
 * @Description  : 标签展示组件
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->

<template>
    <div class="view-page">
        <el-form
            :label-position="labelPosition"
            label-width="100px"
            ref="viewFormRef"
            :model="viewData"
            :rules="rules"
            class="view-form"
            :size="formSize"
            status-icon
        >
            <el-form-item v-if="isShowId" label="ID" prop="id">
                <el-input v-model.trim="viewData.id" disabled />
            </el-form-item>
            <el-form-item label="标签" prop="name">
                <el-input v-model.trim="viewData.name" placeholder="请输入标签名称-必填" />
            </el-form-item>

            <el-form-item label="别名" prop="slug">
                <el-input v-model.trim="viewData.slug" placeholder="请输入标签别名-必填" />
            </el-form-item>
            <el-form-item label="描述" prop="description">
                <el-input
                    v-model.trim="viewData.description"
                    type="textarea"
                    placeholder="请输入标签描信息-选填"
                    :rows="5"
                />
            </el-form-item>
            <el-form-item label="图片" prop="thumbnail">
                <el-input
                    v-model.trim="viewData.thumbnail"
                    placeholder="请输入标签的图片URL-选填"
                />
            </el-form-item>
            <el-form-item label="排序" prop="order">
                <el-input
                    v-model="viewData.order"
                    type="number"
                    placeholder="请输入标签排序数字-选填"
                    min="0"
                />
            </el-form-item>
        </el-form>

        <div class="btn-submit">
            <el-button type="primary" @click="submitForm(viewFormRef as FormInstance)">{{
                btnSubmitDisplay
            }}</el-button>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, toRefs, useTemplateRef } from "vue"
import type { FormInstance } from "element-plus" // 需要全部安装 npm i element-plus -S
import type { ViewForm } from "./index"
import { useFormValidation } from "./hooks"

defineOptions({ name: "CommonView" })

// props
const {
    viewData,
    btnSubmitDisplay = "提交",
    isShowId = false,
} = defineProps<{
    viewData: ViewForm // 展示信息
    btnSubmitDisplay?: string // 提交按钮显示文字
    isShowId?: boolean // 是否显示ID
}>()

// emits
const emit = defineEmits<{
    (event: "submit-data", value: ViewForm): void // 编辑用户状态
}>()

// 表单label位置 top | left | right
const labelPosition = ref("left")

// 表单大小 '' | 'large' | 'default' | 'small'
const formSize = ref("large")

// 表单实例
const viewFormRef = useTemplateRef<FormInstance>("viewFormRef")

// hooks
const { addRules, editRules } = useFormValidation({
    form: toRefs(viewData),
})

// 根据是否显示ID来判断使用哪个rules
const rules = isShowId ? editRules : addRules

const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    try {
        await formEl.validate(async (valid) => {
            if (valid) {
                emit("submit-data", viewData)
                console.log("submit!")
            }
        })
    } catch (error) {
        return
    }
}
</script>

<style lang="scss" scoped>
.view-page {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.view-form {
    width: 400px;
}

.btn-submit {
    text-align: center;
}

.btn-submit .el-form-item {
    display: inline-block;
}
</style>
