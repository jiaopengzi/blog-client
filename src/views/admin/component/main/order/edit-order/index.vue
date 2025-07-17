<!--
 * FilePath    : blog-client\src\views\admin\component\main\order\edit-order\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 订单编辑
-->

<template>
    <div class="edit-page">
        <el-descriptions class="order-main" title="订单信息" :column="3" border>
            <el-descriptions-item label="订单ID">{{ data.id }}</el-descriptions-item>
            <el-descriptions-item label="创建时间">{{ data.created_at }}</el-descriptions-item>
            <el-descriptions-item label="更新时间">{{ data.updated_at }}</el-descriptions-item>
            <el-descriptions-item label="客户信息">
                <UserItem
                    :user="data.user_info"
                    :is-show-cursor-pointer="false"
                    :is-show-user-name="true"
                    :size="40"
                    :is-show-user-email="true"
                    :is-show-user-display-name="true"
                />
            </el-descriptions-item>
            <el-descriptions-item label="描述">{{ data.description }}</el-descriptions-item>
            <el-descriptions-item label="IP地址">{{ data.ip }}</el-descriptions-item>
            <el-descriptions-item label="支付信息">
                <span v-if="data.payment && data.payment.pay_type"
                    >{{ PayTypeDisplay[data.payment.pay_type] }} - {{ TradeStateDisplay[data.payment.trade_state] }}</span
                >
                <span v-else>无支付信息</span>
            </el-descriptions-item>
            <el-descriptions-item label="状态">{{ OrderStatusDisplay[data.status] }}</el-descriptions-item>
            <el-descriptions-item label="订单总金额">{{ `${(data.total_amount / 100).toFixed(2)} 元` }}</el-descriptions-item>
        </el-descriptions>

        <ProductList class="product-list" :items="data.items" />
        <CouponList class="coupon-list" v-if="data.coupon_items" :total-amount="data.total_amount" :items="data.coupon_items" />
        <RefundList class="refund-list" v-if="data.refund" :total-amount="data.total_amount" :items="data.refund" />

        <!-- 可编辑的备注 -->
        <div v-if="availableRefundAmount > 0" class="refund-section">
            <p class="refund-description">退款流程：1、填写退款金额，2、发送验证码，3、填写验证码，4、提交退款。</p>
            <span class="refund-text">退款金额：</span>
            <el-input-number class="refund-item refund-amount" v-model="refundAmount" :min="0" :max="availableRefundAmount" :precision="2" :step="0.01">
                <template #suffix>
                    <span>元</span>
                </template>
            </el-input-number>

            <el-button class="btn-captcha refund-item" type="default" :disabled="isDisabled" @click="sendCaptcha">
                {{ captchaBtnText }}
            </el-button>
            <el-input class="email-code refund-item" v-model="captcha" clearable />
            <el-button class="refund-btn-submit refund-item" type="primary" :disabled="isDisabled" @click="handleRefund"> 提交退款 </el-button>
        </div>
        <div class="remark-section">
            <div class="remark-item">
                <p class="remark-label">客户备注：</p>
                <el-input class="remark-content" v-model="remark" type="textarea" :row="5" />
            </div>
            <div class="remark-item">
                <p class="remark-label">管理员备注：</p>
                <el-input class="remark-content" v-model="remarkAdmin" type="textarea" :row="5" />
            </div>
            <div class="remark-btn-submit">
                <el-button type="primary" @click="handleRemark"> 保存备注 </el-button>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { FormInstance } from "element-plus" // 需要全部安装 npm i element-plus -S
import { computed, onBeforeMount, type Ref, ref } from "vue"

import { type OrderGetByIDRes, OrderStatusDisplay } from "@/api/order/common"
import { PayTypeDisplay, TradeState, TradeStateDisplay } from "@/api/pay/common"
import CouponList from "@/components/common/coupon-list"
import ProductList from "@/components/common/product-list"
import RefundList from "@/components/common/refund-list"
import UserItem from "@/components/common/user-item"

defineOptions({ name: "EditOrder" })

const emit = defineEmits<{
    (event: "edit-status", value: boolean): void // 编辑用户状态
}>()

// props
const { data } = defineProps<{
    data: OrderGetByIDRes // 需要编辑的用户ID
}>()

const availableRefundAmount = computed(() => {
    // 如果没有支付信息，或者未支付，或者关闭，则可退款金额为0
    if (!data.payment.trade_state || data.payment.trade_state === TradeState.Unpaid || data.payment.trade_state === TradeState.Closed || data.total_amount <= 0)
        return 0

    // 如果没有退款信息，可退款金额就是订单总金额
    if (!data.refund) return data.total_amount / 100

    // 根据退款信息计算可退款金额
    const totalRefunded = data.refund.reduce((acc, item) => acc + (item.total_amount || 0), 0)
    return Math.max(0, data.total_amount - totalRefunded) / 100 // 确保不小于0
})

const refundAmount = ref(0) // 退款金额
const isDisabled = ref(false)
const captchaBtnText = ref("获取验证码")
const captcha = ref("")

// 发送邮箱验证码
const sendCaptcha = async () => {
    // 按钮设置不能点击状态
    let timer = 5
    captchaBtnText.value = `${timer}s后重新发送`
    const interval = setInterval(() => {
        timer--
        if (timer === 0) {
            clearInterval(interval)
            captchaBtnText.value = "发送验证码"
            isDisabled.value = false // 启用按钮
        } else {
            captchaBtnText.value = `${timer}s后重新发送`
        }
    }, 1000)
}

const handleRefund = async () => {
    if (refundAmount.value <= 0 || refundAmount.value > availableRefundAmount.value) {
        return emit("edit-status", false)
    }
    isDisabled.value = true // 禁用按钮
    // 这里可以添加发送退款请求的逻辑
}

const remark = ref(data.remark) // 客户备注
const remarkAdmin = ref(data.remark_admin) // 管理员备注

const handleRemark = async (formEl: FormInstance | undefined) => {
    if (!formEl) return

    await formEl.validate(async (valid) => {
        if (valid) {
        }
    })
}

onBeforeMount(() => {})
</script>

<style lang="scss" scoped>
.order-main,
.product-list,
.coupon-list,
.refund-list {
    margin-bottom: 40px;
}

.refund-section {
    margin: 40px 0; // 设置退款部分的上下间距
    .refund-description {
        font-size: 14px; // 设置退款流程描述的字体大小
        color: var(--jpz-text-color-secondary); // 设置退款流程描述的字体颜色
        margin-bottom: 10px; // 设置退款流程描述的下边距
    }
    .refund-text {
        font-weight: 700; // 设置退款金额文本为粗体
    }
    .refund-item {
        margin-right: 10px; // 设置退款项之间的间距
    }
    .refund-item {
        margin-right: 10px; // 设置退款项之间的间距
    }

    .refund-amount {
        width: 200px; // 设置退款金额输入框的宽度
    }

    .email-code {
        width: 100px; // 设置验证码输入框的宽度
    }

    .btn-captcha {
        margin-left: 10px; // 设置验证码按钮的左边距
    }
}
.remark-section {
    margin-top: 20px;

    .remark-item {
        margin-bottom: 20px;
    }

    .remark-label {
        font-weight: 700;
        margin-bottom: 5px; // 设置备注标签的右边距
    }

    .remark-content {
        width: 100%;
    }

    .remark-btn-submit {
        margin-top: 10px;
        text-align: center;
    }
}
</style>
