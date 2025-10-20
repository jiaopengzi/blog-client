<!--
 * FilePath    : blog-client\src\components\common\order-remark\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 订单备注
-->

<template>
    <div class="order-remark">
        <h4 class="title">订单备注</h4>
        <el-form label-position="left" label-width="100px" ref="formRef" :model="formRemark" :rules="rules" size="default">
            <el-form-item label="客户备注" prop="remark">
                <el-input
                    v-model="formRemark.remark"
                    type="textarea"
                    :row="2"
                    show-word-limit
                    maxlength="500"
                    placeholder="可填写备注，500字以内，客户可见。"
                />
            </el-form-item>
            <el-form-item label="管理员备注" prop="remark_admin">
                <el-input
                    v-model="formRemark.remark_admin"
                    type="textarea"
                    :row="2"
                    show-word-limit
                    maxlength="500"
                    placeholder="可填写备注，500字以内，仅管理员可见。"
                />
            </el-form-item>
        </el-form>

        <div class="remark-btn-submit">
            <el-button type="primary" :loading="isRemarkBtnLoading" @click="handleRemark"> 保存备注 </el-button>
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { FormInstance, FormRules } from "element-plus" // 需要全部安装 npm i element-plus -S
import { ref, useTemplateRef } from "vue"

import { type UpdateOrderAdminRequest } from "@/api/order/updateAdmin"

import { useOrderRemark } from "./hooks"

defineOptions({ name: "OrderRemark" })

const { orderId, remark, remarkAdmin } = defineProps<{
    orderId: string
    remark: string // 订单备注
    remarkAdmin: string // 管理员备注
}>()

// 事件
const emit = defineEmits<{
    (event: "remark-submit-success"): void // 退款提交成功
}>()

// 表单实例
const formRef = useTemplateRef<FormInstance>("formRef")

const formRemark = ref<UpdateOrderAdminRequest>({
    id: orderId,
    remark: remark,
    remark_admin: remarkAdmin,
})

const rules: FormRules<UpdateOrderAdminRequest> = {}

const { isRemarkBtnLoading, runRemark } = useOrderRemark(formRef, formRemark)

const handleRemark = async () => {
    await runRemark()
    emit("remark-submit-success")
}
</script>
<style lang="scss" scoped>
h4 {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 10px;
}

.title {
    color: var(--jpz-text-color-primary);
}

.order-remark {
    margin: 20px 0;

    .remark-btn-submit {
        margin-top: 20px;
        text-align: center;
    }
}
</style>
