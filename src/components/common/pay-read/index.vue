<!--
 * FilePath    : blog-client\src\components\common\pay-read\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 付费阅读
-->

<template>
    <div v-if="!isPaid">
        <div class="no-pay">
            <JIcon :name="IconKeys.Lock" :custom-class="`my-icon`" class="lock" />
            <p class="text">
                隐藏内容，需要付费<span class="price">{{ price }}</span
                >元查看。
            </p>
            <div>
                <el-button class="pay-single" @click="paySingle">立即支付</el-button>
                <el-button class="pay-vip" @click="payVIP">升级VIP</el-button>
            </div>
        </div>
    </div>
    <div class="pay">
        <div v-if="isPaid" v-html="stateManager.getState().html"></div>
    </div>
</template>
<script lang="ts" setup>
import JIcon, { IconKeys } from "@/components/common/icons"
import { EditorStateManager } from "@/components/editor"
defineOptions({ name: "PayRead" })

// 定义 props
const {
    isPaid = false,
    price = 3,
    markdown,
} = defineProps<{
    isPaid?: boolean // 是否付费阅读
    price?: number // 价格
    markdown: string
}>()

// 事件
const emit = defineEmits<{
    (event: "pay-single"): void
    (event: "pay-vip"): void
}>()

// 支付单篇文章
const paySingle = () => {
    emit("pay-single")
}

// 支付成为 VIP
const payVIP = () => {
    emit("pay-vip")
}

const stateManager = new EditorStateManager()

stateManager.updateState(markdown)
</script>
<style scoped lang="scss">
.no-pay {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    text-align: center;
    position: relative;
    border: 1px dashed #c1401f; // 虚线边框
    border-radius: 10px;
    margin: 20px 0;

    .lock {
        font-size: 14px;
        position: absolute;
        top: 8px;
        left: 8px;
    }

    .text {
        font-size: 16px;
        color: var(--jpz-text-color-secondary);
        margin: 20px 0;
    }

    .my-icon {
        fill: #c1401f;
        font-size: 16px;
    }

    .price {
        color: #c1401f;
        font-weight: 700;
        font-size: 1.2em;
        margin: 0 2px;
    }

    .pay-single,
    .pay-vip {
        font-family: "JBMonoWOFF2", "roboto", "Microsoft YaHei", Helvetica, Arial, sans-serif;
        font-size: 16px;
        font-weight: 700;
        margin: 10px;
        width: 100px;
        height: 38px;
        color: #ffffff;
        border: none;
    }

    .pay-single {
        background-color: #188838;
    }

    .pay-vip {
        background-color: #c1401f;
    }
}
</style>
