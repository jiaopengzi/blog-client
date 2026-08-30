<!--
 * FilePath    : blog-client-nuxt\src\components\player\components\setting\radio-group\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 单选组
-->

<template>
    <div class="radio-group">
        <h3 id="radio-group-title" v-if="title" class="title">{{ title }}</h3>
        <div class="btn-group" role="radiogroup" :aria-label="title">
            <button
                v-for="(opt, idx) in options"
                :ref="
                    (el) => {
                        if (el) btnRefs[idx] = el as HTMLButtonElement
                    }
                "
                :key="String(opt.value)"
                class="btn"
                :class="{ selected: idx === selectedIndex }"
                role="radio"
                type="button"
                :aria-checked="idx === selectedIndex"
                :tabindex="idx === selectedIndex ? 0 : -1"
                @click="select(opt)"
                @keydown="onKeydown($event, idx)"
            >
                {{ opt.label }}
            </button>
        </div>
    </div>
</template>

<script setup lang="ts" generic="T">
import { reactive, ref, watch } from "vue"

import type { RadioGroupProps, RadioOption } from "./types"

defineOptions({ name: "RadioGroup" })

const { title = "", options, modelValue } = defineProps<RadioGroupProps<T>>()

const emit = defineEmits<{
    (event: "update:modelValue", value: T): void
    (event: "change", value: T): void
}>()

const selectedIndex = ref(0)

// 用于存放按钮 DOM 引用, 便于键盘聚焦
const btnRefs = reactive<HTMLButtonElement[]>([])

// 监听 modelValue 变化, 更新选中索引
watch(
    () => modelValue,
    (newVal) => {
        const idx = options.findIndex((o) => o.value === newVal)
        if (idx !== -1) {
            selectedIndex.value = idx
        }
    },

    // 立即执行一次, 初始化选中状态
    { immediate: true },
)

const select = (opt: RadioOption<T> | undefined) => {
    if (!opt) return
    emit("update:modelValue", opt.value)
    emit("change", opt.value)

    // 找到对应的索引并设置焦点
    const idx = options.findIndex((o) => o.value === opt.value)
    const el = btnRefs[idx]
    if (el) el.focus()
}

const onKeydown = (e: KeyboardEvent, idx: number) => {
    const key = e.key
    if (key === "ArrowRight" || key === "ArrowDown") {
        e.preventDefault()
        const next = (idx + 1) % options.length
        select(options[next])
    } else if (key === "ArrowLeft" || key === "ArrowUp") {
        e.preventDefault()
        const prev = (idx - 1 + options.length) % options.length
        select(options[prev])
    } else if (key === " " || key === "Enter") {
        e.preventDefault()
        select(options[idx])
    }
}
</script>

<style scoped lang="scss">
.radio-group {
    padding: 8px;
    margin-bottom: 12px;
    border-bottom: 1px solid #ffffff33;

    #radio-group-title {
        font-size: 14px;
        // 显式归零 margin, 避免全局 #preview h3 注入上边距导致标题上方多余留白
        margin: 0 0 8px;
        // 标题使用纯白 + 更大字号, 与浅灰内容形成层级对比, 更显著
        color: #ffffff;
        font-weight: 700;
        letter-spacing: 0.5px;
    }

    .btn-group {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
    }

    .btn {
        min-width: 40px;
        appearance: none;
        -webkit-appearance: none;
        padding: 4px 6px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 12px;
        font-weight: 500;
        line-height: 1;
        transition:
            background-color 0.12s ease,
            box-shadow 0.12s ease;

        border: none;
        background: #ffffff26;
        color: #ffffff;

        &.selected {
            background: var(--jpz-color-primary);
            color: #ffffff;
        }
    }
}
</style>
