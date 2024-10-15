<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-09-15 15:11:14
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-10-15 09:51:37
 * @FilePath     : \blog-client\src\components\player\components\watermark\index.vue
 * @Description  : 水印
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->
<template>
  <div class="watermark-container" ref="containerRef">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { useMutationObserver } from '@vueuse/core'
import { ref, useTemplateRef, computed, onMounted, shallowRef, onBeforeUnmount } from 'vue'
import type { TextWatermark, LogoWatermark } from '@/stores/player'

defineOptions({ name: 'VideoWatermark' })

// 定义props
const props = defineProps<{
  textWatermark?: TextWatermark // 文字水印 可选
  logoWatermark?: LogoWatermark // logo 水印 可选
}>()

// 水印的 ref
const containerRef = useTemplateRef<HTMLElement | null>('containerRef')
const textWatermarkRef = shallowRef<HTMLSpanElement>()
const logoWatermarkRef = shallowRef<HTMLImageElement>()

//  定时器
let intervalId: ReturnType<typeof setInterval>

// 停止观察
const stopObservation = ref(false)

// 是否自动刷新水印
const isWatermarkAutoRefresh = ref(false)

// 检查是否是文字水印
const isShowTextWatermark = computed(() => props.textWatermark?.content)

// 检查是否是 logo 水印
const isShowLogoWatermark = computed(() => props.logoWatermark?.imgUrl)

// 获取文字水印内容
const textWatermarkContent = computed(() => props.textWatermark?.content || '')

// 获取 logo 水印 logo
const logoWatermarkLogoSrc = computed(() => props.logoWatermark?.imgUrl || '')

// 获取文字水印的 z-index
const textWatermarkZindex = computed(() => props.textWatermark?.style?.zIndex || '1998')

// 获取 logo 水印的 z-index
const logoWatermarkZindex = computed(() => props.logoWatermark?.style?.zIndex || '1999')

/**
 * @description: 设置水印的样式
 * @param watermark 水印元素
 * @param style 水印样式
 * @param isRandomPosition 是否随机生成水印位置
 */
const setWatermarkStyle = (
  watermark: HTMLElement | undefined,
  style: Partial<CSSStyleDeclaration>,
  isRandomPosition: boolean
) => {
  const container = containerRef.value

  if (container && watermark) {
    // 首先设置基础样式
    Object.assign(watermark.style, style)

    // 获取容器的宽高
    const { clientWidth: containerWidth, clientHeight: containerHeight } = container

    // 获取水印的宽高
    const { clientWidth: watermarkWidth, clientHeight: watermarkHeight } = watermark

    // width 和 height 为水印的可移动范围,即容器的宽高减去水印的宽高,保证水印不会超出容器
    const width = containerWidth - watermarkWidth
    const height = containerHeight - watermarkHeight

    // 如果 isRandomPosition 为 true,则随机生成水印的位置
    if (isRandomPosition) {
      style.left = `${Math.random() * width}px`
      style.top = `${Math.random() * height}px`
      // 再次设置样式主要是为了设置 left 和 top
      Object.assign(watermark.style, style)
    }
  }
}

// 销毁水印
const destroyWatermark = (watermark: HTMLElement | undefined) => {
  if (watermark) {
    watermark.remove()
    watermark = undefined
  }
}

