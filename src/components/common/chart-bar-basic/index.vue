<!--
 * FilePath    : blog-client\src\components\common\chart-bar-basic\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 柱状图-基础版
-->
<template>
    <div class="chart-container" ref="chartContainer">
        <h1>{{ title }}</h1>

        <div class="chart" v-if="hasData">
            <!-- Y轴刻度 -->
            <div class="y-axis">
                <span class="y-axis-item" v-for="(tick, index) in yTicks" :key="'y-tick-' + index">{{ unitNumber(tick, 0) }}</span>
            </div>

            <!-- 柱状图数据 -->
            <div class="bars" ref="bars">
                <div
                    v-for="(item, index) in localData"
                    :ref="
                        (el) => {
                            if (el) barRefs[index] = el as HTMLDivElement
                        }
                    "
                    :key="'bar-' + item.label"
                    class="bar"
                    :style="{
                        height: `${(item.value / maxValue) * 100}%`,
                        backgroundColor: item.color || color || defaultColors[index % defaultColors.length],
                    }"
                    @click="handleBarClick(item)"
                >
                    <div class="bar-value">{{ unitNumber(item.value, 1) }}</div>
                    <div class="bar-label">{{ item.label }}</div>
                </div>
            </div>
        </div>
        <div v-if="!hasData" class="no-data">no data</div>
    </div>
</template>

<script lang="ts" setup>
import { computed, nextTick, onMounted, reactive, ref, useTemplateRef, watch } from "vue"

import { unitNumber } from "@/utils/unit"

import type { BarItem, ChartBarBasicProps } from "./types"

defineOptions({ name: "ChartBarBasic" })

// 定义 props
const {
    title = "柱状图",
    data = [
        { label: "1月", value: 80 },
        { label: "2月", value: 65 },
        { label: "3月", value: 90 },
        { label: "4月", value: 45 },
        { label: "5月", value: 70 },
        { label: "6月", value: 55 },
        { label: "7月", value: 85 },
        { label: "8月", value: 80 },
        { label: "9月", value: 90 },
        { label: "10月", value: 99 },
        { label: "11月", value: 100 },
        { label: "12月", value: 75 },
    ],
    width = 600,
    height = 400,
    color = "",
} = defineProps<ChartBarBasicProps>()

// 事件
const emit = defineEmits<{
    (event: "bar-click", item: BarItem): void
}>()

// 默认颜色
const defaultColors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD", "#FFB347"]

// 柱状图数据
const localData = ref<BarItem[]>([...data])
const hasData = computed(() => {
    // 如果每个数据的 value 都为 0, 则认为无数据
    return localData.value.some((item) => item.value > 0)
})

// 元素引用
const chartContainer = useTemplateRef<HTMLDivElement>("chartContainer")
const bars = useTemplateRef<HTMLDivElement>("bars")
const barRefs = reactive<{ [key: number]: HTMLDivElement | undefined }>({})

/**
 * 根据数字的位数, 向上取整到最近的 整十 / 整百 / 整千 ...
 */
function roundUpByDigitCount(num: number): number {
    const numStr = Math.abs(num).toString() // 支持负数, 取绝对值计算位数
    const digitCount = numStr.length // 计算位数

    // 特殊情况：如果 num 是 0，直接返回 0
    if (num === 0) return 0

    // 计算单位：10^digitCount
    const unit = Math.pow(10, digitCount)

    // 如果 digitCount 大于 1, 则将 num 从左到右取出两位
    if (digitCount > 1) {
        const firstTwoDigits = parseInt(numStr.slice(0, 2))
        const roundedFirstTwoDigits = Math.ceil(firstTwoDigits / 10) * 10
        const roundedNumStr = roundedFirstTwoDigits.toString() + "0".repeat(digitCount - 2)
        return parseInt(roundedNumStr)
    }

    // 向上取整到该单位
    return Math.ceil(num / unit) * unit
}

// 计算最大值
const maxValue = computed(() => {
    // 默认最小值10, 防止全部数据为 0 时无法显示
    const maxVal = Math.max(...localData.value.map((item) => item.value))

    // 向上取整最近的 整十 / 整百 / 整千 ...
    return roundUpByDigitCount(maxVal)
})

// 计算Y轴刻度
const yTicks = computed(() => {
    const ticks = []
    const maxTicks = 5
    const step = Math.ceil(maxValue.value / maxTicks)
    for (let i = 0; i <= maxTicks; i += 1) {
        ticks.push(i * step)
    }
    return ticks
})

