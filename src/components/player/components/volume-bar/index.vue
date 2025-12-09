<!--
 * FilePath    : blog-client-dev\src\components\player\components\volume-bar\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 音量条(竖向)
-->

<template>
    <div class="bar-container">
        <div
            ref="volumeBar"
            class="volume-bar"
            @mousedown="onVolumeBarClick"
            @mouseleave="onVolumeBarMouseleave"
            @mousemove="onVolumeBarMousemove"
            @touchstart.passive="onVolumeBarClick"
        >
            <!-- 当前音量(从底部向上填充) -->
            <div ref="currentVolumeRef" class="current-volume"></div>

            <!-- 滑块(竖向拖动) -->
            <div ref="slider" class="slider" @mousedown="onSliderDown" @touchstart.passive="onSliderDown"></div>

            <!-- 透明点击区域(扩大热区) -->
            <div ref="clickAreaRef" class="click-area"></div>
        </div>
        <!-- 鼠标滑动提示(显示音量值) -->
        <div ref="tooltip" class="tooltip"></div>
    </div>
</template>

<script lang="ts" setup>
import { onBeforeUnmount, useTemplateRef, watch } from "vue"

defineOptions({ name: "VideoVolumeBar" })

const { volume } = defineProps<{
    volume: number // 0-100
}>()

const emit = defineEmits<{
    (e: "update-volume", value: number): void
    (e: "is-dragging", status: boolean): void
}>()

// 定义所有元素的 ref
const volumeBarRef = useTemplateRef<HTMLDivElement | null>("volumeBar")
const currentVolumeRef = useTemplateRef<HTMLDivElement | null>("currentVolumeRef")
const tooltipRef = useTemplateRef<HTMLDivElement | null>("tooltip")
const sliderRef = useTemplateRef<HTMLDivElement | null>("slider")
const clickAreaRef = useTemplateRef<HTMLDivElement | null>("clickAreaRef")

// 设置 currentVolume 的高度, 可选是否启用 transition
const setCurrentVolumeHeight = (heightPercent: number, enableTransition = true) => {
    if (currentVolumeRef.value) {
        if (!enableTransition) {
            // 临时移除 transition, 避免拖拽时动画滞后
            currentVolumeRef.value.style.transition = "none"
        } else {
            // 恢复 transition
            currentVolumeRef.value.style.transition = "height 0.1s ease"
        }
        currentVolumeRef.value.style.height = `${heightPercent}%`
    }
}

// 根据 Y 坐标计算音量(0-100)
const getVolumeFromY = (offsetY: number, totalHeight: number) => {
    const ratio = 1 - offsetY / totalHeight // 顶部=100%, 底部=0%
    const vol = Math.round(ratio * 100)
    return Math.max(0, Math.min(100, vol)) // clamp to [0, 100]
}

// 标记是否正在拖拽
let isDragging = false

// 添加全局事件监听器
const addDocumentEventListeners = () => {
    document.addEventListener("mousemove", onSliderPointerMove)
    document.addEventListener("touchmove", onSliderPointerMove)
    document.addEventListener("mouseup", onSliderPointerUp)
    document.addEventListener("touchend", onSliderPointerUp)
}

// 移除全局事件监听器
const removeDocumentEventListeners = () => {
    document.removeEventListener("mousemove", onSliderPointerMove)
    document.removeEventListener("touchmove", onSliderPointerMove)
    document.removeEventListener("mouseup", onSliderPointerUp)
    document.removeEventListener("touchend", onSliderPointerUp)
}

// 获取音量条数据(Y 方向)
const getVolumeBarData = (event: MouseEvent | TouchEvent): { rect: DOMRect; offsetY: number; totalHeight: number; volume: number } | null => {
    if (volumeBarRef.value) {
        const rect = volumeBarRef.value.getBoundingClientRect()
        const clientY = getClientY(event)
        let offsetY = clientY - rect.top
        const totalHeight = rect.height
        offsetY = Math.max(0, Math.min(offsetY, totalHeight))
        const vol = getVolumeFromY(offsetY, totalHeight)
        return { rect, offsetY, totalHeight, volume: vol }
    }
    return null
}

// 获取 clientY(兼容触摸和鼠标)
const getClientY = (event: MouseEvent | TouchEvent) => {
    if (event.type.startsWith("touch")) {
        return (event as TouchEvent).touches[0]!.clientY
    } else {
        return (event as MouseEvent).clientY
    }
}

// 点击音量条
const onVolumeBarClick = (event: MouseEvent | TouchEvent) => {
    if (isDragging) return

    const data = getVolumeBarData(event)
    if (data) {
        const { offsetY, totalHeight, volume: newVol } = data
        // 点击非拖拽，启用 transition
        updateSliderAndVolume(offsetY, totalHeight, false)
        if (newVol !== volume) {
            emit("update-volume", newVol)
        }
    }
}

// 显示 tooltip
const showTooltip = (vol: number) => {
    if (tooltipRef.value) {
        tooltipRef.value.textContent = vol.toString()
        tooltipRef.value.style.display = "block"
    }
}

// 鼠标移动时显示 tooltip
const onVolumeBarMousemove = (event: MouseEvent) => {
    const data = getVolumeBarData(event)
    if (data && !isDragging) {
        showTooltip(data.volume)
    }
}

