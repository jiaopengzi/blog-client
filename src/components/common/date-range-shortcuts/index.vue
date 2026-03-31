<!--
 * FilePath    : blog-client\src\components\common\date-range-shortcuts\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 日期快捷筛选组件(快捷按钮 + 开始/结束日期选择器)
-->

<template>
    <div class="date-range-shortcuts">
        <!-- 快捷按钮 -->
        <div class="date-shortcuts">
            <span
                v-for="item in shortcutList"
                :key="item.label"
                :class="['shortcut-item', { active: activeLabel === item.label }]"
                @click="onShortcutClick(item)"
            >
                {{ item.label }}
            </span>
        </div>
        <!-- 日期选择器 -->
        <div class="date-pickers">
            <span class="filter-label">开始时间</span>
            <el-date-picker
                v-model="innerStartDate"
                type="datetime"
                :placeholder="startPlaceholder || '年/月/日 --:--:--'"
                :style="{ width: pickerWidth || '190px' }"
            />
            <span class="filter-label" style="margin-left: 8px">结束时间</span>
            <el-date-picker
                v-model="innerEndDate"
                type="datetime"
                :placeholder="endPlaceholder || '年/月/日 --:--:--'"
                :style="{ width: pickerWidth || '190px' }"
            />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from "vue"

import type { DateShortcut, DateRangeShortcutsProps } from "./types"
import { defaultShortcuts } from "./types"
import { formatLocalISO } from "@/utils/dateTime"

defineOptions({ name: "DateRangeShortcuts" })

const { start = "", end = "", shortcuts, startPlaceholder, endPlaceholder, pickerWidth } = defineProps<DateRangeShortcutsProps>()

const emit = defineEmits<{
    (e: "update:start", value: string): void
    (e: "update:end", value: string): void
    (e: "change", start: string, end: string): void
}>()

const shortcutList = computed(() => shortcuts ?? defaultShortcuts)

/** 当前激活的快捷标签 */
const activeLabel = ref("")

/** 将字符串解析为 Date，空串返回 null */
const parseDate = (val: string | undefined): Date | null => {
    if (!val) return null
    const d = new Date(val)
    return isNaN(d.getTime()) ? null : d
}

/** 内部用 Date 对象驱动 el-date-picker */
const innerStartDate = ref<Date | null>(parseDate(start))
const innerEndDate = ref<Date | null>(parseDate(end))

// 外部 props 变化时同步到内部 Date
watch(
    () => start,
    (val) => {
        innerStartDate.value = parseDate(val)
    },
)
watch(
    () => end,
    (val) => {
        innerEndDate.value = parseDate(val)
    },
)

// 内部 Date 变化时格式化为字符串 emit 到外部
watch(innerStartDate, (val) => {
    const str = val ? formatLocalISO(val) : ""
    emit("update:start", str)
    if (!val) activeLabel.value = ""
})
watch(innerEndDate, (val) => {
    const str = val ? formatLocalISO(val) : ""
    emit("update:end", str)
    if (!val) activeLabel.value = ""
})

/** 快捷按钮点击 */
const onShortcutClick = (item: DateShortcut) => {
    activeLabel.value = item.label
    const [start, end] = item.getRange()
    innerStartDate.value = start
    innerEndDate.value = end
    emit("change", formatLocalISO(start), formatLocalISO(end))
}

/** 外部清空时同步清除激活状态 */
watch(
    () => [start, end],
    ([s, e]) => {
        if (!s && !e) {
            activeLabel.value = ""
        }
    },
)
</script>

<style lang="scss" scoped>
.date-range-shortcuts {
    display: flex;
    flex-direction: column;
    gap: 10px;

    .date-shortcuts {
        display: flex;
        align-items: center;
        justify-content: space-around;
        border-bottom: 1px solid var(--el-border-color-lighter);

        .shortcut-item {
            flex: 1;
            text-align: center;
            padding: 4px 0 8px;
            font-size: 13px;
            color: var(--el-text-color-regular);
            cursor: pointer;
            position: relative;
            white-space: nowrap;
            transition: color 0.2s;

            &:hover {
                color: var(--el-color-primary);
            }

            &.active {
                color: var(--el-color-primary);
                font-weight: 500;

                &::after {
                    content: "";
                    position: absolute;
                    bottom: -1px;
                    left: 0;
                    right: 0;
                    height: 2px;
                    background-color: var(--el-color-primary);
                    border-radius: 1px;
                }
            }
        }
    }

    .date-pickers {
        display: flex;
        align-items: center;
        gap: 6px;
    }

    .filter-label {
        font-size: 13px;
        color: var(--el-text-color-secondary);
        white-space: nowrap;
    }
}
</style>
