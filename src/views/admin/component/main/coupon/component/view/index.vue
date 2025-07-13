<!--
 * FilePath    : blog-client\src\views\admin\component\main\coupon\component\view\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 优惠卷展示组件
-->

<template>
    <div class="view-page">
        <el-form
            :label-position="labelPosition"
            label-width="160px"
            ref="viewFormRef"
            :model="viewData"
            :rules="rules"
            class="view-form"
            :size="formSize"
            status-icon
        >
            <el-form-item v-if="isShowId" label="ID" prop="id" size="default">
                <el-input v-model="viewDataAc.id" disabled />
            </el-form-item>
            <el-form-item label="优惠卷" prop="code">
                <el-input v-model="viewDataAc.code" placeholder="请输入优惠卷" class="coupon-code" />
            </el-form-item>
            <el-form-item label="描述" prop="description" size="default">
                <el-input v-model="viewDataAc.description" type="textarea" placeholder="请输入描述信息" :rows="5" />
            </el-form-item>
            <el-form-item label="优惠类型" prop="discount_type" size="default">
                <el-select v-model="viewDataAc.discount_type" clearable placeholder="请选择优惠类型">
                    <el-option v-for="item in optionsDiscountType" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
            </el-form-item>
            <el-form-item label="优惠(金额/折扣)" prop="amount" size="default">
                <el-input-number class="input-number" v-model="viewDataAc.amount" :min="0" :max="amountMax" :precision="amountPrecision" :step="amountStep">
                    <template #suffix>
                        <span>{{ amountUnit }}</span>
                    </template>
                </el-input-number>
            </el-form-item>
            <el-form-item label="过期时间" prop="expire_time" size="default">
                <el-date-picker v-model="viewDataAc.expire_time.Time" type="datetime" placeholder="请选择过期时间" :shortcuts="generateShortcuts('过期')" />
            </el-form-item>
            <el-form-item label="最小消费金额" prop="min_spend" size="default">
                <el-input-number class="input-number" v-model="viewDataAc.min_spend" :min="0" :precision="2" :step="0.1">
                    <template #suffix>
                        <span>元</span>
                    </template>
                </el-input-number>
            </el-form-item>
            <el-form-item label="最大消费金额" prop="max_spend" size="default">
                <el-input-number class="input-number" v-model="viewDataAc.max_spend" :min="0" :precision="2" :step="0.1">
                    <template #suffix>
                        <span>元</span>
                    </template>
                </el-input-number>
            </el-form-item>
            <el-form-item label="是否叠加使用" prop="stackable" size="default">
                <el-radio-group v-model="viewDataAc.stackable">
                    <el-radio v-for="item in optionsStackable" :key="item.value" :value="item.value">
                        {{ CouponStackableDisplay[item.value] }}
                    </el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="总次数限制" prop="use_limit" size="default">
                <el-input-number class="input-number" v-model="viewDataAc.use_limit" :min="0" />
            </el-form-item>
            <el-form-item label="每用户次数限制" prop="use_limit_per_user" size="default">
                <el-input-number class="input-number" v-model="viewDataAc.use_limit_per_user" :min="0" />
            </el-form-item>
            <el-form-item label="已使用次数" prop="used_count" size="default">
                <el-input v-model="viewDataAc.used_count" disabled />
            </el-form-item>
            <el-form-item label="是否启用" prop="status" size="default">
                <el-radio-group v-model="viewDataAc.status">
                    <el-radio v-for="item in optionsStatus" :key="item.value" :value="item.value">
                        {{ CouponStatusDisplay[item.value] }}
                    </el-radio>
                </el-radio-group>
            </el-form-item>
        </el-form>

        <div class="btn-submit">
            <el-button type="primary" :loading="btnLoading" @click="submitForm(viewFormRef as FormInstance)">{{ btnSubmitDisplay }}</el-button>
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { FormInstance } from "element-plus" // 需要全部安装 npm i element-plus -S
import { reactive, ref, toRefs, useTemplateRef, watch } from "vue"

import {
    CouponDiscountType,
    CouponStackableDisplay,
    CouponStatusDisplay,
    getCouponStackableOptions,
    getCouponStatusOptions,
    getDiscountTypeOptions,
} from "@/api/coupon/common"
import { generateShortcuts } from "@/utils/dateTime"

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

const optionsStatus = getCouponStatusOptions()
const optionsStackable = getCouponStackableOptions()
const optionsDiscountType = getDiscountTypeOptions()

const amountMax = ref(999999999) // 金额最大值
const amountUnit = ref("分") // 金额单位
const amountPrecision = ref(0) // 金额精度
const amountStep = ref(1) // 金额步长

// 监听优惠类型变化，更新金额单位和最大值
watch(
    () => viewDataAc.discount_type,
    (newType) => {
        if (newType === CouponDiscountType.FixedAmount) {
            // 固定金额折扣
            amountUnit.value = "元"
            amountMax.value = 999999 // 最大值为999999分
            amountPrecision.value = 2 // 精度为0
            amountStep.value = 0.1 // 步长为0.1元
        } else if (newType === CouponDiscountType.Percentage) {
            // 百分比折扣
            amountUnit.value = "%"
            amountMax.value = 100 // 最大值为100%
            amountPrecision.value = 0 // 精度为0
            amountStep.value = 1 // 步长为1%
        }
    },
    {
        immediate: true, // 初始化时也执行一次
    },
)

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

.view-form {
    width: 600px;
}

.coupon-code {
    font-size: 20px;
    font-weight: 700;
}

.input-number {
    width: 100%;
}

.btn-submit {
    text-align: center;
}
</style>
