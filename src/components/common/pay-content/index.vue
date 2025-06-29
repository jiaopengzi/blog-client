<!--
 * FilePath    : blog-client\src\components\common\pay-content\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 付费内容
-->

<template>
    <div v-if="!isPaid">
        <div class="no-pay">
            <JIcon :name="IconKeys.Lock" :custom-class="`my-icon`" class="lock" />
            <div class="text" v-if="payType === PayType.Read">
                隐藏内容，付费<span class="price">{{ price }}</span
                >元查看。
            </div>
            <div class="text" v-if="payType === PayType.Download">
                附件内容，付费<span class="price">{{ price }}</span
                >元下载。
            </div>
            <div class="text-vip">升级为 VIP 可免费查看(除特定内容外)所有内容。</div>
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

import { type PayContentProps, PayType } from "./types.ts"
defineOptions({ name: "PayContent" })

// 定义 props
const { payType = PayType.Read, isPaid = false, price = 99, markdown } = defineProps<PayContentProps>()

// 事件
const emit = defineEmits<{
    (event: "pay-single", val: PayType): void
    (event: "pay-vip", val: PayType): void
}>()

// 支付单篇文章
const paySingle = () => {
    emit("pay-single", payType)
}

// 支付成为 VIP
const payVIP = () => {
    emit("pay-vip", payType)
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

    .text,
    .text-vip {
        font-family: "JBMonoWOFF2", "roboto", "Microsoft YaHei", Helvetica, Arial, sans-serif;
        font-size: 14px;
        color: var(--jpz-text-color-secondary);
        margin: 4px 0;
    }

    .my-icon {
        fill: #c1401f;
        font-size: 16px;
    }

    .price {
        font-family: "JBMonoWOFF2", "roboto", "Microsoft YaHei", Helvetica, Arial, sans-serif;
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
