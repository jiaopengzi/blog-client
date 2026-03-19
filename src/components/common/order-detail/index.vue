<!--
 * FilePath    : blog-client\src\views\admin\component\main\order\order-detail\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 订单详情
-->

<template>
    <div class="edit-page">
        <div class="order-loading" v-loading="isLoading">
        <el-descriptions class="order-main" title="订单信息" :column="column" border>
            <el-descriptions-item label="订单ID">{{ dataAc.id }}</el-descriptions-item>
            <el-descriptions-item label="创建时间">{{ dataAc.created_at }}</el-descriptions-item>
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
            <el-descriptions-item label="描述">{{ dataAc.description }}</el-descriptions-item>
            <el-descriptions-item label="IP地址" v-if="isAdmin">{{ dataAc.ip }}</el-descriptions-item>
            <el-descriptions-item label="状态">{{ OrderStatusDisplay[dataAc.status] }} </el-descriptions-item>
            <el-descriptions-item label="支付信息">
                <span v-if="dataAc.payment && dataAc.payment.pay_type"
                    >{{ PayTypeDisplay[dataAc.payment.pay_type] }} - {{ TradeStateDisplay[dataAc.payment.trade_state] }}</span
                >
                    <span v-else>无支付信息</span>
            </el-descriptions-item>
            <el-descriptions-item label="订单总金额">{{ `${(dataAc.total_amount / 100).toFixed(2)} 元` }}</el-descriptions-item>
        </el-descriptions>

        <!-- 产品 优惠券 都不会变 -->
        <ProductList class="product-list" :items="dataAc.items" />
        <CouponList class="coupon-list" v-if="dataAc.coupon_items" :total-amount="dataAc.total_amount" :items="dataAc.coupon_items" />
        <RefundList class="refund-list" v-if="refundList.length" :total-paid-amount="dataAc.payment.total_amount" :items="refundList" />
        <OrderRefund
            v-if="availableRefundAmount > 0 && isAdmin"
            class="order-refund"
            :order-id="dataAc.id"
            :available-refund-amount="availableRefundAmount"
            @refund-submit-success="handleRefundSubmit"
        />
        <!-- 取消订单 -->
        <div class="order-operation" v-if="dataAc.status === OrderStatus.PendingPay">
            <el-button type="primary" :loading="isOrderReCheckoutLoading" @click="handleReCheckout">重新支付</el-button>
            <el-button type="primary" :loading="isOrderCancelLoading" @click="handleCancel">取消订单</el-button>
        </div>
        <OrderRemark
            v-if="isAdmin"
            class="order-remark"
            :order-id="dataAc.id"
            :remark="dataAc.remark"
            :remark-admin="dataAc.remark_admin"
            @remark-submit-success="handleRemarkSubmit"
        />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from "vue"
import { useRouter } from "vue-router"

import { orderCancelAPI, type OrderCancelRequest } from "@/api/order/cancel"
import { type OrderGetByIDRes, OrderStatus, OrderStatusDisplay, type RefundRes } from "@/api/order/common"
import { getByIDAdminAPI, getByIDAPI, type OrderGetByIDRequest } from "@/api/order/getByID"
import { type GetCheckoutByOrderIdRequest, getOrderCheckoutByOrderIdAPI } from "@/api/order/getCheckout"
import { PayTypeDisplay, TradeState, TradeStateDisplay } from "@/api/pay/common"
import { handleResErr, ResponseCode } from "@/api/response"
import { RouteNames } from "@/router"
import { pollingGetStreamIDsStatus } from "@/utils/getStreamIDsStatus"
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
const {
    data,
    isAdmin = true,
    column = 1,
} = defineProps<{
    data: OrderGetByIDRes // 需要编辑的用户ID
    isAdmin?: boolean // 是否显示用户信息
    column?: number // 信息列数
}>()

const router = useRouter()
const dataAc = ref<OrderGetByIDRes>(data) // 实际数据

const refundList = ref<RefundRes[]>(data.refund || [])
const isLoading = ref(false)

const syncOrderData = (nextData: OrderGetByIDRes) => {
    dataAc.value = nextData
    refundList.value = nextData.refund || []
}

const loadOrderDetail = async () => {
    if (!dataAc.value.id) return

    isLoading.value = true
    try {
        const req: OrderGetByIDRequest = {
            id: dataAc.value.id,
        }

        const res = isAdmin ? await getByIDAdminAPI(req) : await getByIDAPI(req)
        if (res.data.code === ResponseCode.OrderGetByIDSuccess) {
            syncOrderData(res.data.data)
            return
        }

        const msg = handleResErr(res)
        MessageUtil.error(msg)
    } finally {
        isLoading.value = false
    }
}

watch(
    () => data,
    (newVal) => {
        syncOrderData(newVal)
        void loadOrderDetail()
    },
    { deep: true, immediate: true },
)

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
    const res = await getByIDAdminAPI(req)
    if (res.data.code === ResponseCode.OrderGetByIDSuccess) {
        syncOrderData(res.data.data)
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

// 取消订单的加载状态
const isOrderCancelLoading = ref(false)

// 取消订单
const handleCancel = async () => {
    isOrderCancelLoading.value = true
    try {
        const req: OrderCancelRequest = {
            id: dataAc.value.id,
        }
        const res = await orderCancelAPI(req)
        if (res.data.code === ResponseCode.OrderCancelSuccess) {
            // 保证有数据且包含 stream_items 字段才进行轮询
            if (res.data.data && res.data.data.stream_items) {
                await pollingGetStreamIDsStatus(res.data.data.stream_items)
            }

            // 取消成功，更新订单状态
            dataAc.value.status = OrderStatus.Canceled
            emit("edit-status", true)
            MessageUtil.success("订单取消成功")
        } else {
            const msg = handleResErr(res)
            MessageUtil.error(msg)
        }
    } catch (error) {
        MessageUtil.error("订单取消失败，请稍后重试")
    } finally {
        isOrderCancelLoading.value = false
    }
}

// 重新结算的加载状态
const isOrderReCheckoutLoading = ref(false)

// 重新结算订单
const handleReCheckout = async () => {
    isOrderReCheckoutLoading.value = true
    try {
        const req: GetCheckoutByOrderIdRequest = {
            id: dataAc.value.id,
        }
        const res = await getOrderCheckoutByOrderIdAPI(req)
        if (res.data.code === ResponseCode.GetOrderCheckoutSuccess) {
            router.push({ name: RouteNames.Checkout })
        } else if (res.data.code === ResponseCode.OrderCheckoutOrderIDMismatch) {
            // 保证有数据且包含 stream_items 字段才进行轮询
            if (res.data.data && res.data.data.stream_items) {
                await pollingGetStreamIDsStatus(res.data.data.stream_items)
            }

            // 关闭订单
            dataAc.value.status = OrderStatus.Closed
            emit("edit-status", true)
            MessageUtil.error("订单信息已过期，请重新下单")
        } else {
            const msg = handleResErr(res)
            MessageUtil.error(msg)
        }
    } catch (error) {
        MessageUtil.error("订单结算失败，请稍后重试")
    } finally {
        isOrderReCheckoutLoading.value = false
    }
}
</script>

<style lang="scss" scoped>
.order-main,
.product-list,
.coupon-list,
.refund-list {
    margin-bottom: 40px;
}

.order-loading {
    min-height: 160px;
}

.order-operation {
    text-align: center;
    margin: 20px 0;
}
</style>
