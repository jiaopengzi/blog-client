<!--
 * FilePath    : blog-client-dev\src\components\editor\components\settings\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 编辑器默认值设置弹窗
-->

<template>
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="400px" :close-on-click-modal="false" @close="handleClose">
        <PowerbiSettings v-if="command === CommandsKey.PowerBi" :initial-values="powerBiInitialValues" @save="handlePowerBiSave" @cancel="handleClose" />
        <WechatCaptchaSettings
            v-else-if="command === CommandsKey.WechatCaptcha"
            :initial-values="wechatCaptchaInitialValues"
            @save="handleWechatCaptchaSave"
            @cancel="handleClose"
        />
    </el-dialog>
</template>

<script lang="ts" setup>
import { computed } from "vue"

import {
    clearPowerBiDefaults,
    clearWechatCaptchaDefaults,
    loadPowerBiDefaults,
    loadWechatCaptchaDefaults,
    savePowerBiDefaults,
    saveWechatCaptchaDefaults,
    type PowerBiDefaults,
    type WechatCaptchaDefaults,
} from "@/stores/editor-defaults"

import { CommandsKey } from "../../command"
import PowerbiSettings from "./powerbi-settings"
import WechatCaptchaSettings from "./wechat-captcha-settings"

defineOptions({ name: "SettingsDialog" })

// 双向绑定弹窗可见状态
const dialogVisible = defineModel<boolean>({ required: true })

const props = defineProps<{
    command: CommandsKey | null // 当前打开设置的命令类型
}>()

const emit = defineEmits<{
    (event: "close"): void
}>()

// 弹窗标题映射，扩展时在此添加新条目
const dialogTitleMap: Partial<Record<CommandsKey, string>> = {
    [CommandsKey.PowerBi]: "PowerBi 默认设置",
    [CommandsKey.WechatCaptcha]: "WechatCaptcha 默认设置",
}

const dialogTitle = computed(() => (props.command ? (dialogTitleMap[props.command] ?? "") : ""))

// 关闭弹窗并通知父组件
const handleClose = () => {
    dialogVisible.value = false
    emit("close")
}

// 弹窗打开时从 localStorage 读取已保存的默认值传给子组件
const powerBiInitialValues = computed(() => (dialogVisible.value && props.command === CommandsKey.PowerBi ? loadPowerBiDefaults() : null))

const wechatCaptchaInitialValues = computed(() => (dialogVisible.value && props.command === CommandsKey.WechatCaptcha ? loadWechatCaptchaDefaults() : null))

// 保存 PowerBi 设置，data 为 null 时清除 localStorage
const handlePowerBiSave = (data: PowerBiDefaults | null) => {
    if (data) {
        savePowerBiDefaults(data)
    } else {
        clearPowerBiDefaults()
    }
    handleClose()
}

// 保存 WechatCaptcha 设置，data 为 null 时清除 localStorage
const handleWechatCaptchaSave = (data: WechatCaptchaDefaults | null) => {
    if (data) {
        saveWechatCaptchaDefaults(data)
    } else {
        clearWechatCaptchaDefaults()
    }
    handleClose()
}
</script>
