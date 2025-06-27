<!--
 * FilePath    : blog-client\src\views\admin\component\main\membership\component\view\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 会员展示组件
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
            <el-form-item label="会员角色" prop="role">
                <el-input v-model="viewDataAc.role" placeholder="请输入会员角色" />
            </el-form-item>
            <el-form-item label="有效时间" prop="duration_time">
                <el-input-number v-model="viewDataAc.duration_time" :min="0">
                    <template #suffix>
                        <span>秒</span>
                    </template>
                </el-input-number>
            </el-form-item>
            <el-form-item label="购买折扣" prop="purchase_discount">
                <el-input-number v-model="viewDataAc.purchase_discount" :min="0" :max="100" placeholder="请输入购买折扣(0-100)" />
            </el-form-item>
            <el-form-item label="下载次数" prop="download_count">
                <el-input-number v-model="viewDataAc.download_count" :min="0" placeholder="请输入下载次数" />
            </el-form-item>
            <el-form-item label="观看次数" prop="watch_count">
                <el-input-number v-model="viewDataAc.watch_count" :min="0" placeholder="请输入观看次数" />
            </el-form-item>
            <el-form-item label="是否启用" prop="status">
                <el-radio-group v-model="viewDataAc.status">
                    <el-radio v-for="item in optionsStatus" :key="item.value" :value="item.value">
                        {{ MembershipStatusDisplay[item.value] }}
                    </el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="描述" prop="description">
                <el-input v-model="viewDataAc.description" type="textarea" placeholder="请输入描述信息" :rows="5" />
            </el-form-item>
        </el-form>

        <div class="btn-submit">
            <el-button type="primary" :loading="btnLoading" @click="submitForm(viewFormRef as FormInstance)">{{ btnSubmitDisplay }}</el-button>
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { FormInstance } from "element-plus" // 需要全部安装 npm i element-plus -S
import { onBeforeMount, reactive, ref, toRefs, useTemplateRef } from "vue"

import { getMembershipStatusOptions, MembershipStatusDisplay } from "@/api/membership/common"
import { getMembershipCountByStatusAPI, type MembershipCountByStatus } from "@/api/membership/getCountByStatus"
import { ResponseCode } from "@/api/response"

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

// 表单label位置 top | left | right
const labelPosition = ref("left")

// 表单大小 '' | 'large' | 'default' | 'small'
const formSize = ref("large")

// 表单实例
const viewFormRef = useTemplateRef<FormInstance>("viewFormRef")

// 定义 v-model 的数据
const viewDataAc = reactive<ViewForm>(viewData)

const optionsStatus = getMembershipStatusOptions()

// 获取会员角色数量分组信息
const roleCountItems = reactive<MembershipCountByStatus[]>([])
const getRoleCountItems = async () => {
    await getMembershipCountByStatusAPI().then((res) => {
        if (res.data.code === ResponseCode.MembershipCountByStatusSuccess) {
            Object.assign(roleCountItems, res.data.data)
        }
    })
}

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

// 初始化获取用户数量分组信息
onBeforeMount(async () => {
    await getRoleCountItems()
})
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
</style>
