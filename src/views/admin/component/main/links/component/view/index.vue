<!--
 * FilePath    : blog-client\src\views\admin\component\main\links\component\view\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 链接展示组件
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
            <el-form-item label="名称" prop="name">
                <el-input v-model="viewDataAc.name" placeholder="请输入链接名称-必填" />
            </el-form-item>
            <el-form-item label="URL" prop="url">
                <el-input v-model="viewDataAc.url" placeholder="请输入链接地址-必填" />
            </el-form-item>
            <el-form-item label="图片" prop="thumbnail">
                <ImageInput v-model="viewDataAc.thumbnail" placeholder="请输入链接的图片URL-必填" clearable />
            </el-form-item>
            <el-form-item label="描述" prop="description">
                <el-input v-model="viewDataAc.description" type="textarea" placeholder="请输入链接描信息（建议80字以内）- 必填" :rows="5" />
            </el-form-item>
            <el-form-item v-if="isAdmin" label="状态" prop="status">
                <el-radio-group v-model="viewDataAc.status">
                    <el-radio :value="LinkStatusCode.Hidden">{{ LinkStatusDisplay[LinkStatusCode.Hidden] }}</el-radio>
                    <el-radio :value="LinkStatusCode.Show">{{ LinkStatusDisplay[LinkStatusCode.Show] }}</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item v-if="isAdmin" label="排序" prop="order">
                <el-input v-model="viewDataAc.order" type="number" placeholder="请输入链接排序数字-选填" min="0" />
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

import { LinkStatusCode, LinkStatusDisplay } from "@/api/link/common"
import ImageInput from "@/components/common/image-input"

import { useFormValidation } from "./hooks"
import type { ViewForm } from "./types"

defineOptions({ name: "LinkView" })

// props
const {
    viewData,
    btnSubmitDisplay = "提交",
    isShowId = false,
    btnLoading = false,
    isAdmin = false, // 是否是管理员添加链接
} = defineProps<{
    viewData: ViewForm // 展示信息
    btnSubmitDisplay?: string // 提交按钮显示文字
    isShowId?: boolean // 是否显示ID
    btnLoading?: boolean // 提交按钮加载状态
    isAdmin?: boolean // 是否是管理员添加链接
}>()

// emits
const emit = defineEmits<{
    (event: "submit-data", value: ViewForm): void // 提交数据
}>()

// 表单label位置 top | left | right
const labelPosition = ref("left")

// 表单大小 '' | 'large' | 'default' | 'small'
const formSize = ref("large")

// 表单实例
const viewFormRef = useTemplateRef<FormInstance>("viewFormRef")

// 定义 v-model 的数据
const viewDataAc = reactive<ViewForm>(viewData)

// hooks
const { addRules, editRules } = useFormValidation({
    form: toRefs(viewDataAc),
})

// 根据是否显示ID来判断使用哪个rules
const rules = isShowId ? editRules : addRules

const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate(async (valid) => {
        if (valid) {
            emit("submit-data", viewData)
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

@include respond-to("pc") {
    .view-form {
        width: 600px;
    }
}

@include respond-to("pad") {
    .view-form {
        width: 600px;
    }
}

@include respond-to("phone") {
    .view-form {
        width: 400px;
    }
}

.btn-submit {
    text-align: center;
}

.btn-submit .el-form-item {
    display: inline-block;
}
</style>