// 鼠标离开时隐藏 tooltip
const onVolumeBarMouseleave = () => {
    if (!isDragging && tooltipRef.value) {
        tooltipRef.value.style.display = "none"
    }
}

// 更新 滑块 top 表示音量位置（0%=顶部，100%=底部），CSS 用 translateY(-50%) 居中圆心
const updateSliderAndVolume = (offsetY: number, totalHeight: number, isDragging = false) => {
    if (sliderRef.value && currentVolumeRef.value) {
        // 填充条：从底部向上(高度 = 音量比例)
        const ratio = 1 - offsetY / totalHeight
        const heightPercent = ratio * 100
        // 根据是否拖拽决定是否禁用 transition
        setCurrentVolumeHeight(heightPercent, !isDragging)

        // 滑块 top = 音量位置百分比（offsetY / totalHeight * 100%）
        const positionPercent = (offsetY / totalHeight) * 100
        sliderRef.value.style.top = `${positionPercent}%`
    }
}

// 滑块按下
const onSliderDown = () => {
    isDragging = true
    emit("is-dragging", isDragging)
    addDocumentEventListeners()
}

// 滑块拖动
const onSliderPointerMove = (event: MouseEvent | TouchEvent) => {
    if (!isDragging) return
    const data = getVolumeBarData(event)
    if (data) {
        const { offsetY, totalHeight, volume: newVol } = data
        // 标记正在拖拽, 禁用 transition
        updateSliderAndVolume(offsetY, totalHeight, true)
        showTooltip(newVol)
    }
}

// 滑块释放
const onSliderPointerUp = () => {
    isDragging = false
    emit("is-dragging", isDragging)
    removeDocumentEventListeners()

    if (volumeBarRef.value && sliderRef.value) {
        const rect = volumeBarRef.value.getBoundingClientRect()
        const sliderRect = sliderRef.value.getBoundingClientRect()
        const centerY = sliderRect.top + sliderRect.height / 2
        const offsetY = Math.max(0, Math.min(centerY - rect.top, rect.height))
        const newVol = getVolumeFromY(offsetY, rect.height)

        // 松开时启用 transition
        updateSliderAndVolume(offsetY, rect.height, false)
        if (newVol !== volume) {
            emit("update-volume", newVol)
        }
    }

    if (tooltipRef.value) {
        tooltipRef.value.style.display = "none"
    }
}

// 监听外部 volume 变化, 同步 UI
watch(
    () => volume,
    (newVal) => {
        if (volumeBarRef.value && currentVolumeRef.value && sliderRef.value) {
            const clamped = Math.max(0, Math.min(100, newVal))
            const ratio = clamped / 100
            // 外部更新, 启用 transition
            setCurrentVolumeHeight(ratio * 100, true)
            // 滑块位置：音量100 → top=0%，音量0 → top=100%
            const positionPercent = (1 - ratio) * 100
            sliderRef.value.style.top = `${positionPercent}%`
        }
    },
    { immediate: true },
)

// 组件销毁时清理
onBeforeUnmount(() => {
    removeDocumentEventListeners()
})
</script>

<style lang="scss" scoped>
// 竖向尺寸
$bar-width: 6px;
$bar-height: 100px;
$slider-size: 16px;

.bar-container {
    position: relative;
    width: 50px;
    height: 150px;
    display: flex;
    align-items: center;
    justify-content: center;
    // 半透明背景色
    background-color: rgba(0, 0, 0, 0.1);
    border-radius: 4px;

    .tooltip {
        position: absolute;
        left: 50%;
        top: 10px;
        transform: translateX(-50%);
        background: rgba(0, 0, 0, 0.7);
        color: white;
        border-radius: 3px;
        font-size: 12px;
        padding: 5px;
        min-width: 20px;
        text-align: center;
        display: none;
        white-space: nowrap;
        z-index: 10;
    }

    .volume-bar {
        position: absolute;
        left: 50%;
        bottom: 10px;
        transform: translateX(-50%);
        width: $bar-width;
        height: $bar-height;
        background-color: #ccc;
        cursor: pointer;
        border-radius: 3px;
        // 0 在底部, 100 在顶部
        display: flex;
        flex-direction: column-reverse;

        .current-volume {
            width: 100%;
            background: var(--jpz-color-primary);
            border-radius: 3px;
            transition: height 0.1s ease;
        }

        .slider {
            position: absolute;
            left: 50%;
            top: 0;
            width: $slider-size;
            height: $slider-size;
            border-radius: 50%;
            z-index: 3;
            cursor: grab;

            background-color: #fff;
            // background-color: var(--jpz-color-primary);
            // 水平+垂直居中：让滑块圆心对齐 top 指定位置
            border: 2px solid var(--jpz-color-primary);
            transform: translateX(-50%) translateY(-50%);

            &:hover {
                border: 2px solid var(--jpz-color-primary);
                transform: translateX(-50%) translateY(-50%);
            }

            &:active {
                cursor: grabbing;
                border: 2px solid var(--jpz-color-primary);
                transform: translateX(-50%) translateY(-50%);
            }
        }

        .click-area {
            position: absolute;
            left: 50%;
            top: 0;
            transform: translateX(-50%);
            width: 26px; // 横向扩大点击区域
            height: 100%;
            background: transparent;
            z-index: 0;
        }
    }
}
</style>
