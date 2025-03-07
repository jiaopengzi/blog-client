<!--
 * @FilePath     : \blog-client\src\components\common\restart-dialog\index.vue
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved. 
 * @Description  : 重启弹窗
-->

<template>
    <el-dialog
        v-model="isShowTimerAc"
        title="Tips"
        width="500"
        :show-close="false"
        :align-center="true"
        :lock-scroll="false"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
    >
        <template #header>
            <div class="dialog-header">请稍等...</div>
        </template>
        <template #footer>
            <div class="dialog-footer">若超过 {{ maxWaitSeconds }} 秒未重启成功，请检查网络和提供的数据库是否连接正常！</div>
        </template>
        <div class="timer">
            <h1>服务端正在重启，请勿刷新页面！</h1>
            <h2>等待时间：{{ waitSeconds }} 秒</h2>
        </div>
    </el-dialog>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue"

defineOptions({ name: "RestartDialog" })

const {
    maxWaitSeconds = 60,
    waitSeconds,
    isShowTimer = false,
} = defineProps<{
    maxWaitSeconds?: number
    waitSeconds: number
    isShowTimer: boolean
}>()

const isShowTimerAc = ref(isShowTimer)

watch(
    () => isShowTimer,
    (newVal) => {
        isShowTimerAc.value = newVal
    },
)
</script>

<style scoped lang="scss">
.timer {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top: 20px;

    h1 {
        font-size: 24px;
        font-weight: 700;
        color: var(--jpz-text-color-primary);
        margin-bottom: 10px;
    }
    h2 {
        margin-top: 20px;
        margin-bottom: 10px;
        font-size: 16px;
        font-weight: 700;
        color: var(--jpz-text-color-secondary);
    }
}

.dialog-header {
    font-size: 16px;
    color: var(--jpz-text-color-secondary);
}

.dialog-footer {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 14px;
    color: var(--jpz-text-color-secondary);
}
</style>
