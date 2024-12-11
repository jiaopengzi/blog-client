<!--
 * @Author       : jiaopengzi
 * @Date         : 2023-12-12 13:01:07
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-10-23 18:43:57
 * @FilePath     : \blog-client\src\components\editor\preview\index.vue
 * @Description  : 预览组件
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved. 
-->
<template>
    <div
        ref="previewRef"
        id="preview"
        v-html="html"
        @click="handleDelegateClick"
        @mouseenter="onMouseEnter"
        @mouseleave="onMouseLeave"
    ></div>
    <!-- 参考:https://github.com/element-plus/element-plus/blob/dev/packages/components/image/src/image.vue -->
    <el-image-viewer
        v-if="preview.isShowElImageViewer"
        @close="closeElImageViewer"
        :url-list="preview.imgUrls"
    />
</template>

<script lang="ts" setup>
import { ref, onMounted, computed, watchEffect, useTemplateRef, nextTick } from "vue"
import { useScroll } from "@vueuse/core"
import { debounce } from "throttle-debounce"
import ClipboardJS from "clipboard" //代码块复制
import type { ClipboardEvent } from "clipboard"
import { ShowMsgTip } from "@/utils/message"
import { shiftArray } from "@/utils/img"
import { htmlHandleWeChat } from "../core"
import { ScrollElementTag, ScrollElementTagHeading } from "@/components/editor/command"
import { scrollToElement } from "@/utils/scroll"
import { mountVideoPlayerOnCustomElements } from "./utils"
import { CustomElementVideoPlayer } from "./customElements"
import type { PreviewProps } from "./index"
import "@/assets/scss/preview.scss"
import "@/assets/scss/highlight.js.jpz.scss"
import "katex/dist/katex.min.css" // katex 样式

defineOptions({ name: "HtmlPreview" })

// 定义 props
const props = defineProps<PreviewProps>()

// 定义 emits 子组件 传参
const emit = defineEmits<{
    (event: "show-image-viewer", imgUrls: string[], isShowElImageViewer: boolean): void
    (event: "close-image-viewer", isShowElImageViewer: boolean): void
    (event: "is-mouse-in-element", isMouseInElement: boolean): void
    (event: "is-mouse-in-element", isMouseInElement: boolean): void
    (event: "heading-show-current", headingIndex: number): void // 当前标题索引
}>()

// const previewRef = ref<HTMLElement | null>(null) // 预览容器
const previewRef = useTemplateRef<HTMLElement | null>("previewRef")

//
const html = computed(() => {
    if (props.isShowPreviewWechat) {
        // 微信公众号预览
        return htmlHandleWeChat(props.preview.html)
    } else {
        // 普通预览
        return props.preview.html
    }
})

// 鼠标是否在元素内
const isMouseInElement = ref(false) // 鼠标是否在元素内

// 鼠标进入
const onMouseEnter = () => {
    isMouseInElement.value = true
    emit("is-mouse-in-element", true)
}

// 鼠标离开
const onMouseLeave = () => {
    isMouseInElement.value = false
    emit("is-mouse-in-element", false)
}

// 初始化 css 变量 编辑器宽度和高度
const initializeCssVariable = () => {
    if (previewRef.value && props.width) {
        previewRef.value.style.setProperty("--my-preview-width", `${props.width}`)
    }
    if (previewRef.value && props.height) {
        previewRef.value.style.setProperty("--my-preview-height", `${props.height}`)
    }
}

// 监听 props isShowPreviewWechat 变化 添加自定义属性
watchEffect(() => {
    if (previewRef.value && props.isShowPreviewWechat) {
        previewRef.value.setAttribute("data-preview", "wechat")
    } else {
        previewRef.value?.removeAttribute("data-preview")
    }
})

// 监听 props 宽高 变化
watchEffect(() => {
    if (previewRef.value && (props.height || props.width)) {
        initializeCssVariable() // 初始化 css 变量
    }
})

// 点击事件委托 用于处理 pre 按钮和图片点击事件
const handleDelegateClick = (event: MouseEvent) => {
    const target = event.target as HTMLElement
    // const previewContainer = getParentWithClass(target, 'md-preview')

    if (previewRef.value) {
        if (target.tagName.toLowerCase() === "button") {
            // pre 按钮
            const preElement = target.nextElementSibling as HTMLElement
            handlePreClick(preElement)
        } else if (target.tagName.toLowerCase() === "img" && "src" in target) {
            // img 图片
            const imgElement = target as HTMLImageElement
            updateImageViewer(imgElement)
        }
    }
}

// pre 按钮 点击
const handlePreClick = (preElement: HTMLElement) => {
    if (preElement) {
        preElement.click()
    }
}

// 更新图片预览
const updateImageViewer = (imgElement: HTMLImageElement) => {
    if (imgElement.src) {
        emit("show-image-viewer", shiftArray(props.preview.imgUrls, imgElement.src) || [], true)
        document.body.style.overflow = "hidden"
    }
}

