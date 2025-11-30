<!--
 * FilePath    : blog-client-dev\src\components\editor\components\toolbar\components\pay\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 付费组件
-->
<template>
    <!-- 付费组件 -->
    <el-popover
        placement="bottom"
        width="100"
        trigger="hover"
        popper-class="popper-class"
        popper-style="background-color: transparent; border: none; box-shadow: none;"
        :show-arrow="false"
        :offset="0"
    >
        <template #reference>
            <j-icon :name="icon" custom-class="iconfont" />
        </template>

        <div class="pays">
            <div>付费项目</div>
            <el-button class="pay-item" type="default" @click="handlePaySelect(payTags[Names.PayVideo])">视频</el-button>
            <el-button class="pay-item" type="default" @click="handlePaySelect(payTags[Names.PayMembership])">会员</el-button>
            <el-button class="pay-item" type="default" @click="handlePaySelect(payTags[Names.PayRead])">阅读</el-button>
            <el-button class="pay-item" type="default" @click="handlePaySelect(payTags[Names.PayDownload])">下载</el-button>
            <el-button class="pay-item" type="default" @click="handlePaySelect(payTags[Names.PayKey])">卡密</el-button>
        </div>
    </el-popover>
</template>

<script lang="ts" setup>
import type { IconKeys } from "@/components/common/icons"
import { Names } from "@/customElements"

import { type PayTagItem, payTags } from "./types"

defineOptions({ name: "BarPay" })

// 定义 props
const { icon } = defineProps<{
    icon: IconKeys // 预览内容
}>()

// 子组件 传参
const emit = defineEmits<{
    (e: "pay-select", val: PayTagItem): void
}>()

// 插入付费组件
const handlePaySelect = (val: PayTagItem) => {
    emit("pay-select", val)
}
</script>

<style scoped lang="scss">
.pays {
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: 8px;
    padding-top: 10px;
    padding-bottom: 10px;
    background-color: var(--jpz-bg-color-page);

    .pay-item {
        margin: 5px;
        width: 80px;
        border-radius: 4px;
    }
}

.iconfont {
    width: 28px;
    height: 28px;
    font-size: 20px;
    fill: var(--jpz-text-color-primary);
    transition: fill 0.3s ease;
    border-radius: 4px;
}

.iconfont:hover {
    background-color: var(--jpz-text-color-secondary);
}

.popper-class {
    background: transparent;
    border: none;
    box-shadow: none;
}
</style>
