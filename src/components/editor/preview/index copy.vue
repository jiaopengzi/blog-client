<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-10-21 18:49:10
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-10-21 18:49:10
 * @FilePath     : \blog-client\src\components\editor\preview\index copy.vue
 * @Description  : 
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->
<!--
 * @Author       : jiaopengzi
 * @Date         : 2023-12-12 13:01:07
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-10-21 18:31:52
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
import { ref, onMounted, computed, watchEffect, useTemplateRef, createApp, h } from "vue"
import { useScroll } from "@vueuse/core"
import { debounce } from "throttle-debounce"
import ClipboardJS from "clipboard" //代码块复制
import type { ClipboardEvent } from "clipboard"
import { ShowMsgTip } from "@/utils/message"
import { shiftArray } from "@/utils/img"
import { htmlHandleUtf8, htmlHandleWeChat } from "@/utils/preview"
import { ScrollElementTag, ScrollElementTagHeading } from "@/components/editor/command"
import { scrollToElement } from "@/utils/scroll"
import type { PreviewProps } from "@/components/editor/preview"
import "@/assets/scss/preview.scss"
import "@/assets/scss/highlight.js.jpz.scss"
import "katex/dist/katex.min.css" // katex 样式
import VideoPlayer from "@/components/player"
import Icon from "@/components/common/icons" // 引用自定义的全局图标

defineOptions({ name: "HtmlPreview" })

// 定义 props
const props = defineProps<PreviewProps>()

// 定义 emits 子组件 传参
const emit = defineEmits<{
    (event: "show-image-viewer", imgUrls: string[], isShowElImageViewer: boolean): void
    (event: "close-image-viewer", isShowElImageViewer: boolean): void
    (event: "is-mouse-in-element", isMouseInElement: boolean): void
}>()

// const previewRef = ref<HTMLElement | null>(null) // 预览容器
const previewRef = useTemplateRef<HTMLElement | null>("previewRef")

// html 内容 清洗
const html = computed(() => {
    const html = htmlHandleUtf8(props.preview.html)

    if (props.isShowPreviewWechat) {
        // 微信公众号预览
        return htmlHandleWeChat(html)
    } else {
        // 普通预览
        return html
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

const initializeCssVariable = () => {
    // 初始化编辑器宽度和高度
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

// 事件委托
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

const allHeadings = ref<NodeListOf<HTMLHeadingElement> | null>(null)

const getAllHeadings = (): NodeListOf<HTMLHeadingElement> | null => {
    return previewRef.value?.querySelectorAll("h1, h2, h3, h4, h5, h6") || null
}

const handleScroll = debounce(100, () => {
    if (!allHeadings.value) return
    console.log("heading222222", allHeadings.value)
    for (let i = 0; i < allHeadings.value.length; i++) {
        const heading = allHeadings.value[i] as HTMLElement
        const rect = heading.getBoundingClientRect()
        console.log("heading", heading)
        if (rect.top >= 0 && rect.top <= 100) {
            console.log("heading", heading)
            break
        }
    }
})

// 监听滚动事件
const { isScrolling } = useScroll(previewRef)

watchEffect(() => {
    if (isMouseInElement.value && isScrolling.value) {
        console.log("heading11111111")
        handleScroll()
    }
})

// 监控 html 变化,重新获取所有的 h 标签
watchEffect(() => {
    if (html.value) {
        console.log("heading33333")
        allHeadings.value = getAllHeadings()
        console.log("allHeadings", allHeadings.value)
    }
})

// 初始化
onMounted(() => {
    initializeCssVariable() // 初始化 css 变量
    initializeClipboard() // 初始化剪切板
    allHeadings.value = getAllHeadings() // 初始化所有的 h 标签
    console.log("allHeadings", allHeadings.value)

    // // 挂载新的 Vue 实例
    // const app = createApp({
    //     render() {
    //         return h("Icon", { type: "icon-arrow-up", name: "save" })
    //     },
    // })

    // app.mount("#preview")
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
    color: $primary-color;
    background-color: $background-color-content;
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
