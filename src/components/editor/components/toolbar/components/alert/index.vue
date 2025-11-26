<!--
 * FilePath    : blog-client-dev\src\components\editor\components\toolbar\components\alert\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 提醒组件
-->

<template>
    <!-- 提示 -->
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

        <div class="alerts">
            <el-button class="alert-item alert-note" type="default" @click="handleAlertSelect(Alerts.NOTE)">Note</el-button>
            <el-button class="alert-item alert-tip" type="default" @click="handleAlertSelect(Alerts.TIP)">Tip</el-button>
            <el-button class="alert-item alert-important" type="default" @click="handleAlertSelect(Alerts.IMPORTANT)">Important</el-button>
            <el-button class="alert-item alert-warning" type="default" @click="handleAlertSelect(Alerts.WARNING)">Warning</el-button>
            <el-button class="alert-item alert-caution" type="default" @click="handleAlertSelect(Alerts.CAUTION)">Caution</el-button>
        </div>
    </el-popover>
</template>

<script lang="ts" setup>
import type { IconKeys } from "@/components/common/icons"

import { Alerts } from "./types"

defineOptions({ name: "BarAlert" })

// 定义 props
const { icon } = defineProps<{
    icon: IconKeys // 预览内容
}>()

// 子组件 传参
const emit = defineEmits<{
    (e: "alert-select", val: Alerts): void
}>()

// 插入提示
const handleAlertSelect = (val: Alerts) => {
    emit("alert-select", val)
}
</script>

<style scoped lang="scss">
.alerts {
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: 8px;
    padding-top: 10px;
    padding-bottom: 10px;
    background-color: var(--jpz-bg-color-page);

    .alert-item {
        margin: 5px;
        width: 80px;
        border-radius: 4px;
    }

    .alert-note {
        color: var(--markdown-alert-note-title-color);
        background-color: var(--markdown-alert-note-bg-color);
        border: 1px solid var(--markdown-alert-note-border-color);
    }

    .alert-tip {
        color: var(--markdown-alert-tip-title-color);
        background-color: var(--markdown-alert-tip-bg-color);
        border: 1px solid var(--markdown-alert-tip-border-color);
    }

    .alert-important {
        color: var(--markdown-alert-important-title-color);
        background-color: var(--markdown-alert-important-bg-color);
        border: 1px solid var(--markdown-alert-important-border-color);
    }

    .alert-warning {
        color: var(--markdown-alert-warning-title-color);
        background-color: var(--markdown-alert-warning-bg-color);
        border: 1px solid var(--markdown-alert-warning-border-color);
    }

    .alert-caution {
        color: var(--markdown-alert-caution-title-color);
        background-color: var(--markdown-alert-caution-bg-color);
        border: 1px solid var(--markdown-alert-caution-border-color);
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
