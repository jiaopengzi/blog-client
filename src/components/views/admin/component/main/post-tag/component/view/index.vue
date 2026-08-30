<!--
 * FilePath    : blog-client-nuxt\src\components\views\admin\component\main\post-tag\component\view\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 标签展示组件
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
                <el-input v-model="viewDataAc.id" disabled />
            </el-form-item>
            <el-form-item label="标签" prop="name">
                <el-input v-model="viewDataAc.name" placeholder="请输入标签名称-必填" />
            </el-form-item>

            <el-form-item label="别名" prop="slug">
                <el-input v-model="viewDataAc.slug" placeholder="请输入标签别名-必填" />
            </el-form-item>
            <el-form-item label="描述" prop="description">
                <el-input v-model="viewDataAc.description" type="textarea" placeholder="请输入标签描信息-选填" :rows="5" />
            </el-form-item>
            <el-form-item label="图片" prop="thumbnail">
                <ImageInput v-model="viewDataAc.thumbnail" placeholder="请输入标签的图片URL-选填" clearable />
            </el-form-item>
            <el-form-item label="排序" prop="order">
                <el-input v-model="viewDataAc.order" type="number" placeholder="请输入标签排序数字-选填" min="0" />
            </el-form-item>
        </el-form>

        <div class="btn-submit">
            <el-button type="primary" :loading="btnLoading" @click="submitForm(viewFormRef as FormInstance)">{{ btnSubmitDisplay }}</el-button>
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { FormInstance } from "element-plus" // 需要全部安装 npm i element-plus -S
import { reactive, ref, toRefs, useTemplateRef } from "vue"

import ImageInput from "@/components/common/image-input"
import { useFormValidation } from "./hooks"
import type { ViewForm } from "./types"

defineOptions({ name: "CommonView" })

// props
const {
    viewData,
    btnSubmitDisplay = "提交",
    isShowId = false,
    btnLoading = false,
} = defineProps<{
    viewData: ViewForm // 展示信息
    btnSubmitDisplay?: string // 提交按钮显示文字
    isShowId?: boolean // 是否显示ID
    btnLoading?: boolean // 提交按钮加载状态
}>()

// emits
const emit = defineEmits<{
    (event: "submit-data", value: ViewForm): void // 提交数据
}>()

// 表单 label 位置 top | left | right
const labelPosition = ref<"left" | "right" | "top">("left")

// 表单大小 '' | 'large' | 'default' | 'small'
const formSize = ref<"" | "default" | "small" | "large">("large")

const viewFormRef = useTemplateRef<FormInstance>("viewFormRef")

// 表单绑定的响应式数据副本
const viewDataAc = reactive<ViewForm>(viewData)

// hooks
const { addRules, editRules } = useFormValidation({
    form: toRefs(viewDataAc),
})

// 根据是否显示 ID 判断使用哪套规则
const rules = isShowId ? editRules : addRules

const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate(async (valid) => {
        if (valid) {
            emit("submit-data", viewData)
            console.log("submit!")
        }
    })
}
</script>

<style lang="scss" scoped>
.view-page {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.view-form {
    width: 600px;
}

.btn-submit {
    text-align: center;
}

.btn-submit .el-form-item {
    display: inline-block;
}
</style>
