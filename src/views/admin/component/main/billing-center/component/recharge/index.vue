<!--
 * FilePath    : blog-client\src\views\admin\component\main\billing-center\component\recharge\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 计费中心充值表单
-->

<template>
    <!-- 充值表单 -->
    <div v-if="!payUrl" class="recharge-form">
        <div class="recharge-tip">
            <el-icon :size="16"><InfoFilled /></el-icon>
            <span>充值金额将实时到账, 请确认金额无误后提交</span>
        </div>

        <el-form ref="formRef" :model="form" :rules="rules" label-width="100px" label-position="top">
            <!-- 支付方式平铺选择 -->
            <el-form-item label="支付方式" prop="pay_type">
                <el-radio-group v-model="form.pay_type">
                    <el-radio v-for="item in payTypeOptions" :key="item.value" :value="item.value">
                        <span class="pay-type-name">{{ PayTypeDisplay[item.value] }}</span>
                    </el-radio>
                </el-radio-group>
            </el-form-item>

            <el-form-item label="充值金额(元)" prop="total_amount">
                <!-- 快捷金额按钮 -->
                <div class="quick-amount">
                    <el-button
                        v-for="amount in quickAmounts"
                        :key="amount"
                        :class="{ active: form.total_amount === String(amount) }"
                        size="small"
                        @click="form.total_amount = String(amount)"
                        >{{ `￥${amount}` }}</el-button
                    >
                </div>
                <el-input-number
                    class="amount-input"
                    v-model="form.total_amount"
                    placeholder="请输入充值金额(元)"
                    :precision="0"
                    :step="1"
                    :min="20"
                    :max="1000"
                    clearable
                >
                    <template #prefix>
                        <span>￥</span>
                    </template>
                </el-input-number>
            </el-form-item>

            <el-form-item label="备注" prop="remark">
                <el-input v-model="form.remark" placeholder="请输入备注(可选)" type="textarea" :rows="3" maxlength="100" show-word-limit />
            </el-form-item>

            <el-form-item>
                <el-button class="btn-submit" :loading="submitting" @click="handleSubmit"> 提交充值 </el-button>
            </el-form-item>
        </el-form>
    </div>

    <!-- 支付二维码 -->
    <div v-else class="pay-qr-section">
        <PayQrCode :qr-code-url="payUrl" :pay-type="form.pay_type" :amount="payAmountYuan" />
        <div class="pay-actions">
            <el-button type="primary" :loading="querying" @click="handleQueryRecharge"> 我已支付 </el-button>
            <el-button @click="handleReset"> 重新充值 </el-button>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { InfoFilled } from "@element-plus/icons-vue"
import { type FormInstance, type FormRules } from "element-plus"
import { debounce } from "throttle-debounce"
import { reactive, ref } from "vue"

import type { BillingCenterRechargeRes } from "@/api/billingCenter/common"
import { billingCenterRechargeAPI, type BillingCenterRechargeRequest } from "@/api/billingCenter/recharge"
import { billingCenterRechargeQueryAPI } from "@/api/billingCenter/rechargeQuery"
import { getPayTypeOptions, PayType, PayTypeDisplay } from "@/api/pay/common"
import { handleResErr, ResponseCode } from "@/api/response"
import PayQrCode from "@/components/common/pay-qr-code"
import { MessageUtil } from "@/utils/message"
import { yuanToFen } from "@/utils/amount"

// 定义事件
const emit = defineEmits<{
    (event: "recharge-status", status: boolean): void
}>()

// 支付方式选项
const payTypeOptions = getPayTypeOptions()

// 快捷充值金额选项
const quickAmounts = [20, 50, 100, 200, 1000]

// 表单引用
const formRef = ref<FormInstance>()

// 表单数据
const form = reactive<BillingCenterRechargeRequest>({
    pay_type: PayType.Alipay,
    total_amount: "0",
    remark: "",
    return_url: window.location.href,
})

// 充值结果
const payUrl = ref("")
const rechargeOrderId = ref("")
const payAmountYuan = ref("")