// 动画效果
const animateBars = () => {
    if (!bars.value || !barRefs) return

    // 遍历每个柱子, 设置初始高度为 0, 然后逐个设置为目标高度, 形成动画效果
    Object.keys(barRefs).forEach((key) => {
        const index = Number(key)
        const bar = barRefs[index]
        if (!bar) return

        // 设置初始高度为0
        bar.style.height = "0%"

        // 延时设置目标高度, 形成动画效果
        if (localData.value && localData.value[index]) {
            // 立即获取值, 避免在 setTimeout 回调中引用可能为 undefined 的值
            const value = localData.value[index].value ?? 0
            const percent = maxValue.value ? (value / maxValue.value) * 100 : 0

            setTimeout(() => {
                bar.style.transition = "height 1s ease-out"
                bar.style.height = `${percent}%`
            }, index * 20)
        }
    })
}

// 处理柱子点击事件
const handleBarClick = (item: BarItem) => {
    emit("bar-click", item)
}

// 设置图表容器的宽高 CSS 变量
const setChartContainerCssVars = (width: number, height: number) => {
    if (chartContainer.value) {
        // 在 chartContainer 上设置高度和宽度的 css 变量
        chartContainer.value.style.setProperty("--bars-width", `${width}px`)
        chartContainer.value.style.setProperty("--bars-height", `${height}px`)
    }
}

// 计算并设置 CSS 变量
const calcCssVars = () => {
    // 设置默认宽高
    setChartContainerCssVars(width, height)

    if (!chartContainer.value || !bars.value) {
        return
    }

    let widthLocal = width
    const initBarWidth = 20 // 柱子初始宽度
    const barMargin = 20 // 柱子间距

    // 判断 with 是否足够显示所有柱子, 如果不够, 则根据柱子数量动态计算宽度
    if (hasData.value && width < localData.value.length * (initBarWidth + barMargin)) {
        widthLocal = localData.value.length * (initBarWidth + barMargin)
    }

    bars.value.style.width = `${widthLocal}px`
    bars.value.style.height = `${height}px`

    // 在 chartContainer 上设置高度和宽度的 css 变量
    setChartContainerCssVars(widthLocal, height)

    // 在 bars 上设置 bar 的宽度的 css 变量
    const barWidth = Math.max(initBarWidth, (width - localData.value.length * barMargin) / localData.value.length - barMargin)
    bars.value.style.setProperty("--bar-width", `${barWidth}px`)
}

// 绘制图表
const draw = async () => {
    await nextTick()
    calcCssVars()
    animateBars()
}

// 监听 data 变化
watch(
    () => data,
    async (newData) => {
        localData.value = [...newData]
        await draw()
    },
    { deep: true },
)

onMounted(async () => {
    await draw()
})
</script>

<style lang="scss" scoped>
.chart-container {
    background-color: var(--jpz-bg-color);
    padding: 20px 40px 30px 20px;
    border-radius: 8px;
    box-shadow: 0 2px 10px #0000001a;
    width: var(--bars-width);
}

h1 {
    text-align: center;
    font-family: "JBMonoWOFF2", "Microsoft YaHei", sans-serif;
    color: var(--jpz-text-color-primary);
    margin-bottom: 20px;
    font-size: 20px;
    font-weight: 700;
}

.chart {
    height: var(--bars-height);
    display: flex;
    width: 100%;
}

.y-axis {
    height: 100%;
    display: flex;
    flex-direction: column-reverse;
    justify-content: space-between;
    margin-right: 4px;

    .y-axis-item {
        // 文字右对齐
        text-align: right;
        width: 100%;
        font-size: 12px;
        color: var(--jpz-text-color-primary);
    }
}

.bars {
    display: flex;
    align-items: flex-end;
    justify-content: space-around;
    height: var(--bars-height);
    border-left: 2px solid var(--jpz-text-color-primary);
    border-bottom: 2px solid var(--jpz-text-color-primary);
    padding: 0 20px 0 20px;
    box-sizing: border-box;
    width: 100%;
}

.bar {
    width: var(--bar-width);
    margin: 0 10px;
    border-radius: 4px 4px 0 0;
    position: relative;
    transition: all 0.3s ease;
    cursor: pointer;
    box-shadow: 0 2px 5px #00000033;
}

.bar:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px #0000004d;
    opacity: 0.9;
}

.bar-value {
    position: absolute;
    top: -25px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 12px;
    font-weight: bold;
    color: var(--jpz-text-color-primary);
    padding: 2px 6px;
    border-radius: 3px;
    box-shadow: 0 1px 3px #00000033;
    opacity: 0;
    transition: opacity 0.3s ease;
    width: max-content;
}

.bar:hover .bar-value {
    opacity: 1;
}

.bar-label {
    position: absolute;
    bottom: -20px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 12px;
    color: var(--jpz-text-color-secondary);
    white-space: nowrap;
}

.no-data {
    text-align: center;
    font-size: 24px;
    color: var(--jpz-text-color-secondary);
    height: var(--bars-height);
    line-height: var(--bars-height);
}
</style>
