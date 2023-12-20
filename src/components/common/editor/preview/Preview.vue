<!-- eslint-disable vue/multi-word-component-names -->
<!--
 * @Author       : jiaopengzi
 * @Date         : 2023-12-12 13:01:07
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-12-19 17:49:37
 * @FilePath     : \blog-client\src\components\common\editor\preview\Preview.vue
 * @Description  : 预览组件
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved. 
-->
<template>
    <div ref="previewRef" id="preview" v-html="html" @click="handleDelegateClick"></div>
    <!-- 参考:https://github.com/element-plus/element-plus/blob/dev/packages/components/image/src/image.vue -->
    <el-image-viewer v-if="preview.isShowElImageViewer" @close="closeElImageViewer" :url-list="preview.imgUrls" />
</template>

<script lang="ts" setup>
import { ref, onMounted, computed, watchEffect } from 'vue'
import { initializeClipboard } from '@/components/common/editor/preview'
import { shiftArray } from '@/utils/img'
import { ScrollElementTag, ScrollElementTagHeading } from '@/components/common/editor/command/constant'
import { scrollToElement } from '@/utils/scroll'
import type { PriviewProps } from '@/components/common/editor/preview'
import '@/assets/scss/preview.scss'
import '@/assets/highlight/highlight.js.jpz.scss'

// 定义 props 
const props = defineProps<PriviewProps>();

// 定义 emits 子组件 传参
const emit = defineEmits<{
    (event: 'show-image-viewer', imgUrls: string[], isShowElImageViewer: boolean): void
    (event: 'close-image-viewer', isShowElImageViewer: boolean): void
}>()

const previewRef = ref<HTMLElement | null>(null) // 预览容器
// html 内容 清洗
const html = computed(() => {
    return props.preview.html.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n') // 去除 BOM 头 和 windows 换行符
});

const initializeCssVariable = () => {
    // 初始化编辑器宽度和高度
    if (previewRef.value && props.width) {
        previewRef.value.style.setProperty('--my-preview-width', `${props.width}`);
    }
    if (previewRef.value && props.height) {
        previewRef.value.style.setProperty('--my-preview-height', `${props.height}`);
    }
}

// 监听 props 宽高 变化
watchEffect(() => {
    if (previewRef.value && (props.height || props.width)) {
        initializeCssVariable() // 初始化 css 变量
    }
})

// 事件委托
const handleDelegateClick = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    // const previewContainer = getParentWithClass(target, 'md-preview')

    if (previewRef.value) {
        if (target.tagName.toLowerCase() === 'button') {
            // pre 按钮
            const preElement = target.nextElementSibling as HTMLElement;
            handlePreClick(preElement);
        } else if (target.tagName.toLowerCase() === 'img' && 'src' in target) {
            // img 图片
            const imgElement = target as HTMLImageElement;
            updateImageViewer(imgElement)
        }
    }
}

// pre 按钮 点击
const handlePreClick = (preElement: HTMLElement) => {
    if (preElement) {
        preElement.click();
    }
}

// 更新图片预览
const updateImageViewer = (imgElement: HTMLImageElement) => {
    if (imgElement.src) {
        emit('show-image-viewer', shiftArray(props.preview.imgUrls, imgElement.src) || [], true)
        document.body.style.overflow = 'hidden'
    }
}

// 关闭图片预览
const closeElImageViewer = () => {
    emit('close-image-viewer', false)
    document.body.style.overflow = 'auto'
}

/**
 * @description: 暴露给父组件的方法，用于点击目录时候跳转到对应的标题
 * @param index 目录索引
 * @return 
 */
const navigateToHeading = (index: number): void => {
    scrollToElement(previewRef.value, index, ScrollElementTagHeading)
}

/**
 * @description: 暴露给父组件的方法,跳转到对应的元素
 * @param index 目录索引
 * @return 
 */
const navigateToElement = (index: number): void => {
    scrollToElement(previewRef.value, index, ScrollElementTag)
}

/**
 * @description: 暴露给父组件的方法,跳转到顶部
 * @param behavior 滚动行为
 * @return 
 */
const navigateGoHome = (behavior: ScrollBehavior = 'smooth'): void => {
    previewRef.value?.scrollTo({
        top: 0,
        behavior: behavior,
    })
}

/**
 * @description: 暴露给父组件的方法,跳转到底部
 * @param behavior 滚动行为
 * @return 
 */
const navigateGoEnd = (behavior: ScrollBehavior = 'smooth'): void => {
    previewRef.value?.scrollTo({
        top: previewRef.value.scrollHeight - previewRef.value.clientHeight,
        behavior: behavior,
    })
}

// 导出方法
defineExpose({
    navigateToHeading,
    navigateToElement,
    navigateGoHome,
    navigateGoEnd,
})

// 初始化
onMounted(() => {
    initializeCssVariable() // 初始化 css 变量
    initializeClipboard() // 初始化剪切板
})
</script>

<style lang="scss">
#preview {
    overflow: auto;
    padding: 0 20px;
    box-sizing: border-box;
    font-size: 16px;
    line-height: 1.5;
    color: $primary-color;
    background-color: $background-color-content;
}

@include respond-to('pc') {
    #preview {
        max-width: pc.$width-page-main;
        width: 100%;
        height: var(--my-codemirror-height, 100%);
    }
}

@include respond-to('phone') {
    #preview {
        max-width: 100%;
    }
}
</style>
@/components/common/editor/index/editor@/components/common/editor/index/editor