// 表单校验规则
const rules = reactive<FormRules>({
    pay_type: [{ required: true, message: "请选择支付方式", trigger: "change" }],
    total_amount: [
        { required: true, message: "请输入充值金额", trigger: "blur" },
        {
            validator: (_rule, value, callback) => {
                const num = Number(value)
                if (isNaN(num) || num <= 0) {
                    callback(new Error("金额必须大于 0"))
                } else if (!Number.isInteger(num)) {
                    callback(new Error("金额必须为正整数, 不支持小数"))
                } else {
                    callback()
                }
            },
            trigger: "blur",
        },
    ],
})

const submitting = ref(false)
const querying = ref(false)

/**
 * handleSubmit 提交充值表单。
 * 金额单位为元, 提交时转换为分。
 */
const handleSubmit = debounce(300, async () => {
    const valid = await formRef.value?.validate().catch(() => false)
    if (!valid) return

    submitting.value = true
    try {
        // 将元转换为分
        const amountInCents = yuanToFen(form.total_amount, true) as string
        const res = await billingCenterRechargeAPI({
            ...form,
            total_amount: amountInCents,
        })
        if (res.data.code === ResponseCode.BillingCenterRechargeOrderSuccess) {
            const data = res.data.data as BillingCenterRechargeRes
            payUrl.value = data.pay_url
            rechargeOrderId.value = data.order_id
            payAmountYuan.value = Number(form.total_amount).toFixed(2)
            MessageUtil.success("充值订单创建成功, 请扫码支付")
        } else {
            MessageUtil.error(handleResErr(res))
        }
    } finally {
        submitting.value = false
    }
})

/**
 * handleQueryRecharge 查询充值结果。
 */
const handleQueryRecharge = debounce(300, async () => {
    if (!rechargeOrderId.value) return

    querying.value = true
    try {
        const res = await billingCenterRechargeQueryAPI({
            pay_type: form.pay_type,
            order_id: rechargeOrderId.value,
        })
        if (res.data.code === ResponseCode.BillingCenterRechargeOrderPayQuerySuccess) {
            const data = res.data.data
            if (data.pay_status === "paid") {
                MessageUtil.success("支付成功")
                emit("recharge-status", true)
            } else {
                MessageUtil.info(`支付状态: ${data.pay_status}`)
            }
        } else {
            MessageUtil.error(handleResErr(res))
        }
    } catch {
        MessageUtil.error("查询失败")
    } finally {
        querying.value = false
    }
})

/**
 * handleReset 重置充值表单, 返回填写状态。
 */
const handleReset = () => {
    payUrl.value = ""
    rechargeOrderId.value = ""
    payAmountYuan.value = ""
}
</script>

<style scoped lang="scss">
.recharge-tip {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 16px;
    margin-bottom: 20px;
    border-radius: 8px;
    font-size: 13px;
    color: var(--jpz-text-color-secondary);
    border: 1px solid var(--jpz-border-color-lighter);

    .el-icon {
        color: var(--jpz-color-primary);
        flex-shrink: 0;
    }
}

.pay-type-name {
    font-size: 14px;
    font-weight: 500;
    color: var(--jpz-text-color-primary);
}

.quick-amount {
    display: flex;
    gap: 8px;
    margin-bottom: 12px;
    flex-wrap: wrap;

    .el-button {
        min-width: 64px;
        font-weight: 600;

        &.active {
            background: var(--jpz-color-primary);
            border-color: var(--jpz-color-primary);
            color: #fff;
        }
    }
}

.amount-input {
    width: 100%;
}

// 充值提交按钮使用副色
.btn-submit {
    --el-button-bg-color: var(--jpz-color-secondary);
    --el-button-border-color: var(--jpz-color-secondary);
    --el-button-text-color: #fff;
    --el-button-hover-bg-color: var(--jpz-color-secondary);
    --el-button-hover-border-color: var(--jpz-color-secondary);
    --el-button-hover-text-color: #fff;
    --el-button-active-bg-color: var(--jpz-color-secondary);
    --el-button-active-border-color: var(--jpz-color-secondary);
    --el-button-active-text-color: #fff;
    min-width: 120px;
    font-weight: 600;

    &:hover,
    &:focus {
        opacity: 0.85;
    }
}

.pay-qr-section {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.pay-actions {
    display: flex;
    gap: 12px;
    margin-top: 16px;
}
</style>
