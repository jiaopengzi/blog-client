<!--
 * FilePath    : blog-client\src\views\admin\component\main\account-key-all\component\view\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 账号密钥展示组件
-->

<template>
    <div class="view-page">
        <el-form
            :label-position="labelPosition"
            label-width="120px"
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
            <el-form-item label="标题" prop="title">
                <el-input v-model="viewDataAc.title" placeholder="请输入标题" />
            </el-form-item>
            <el-form-item label="描述" prop="description">
                <el-input v-model="viewDataAc.description" type="textarea" placeholder="请输入描信息" :rows="3" />
            </el-form-item>
            <el-form-item label="价格" prop="price">
                <el-input-number class="input-number" v-model="viewDataAc.price" :min="0" :precision="2" :step="0.01" placeholder="请输入价格(元)">
                    <template #suffix>
                        <span>元</span>
                    </template>
                </el-input-number>
            </el-form-item>

            <el-form-item label="最少购买数量" prop="purchase_min">
                <el-input-number class="input-number" v-model="viewDataAc.purchase_min" :min="1" placeholder="请输入最少购买数量"> </el-input-number>
            </el-form-item>
            <el-form-item label="最多购买数量" prop="purchase_max">
                <el-input-number class="input-number" v-model="viewDataAc.purchase_max" placeholder="请输入最多购买数量"> </el-input-number>
            </el-form-item>
            <el-form-item label="最多购买数量" prop="user_max">
                <el-input-number class="input-number" v-model="viewDataAc.user_max" placeholder="请输入同一用户最多购买数量"> </el-input-number>
            </el-form-item>

            <el-form-item label="开始购买时间" prop="purchase_start">
                <el-date-picker
                    v-model="viewDataAc.purchase_start.Time"
                    type="datetime"
                    placeholder="留空则不限制"
                    :shortcuts="generateShortcuts('开始')"
                    :default-time="defaultTime"
                />
            </el-form-item>

            <el-form-item label="结束购买时间" prop="purchase_end">
                <el-date-picker
                    v-model="viewDataAc.purchase_end.Time"
                    type="datetime"
                    placeholder="留空则不限制"
                    :shortcuts="generateShortcuts('结束')"
                    :default-time="defaultTime"
                />
            </el-form-item>

            <el-form-item label="付费管理" prop="pay_roles">
                <SwitchGroup :switch-items="rolePaidList" @update-status="updateRolePaidList" />
            </el-form-item>

            <el-form-item label="账号密钥明细" prop="itemStr">
                <el-input v-model="viewDataAc.itemStr" type="textarea" placeholder="按照换行分割为独立账号密钥明细" :rows="5" />
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

import SwitchGroup from "@/components/common/switch-group"
import { usePayRolesSwitchItem } from "@/components/hooks/usePayRolesSwitchItem"
import { generateShortcuts } from "@/utils/dateTime"

import { useFormValidation } from "./hooks"
import type { ViewForm } from "./types"

defineOptions({ name: "AccountKeyCommonView" })

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

// 默认时间为当前日期
const defaultTime = new Date()

// 付费角色开关项
const { rolePaidList, initRolePaidManagement, updateRolePaidList } = usePayRolesSwitchItem(viewDataAc)

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
            console.log("submit!")
        }
    })
}

onBeforeMount(async () => {
    // 生成角色付费管理
    await initRolePaidManagement()
    // 更新角色付费管理
    if (viewDataAc.pay_roles && viewDataAc.pay_roles.length > 0 && rolePaidList.length > 0) {
        viewDataAc.pay_roles.forEach((role: string) => {
            const index = rolePaidList.findIndex((i) => i.name === role)
            rolePaidList[index]!.status = true
        })
    }
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

.btn-submit .el-form-item {
    display: inline-block;
}

.input-number {
    width: 100%;
}
</style>
