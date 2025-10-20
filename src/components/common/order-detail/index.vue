<!--
 * FilePath    : blog-client\src\views\admin\component\main\order\order-detail\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 订单详情
-->

<template>
    <div class="edit-page">
        <el-descriptions class="order-main" title="订单信息" :column="3" border>
            <el-descriptions-item label="订单ID">{{ data.id }}</el-descriptions-item>
            <el-descriptions-item label="创建时间">{{ data.created_at }}</el-descriptions-item>
            <el-descriptions-item label="更新时间" v-if="isAdmin">{{ dataAc.updated_at }}</el-descriptions-item>
            <el-descriptions-item label="客户信息" v-if="isAdmin">
                <!-- 用户信息就使用 data 不需要更新 -->
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
            <el-descriptions-item label="IP地址" v-if="isAdmin">{{ data.ip }}</el-descriptions-item>
            <el-descriptions-item label="状态">{{ OrderStatusDisplay[dataAc.status] }}</el-descriptions-item>
            <el-descriptions-item label="支付信息">
                <span v-if="dataAc.payment && dataAc.payment.pay_type"
                    >{{ PayTypeDisplay[dataAc.payment.pay_type] }} - {{ TradeStateDisplay[dataAc.payment.trade_state] }}</span
                >
                <span v-else>无支付信息</span>
            </el-descriptions-item>
            <el-descriptions-item label="订单总金额">{{ `${(data.total_amount / 100).toFixed(2)} 元` }}</el-descriptions-item>
        </el-descriptions>

        <!-- 产品 优惠卷 都不会变 -->
        <ProductList class="product-list" :items="data.items" />
        <CouponList class="coupon-list" v-if="data.coupon_items" :total-amount="data.total_amount" :items="data.coupon_items" />
        <RefundList class="refund-list" v-if="refundList.length" :total-paid-amount="dataAc.payment.total_amount" :items="refundList" />
        <OrderRefund
            v-if="availableRefundAmount > 0 && isAdmin"
            class="order-refund"
            :order-id="data.id"
            :available-refund-amount="availableRefundAmount"
            @refund-submit-success="handleRefundSubmit"
        />
        <OrderRemark
            v-if="isAdmin"
            class="order-remark"
            :order-id="dataAc.id"
            :remark="dataAc.remark"
            :remark-admin="dataAc.remark_admin"
            @remark-submit-success="handleRemarkSubmit"
        />
    </div>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue"

import { type OrderGetByIDRes, OrderStatusDisplay, type RefundRes } from "@/api/order/common"
import { getByIDAPI, type OrderGetByIDRequest } from "@/api/order/getByID"
import { PayTypeDisplay, TradeState, TradeStateDisplay } from "@/api/pay/common"
import { handleResErr, ResponseCode } from "@/api/response"
import { MessageUtil } from "@/utils/message"

import CouponList from "../coupon-list"
import OrderRefund from "../order-refund"
import OrderRemark from "../order-remark"
import ProductList from "../product-list"
import RefundList from "../refund-list"
import UserItem from "../user-item"

defineOptions({ name: "OrderDetail" })

const emit = defineEmits<{
    (event: "edit-status", value: boolean): void // 编辑用户状态
}>()

// props
const { data, isAdmin = true } = defineProps<{
    data: OrderGetByIDRes // 需要编辑的用户ID
    isAdmin?: boolean // 是否显示用户信息
}>()

const dataAc = ref<OrderGetByIDRes>(data) // 实际数据

const refundList = ref<RefundRes[]>(data.refund || [])

const availableRefundAmount = computed(() => {
    // 如果没有支付信息，或者未支付，或者关闭，则可退款金额为0
    if (
        !dataAc.value.payment ||
        !dataAc.value.payment.trade_state ||
        dataAc.value.payment.trade_state === TradeState.Unpaid ||
        dataAc.value.payment.trade_state === TradeState.Closed ||
        dataAc.value.total_amount <= 0
    ) {
        return 0
    }

    // 如果没有退款信息，可退款金额就是订单总金额
    if (refundList.value.length === 0) {
        return dataAc.value.payment.total_amount / 100
    }

    // 根据退款信息计算可退款金额
    const totalRefunded = refundList.value.reduce((acc, item) => acc + (item.refund_amount || 0), 0)
    return Math.max(0, dataAc.value.payment.total_amount - totalRefunded) / 100 // 确保不小于0
})

// 退款成功后触发事件
const handleRefundSubmit = async () => {
    emit("edit-status", true)
    // 重新获取订单详情
    const req: OrderGetByIDRequest = {
        id: dataAc.value.id,
    }
    const res = await getByIDAPI(req)
    if (res.data.code === ResponseCode.OrderGetByIDSuccess) {
        refundList.value = res.data.data.refund
        dataAc.value = res.data.data // 更新实际数据
        MessageUtil.success("退款提交成功")
    } else {
        const msg = handleResErr(res)
        MessageUtil.error(msg)
    }
}

// 提交备注成功后触发事件
const handleRemarkSubmit = async () => {
    emit("edit-status", true)
}
</script>

<style lang="scss" scoped>
.order-main,
.product-list,
.coupon-list,
.refund-list {
    margin-bottom: 40px;
}
</style>