// 增加文字水印
const appendTextWatermark = () => {
  if (isShowTextWatermark.value) {
    stopObservation.value = true // 停止观察
    const textWatermark = document.createElement('span') // 创建 span 元素
    textWatermark.style.position = 'absolute' // 设置绝对定位
    textWatermark.style.zIndex = textWatermarkZindex.value // 设置 z-index
    textWatermark.style.userSelect = 'none' // 禁止选中
    textWatermark.innerText = textWatermarkContent.value // 设置水印内容
    containerRef.value?.appendChild(textWatermark) // 添加到容器中
    textWatermarkRef.value = textWatermark // 设置水印 ref

    // 设置水印样式
    if (props.textWatermark?.style) {
      setWatermarkStyle(textWatermarkRef.value, props.textWatermark.style, true)
      intervalId = setInterval(() => {
        if (textWatermarkRef.value && props.textWatermark?.style) {
          // 设置自动刷新水印为 true
          isWatermarkAutoRefresh.value = true

          // 刷新水印
          setWatermarkStyle(textWatermarkRef.value, props.textWatermark.style, true)

          // 异步设置自动刷新水印为 false
          setTimeout(() => {
            isWatermarkAutoRefresh.value = false
          }, 0)
        }
      }, 5000)
    }

    // 异步设置停止观察为 false
    setTimeout(() => {
      stopObservation.value = false
    }, 0)
  }
}

// 增加 logo 水印
const appendLogoWatermark = () => {
  if (isShowLogoWatermark.value) {
    stopObservation.value = true // 停止观察
    const logoWatermark = document.createElement('img') // 创建 img 元素
    logoWatermark.style.position = 'absolute' // 设置绝对定位
    logoWatermark.style.zIndex = logoWatermarkZindex.value // 设置 z-index
    logoWatermark.style.userSelect = 'none' // 禁止选中
    logoWatermark.src = logoWatermarkLogoSrc.value // 设置图片地址
    containerRef.value?.appendChild(logoWatermark) // 添加到容器中
    logoWatermarkRef.value = logoWatermark // 设置水印 ref

    // 设置水印样式
    if (props.logoWatermark?.style) {
      setWatermarkStyle(logoWatermarkRef.value, props.logoWatermark.style, false)
    }

    // 异步设置停止观察为 false
    setTimeout(() => {
      stopObservation.value = false
    }, 0)
  }
}

// 是否重新渲染
const isReRendering = (mutation: MutationRecord, watermarkElement?: HTMLElement) => {
  let flag = false

  // 当水印被移除时，重新渲染水印
  if (mutation.removedNodes.length && watermarkElement) {
    flag = Array.from(mutation.removedNodes).includes(watermarkElement)
  }

  // 当 style 变化时，重新渲染水印, 排除自动刷新水印.
  if (
    mutation.type === 'attributes' &&
    mutation.target === watermarkElement &&
    !isWatermarkAutoRefresh.value
  ) {
    flag = true
  }

  return flag
}

// 重新渲染文字水印
const reRenderTextWatermark = () => {
  if (textWatermarkRef.value) {
    destroyWatermark(textWatermarkRef.value)
    appendTextWatermark()
  }
}

// 重新渲染 logo 水印
const reRenderLogoWatermark = () => {
  if (logoWatermarkRef.value) {
    destroyWatermark(logoWatermarkRef.value)
    appendLogoWatermark()
  }
}

// 当 DOM 变化时重新渲染水印
// 参考 https://developer.mozilla.org/zh-CN/docs/Web/API/MutationObserver
// https://github.com/element-plus/element-plus/blob/dev/packages/components/watermark/src/watermark.vue
const mutationCallback = (mutations: MutationRecord[]) => {
  if (stopObservation.value) {
    return
  }
  mutations.forEach((mutation) => {
    // 判断是否需要重新渲染水印
    if (isReRendering(mutation, textWatermarkRef.value)) reRenderTextWatermark()
    if (isReRendering(mutation, logoWatermarkRef.value)) reRenderLogoWatermark()
  })
}

// 监听 DOM 变化
useMutationObserver(containerRef, mutationCallback, {
  attributes: true, // 监听属性变化
  subtree: true, // 监听后代节点
  childList: true // 监听子节点的增加或删除
})

// 挂载时执行渲染水印
onMounted(() => {
  appendTextWatermark()
  appendLogoWatermark()
})

// 在组件卸载之前销毁水印 和 清除定时器
onBeforeUnmount(() => {
  destroyWatermark(textWatermarkRef.value)
  destroyWatermark(logoWatermarkRef.value)
  clearInterval(intervalId)
})
</script>

<style scoped lang="scss">
.watermark-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
