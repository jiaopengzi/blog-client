<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-01-18 16:36:18
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-11-08 10:11:13
 * @FilePath     : \blog-client\src\components\common\switch-group\index.vue
 * @Description  : 开关组件 
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->
<template>
    <div class="my-switch">
        <span v-if="localNamePosition === 'left'" class="span-left"
            >{{ props.switchItem.display }}
        </span>
        <el-switch
            v-model="localStatus"
            :style="getSwitchStyle(props.switchItem)"
            class="my-el-switch"
            inline-prompt
            :active-text="props.switchItem.label?.labelTrue"
            :inactive-text="props.switchItem.label?.labelFalse"
        />
        <span v-if="localNamePosition === 'right'" class="span-right">{{
            props.switchItem.display
        }}</span>
    </div>
</template>

<script lang="ts" setup>
import type { SwitchItem } from "@/components/common/switch-group"
import { ref, watchEffect } from "vue"

defineOptions({ name: "SwitchGroup" })

const props = defineProps<{
    switchItem: SwitchItem // 开关项
    spanWordCount?: number | undefined // span字数
}>()

// 创建一个局部状态变量
const localStatus = ref(props.switchItem.status)
const localNamePosition = props.switchItem.namePosition || "left"

const emit = defineEmits<{
    (event: "update-status", value: SwitchItem): void
}>()

// 监听 localStatus 变化并向父组件发送事件通知
watchEffect(() => {
    emit("update-status", { ...props.switchItem, status: localStatus.value })
})

const getSwitchStyle = (item: SwitchItem) => {
    const colorOn = item.color?.colorTrue || "#13ce66"
    const colorOff = item.color?.colorFalse || "#ff4949"
    return `--el-switch-on-color: ${colorOn}; --el-switch-off-color: ${colorOff};`
}

const getSpanWidth = (spanWordCount: number | undefined) => {
    if (!spanWordCount) return ""
    // 通过字数使用em单位
    return `width: ${spanWordCount}em`
}
</script>

<style lang="scss" scoped>
// .my-switch {
//     display: flex;
//     align-items: center;
//     justify-content: center;
// }

.my-el-switch {
    margin: 0 10px;
}

.span-left,
.span-right {
    // display: inline-block;
    // text-align: right;
    // width: 100px;
    // padding: 0 4px;
}
</style>