// 关闭图片预览
const closeElImageViewer = () => {
    emit("close-image-viewer", false)
    document.body.style.overflow = "auto"
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
const navigateToElement = (index: number, callback?: () => void): void => {
    // console.log('navigateToElement=====>>>>', index)
    scrollToElement(previewRef.value, index, ScrollElementTag, "smooth", callback)
}

/**
 * @description: 暴露给父组件的方法,跳转到顶部
 * @param behavior 滚动行为
 * @return
 */
const navigateGoHome = (behavior: ScrollBehavior = "smooth"): void => {
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
const navigateGoEnd = (behavior: ScrollBehavior = "smooth"): void => {
    previewRef.value?.scrollTo({
        top: previewRef.value.scrollHeight - previewRef.value.clientHeight,
        behavior: behavior,
    })
}

// 初始化 ClipboardJS 的复制代码函数
const initializeClipboard = () => {
    const clipboard = new ClipboardJS(".copy-button", {
        text: (trigger: Element) => {
            // 获取对应 pre 元素的文本内容
            const preElement = trigger.nextElementSibling

            // 添加条件检查，确保 preElement 和 preElement.textContent 不为 null
            if (preElement && preElement.textContent !== null) {
                return preElement.textContent.trim()
            } else {
                return ""
            }
        },
    })

    clipboard.on("success", (e: ClipboardEvent) => {
        // 处理成功的反馈（例如显示提示信息）
        ShowMsgTip(ShowMsgTip.MsgType.success, "已复制到剪贴板！")
        // console.log('已复制到剪贴板！')
        // console.info('Action:', e.action)
        // console.info('Text:', e.text)
        // console.info('Trigger:', e.trigger)
        e.clearSelection()
    })

    clipboard.on("error", (e: ClipboardEvent) => {
        // 处理错误的反馈
        ShowMsgTip(ShowMsgTip.MsgType.error, "复制到剪贴板失败！")
        console.error("复制到剪贴板失败:", e)
        // console.error('Action:', e.action)
        // console.error('Trigger:', e.trigger)
    })
}

// 所有的 h 标签响应式变量
const allHeadings = ref<NodeListOf<HTMLHeadingElement> | null>(null)

// 获取所有的 h 标签函数
const getAllHeadings = (): NodeListOf<HTMLHeadingElement> | null => {
    return previewRef.value?.querySelectorAll(ScrollElementTagHeading) || null
}

// 预览容器的 top clientHeight scrollHeight
const previewRefRectTop = ref(0)
const previewRefClientHeight = ref(0)
const previewRefScrollHeight = ref(0)

// 获取预览容器的 top clientHeight scrollHeight
const getPreviewRefRect = () => {
    if (previewRef.value) {
        previewRefRectTop.value = previewRef.value.getBoundingClientRect().top
        previewRefClientHeight.value = previewRef.value.clientHeight
        previewRefScrollHeight.value = previewRef.value.scrollHeight
    }
}

// 处理滚动事件，节流
const handleScroll = debounce(200, () => {
    if (!allHeadings.value) return

    // 历遍所有的 h 标签 判断是否在设定的区域内
    for (let i = 0; i < allHeadings.value.length; i++) {
        const rect = allHeadings.value[i].getBoundingClientRect() // 获取标题的矩形区域
        const { top } = rect // 标题的 top 值

        // 当前标题在可视区域内
        if (
            top >= previewRefRectTop.value && // 标题在 preview 顶部以下
            top <= previewRefRectTop.value + (previewRefClientHeight.value / 3) * 2 // 标题在 preview 可视区域 2/3 上方
        ) {
            emit("heading-show-current", i)
            break
        }

        // 当前标题在 preview 可视区域上方,下一个标题不在 preview 可视区域内
        else if (
            top < previewRefRectTop.value &&
            allHeadings.value[i + 1] &&
            allHeadings.value[i + 1].getBoundingClientRect().top > previewRefClientHeight.value
        ) {
            emit("heading-show-current", i)
            break
        }
    }
})

// 监听滚动事件
const { y, isScrolling } = useScroll(previewRef)

watchEffect(() => {
    if (isMouseInElement.value && isScrolling.value) {
        // 当鼠标在 preview 元素内并且正在滚动时
        handleScroll()
    }
})

watchEffect(() => {
    if (y.value === 0 && isMouseInElement.value) {
        // 滚动到顶部 且 鼠标在元素内,高亮第一个标题
        emit("heading-show-current", 0)
    }
})

// 监控 html 变化,获取所有的 h 标签 并挂载视频播放器
watchEffect(() => {
    if (html.value) {
        // 注意：这里使用 nextTick，确保 html 已经渲染完成
        nextTick(() => {
            allHeadings.value = getAllHeadings()

            // 挂载视频播放器到自定义元素 CustomElementVideoPlayer
            mountVideoPlayerOnCustomElements(
                previewRef.value as HTMLElement,
                CustomElementVideoPlayer,
            )
        })
    }
})

// 初始化
onMounted(() => {
    initializeCssVariable() // 初始化 css 变量
    initializeClipboard() // 初始化剪切板

    nextTick(() => {
        // 获取预览容器的 top 值
        getPreviewRefRect()
    })
})

// 导出方法
defineExpose({
    root: previewRef,
    navigateToHeading,
    navigateToElement,
    navigateGoHome,
    navigateGoEnd,
})
</script>

<style scoped lang="scss">
#preview {
    overflow: auto;
    padding: 0 20px;
    box-sizing: border-box;
    font-size: 16px;
    line-height: 1.5;
    color: var(--jpz-color-primary);
    background-color: var(--jpz-bg-color);
    height: var(--my-codemirror-height, 100%);
}

@include respond-to("pc") {
    #preview {
        max-width: pc.$width-page-main;
        width: 100%;
    }

    #preview[data-preview="wechat"] {
        width: 390px;
    }
}

@include respond-to("pad") {
    #preview {
        max-width: 100%;
    }

    #preview[data-preview="wechat"] {
        max-width: 390px;
        width: 100%;
    }
}

@include respond-to("phone") {
    #preview {
        max-width: 100%;
    }

    #preview[data-preview="wechat"] {
        max-width: 390px;
        width: 100%;
    }
}
</style>
