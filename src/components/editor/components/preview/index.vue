<!--
 * FilePath    : blog-client\src\components\editor\components\preview\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 预览组件
-->

<template>
    <!-- web 预览 -->
    <div
        v-if="!isShowPreviewWechat"
        :ref="
            (el) => {
                if (el) setPreviewRef(el as HTMLElement)
            }
        "
        id="preview"
        @click="handleDelegateClick"
        @mouseenter="onMouseEnter"
        @mouseleave="onMouseLeave"
    >
        <template v-for="(item, index) in contentParts" :key="index">
            <div v-if="item.type === 'html'" v-html="item.content"></div>

            <div v-if="item.type === Names.VideoPlayer" :key="(item.content as PlayerState).videoID" class="video-player-box">
                <VideoPlayer :player-state="item.content as PlayerState" />
            </div>

            <PayKey
                v-else-if="item.type === Names.PayKey"
                :key="(item.content as PayKeyProps).productId"
                :product-id="(item.content as PayKeyProps).productId"
                :title="(item.content as PayKeyProps).title"
                :description="(item.content as PayKeyProps).description"
                :loading="createOrderLoadingAc"
                @pay-key="emitPayKey"
            />

            <PayMembership
                v-else-if="item.type === Names.PayMembership"
                :key="Names.PayMembership"
                :loading="createOrderLoadingAc"
                @pay-membership="emitPayMembership"
            />

            <PayContent
                v-else-if="isPayContentItem(item.type as Names)"
                :key="item.type"
                :post-id="postIdAc"
                :is-admin-video="isAdminVideoAc"
                :markdown="item.content as string"
                :content-pay-type="getPayContentType(item.type)"
                :loading="createOrderLoadingAc"
                :is-paid="isPaidAc"
                :price="priceAc"
                :video-toc="item.type === Names.PayVideo ? videoTocAc : void 0"
                @pay-vip="emitPayVip"
                @pay-single="emitPaySingle"
            />
        </template>
    </div>

    <!-- 微信 预览 -->
    <div
        v-if="isShowPreviewWechat"
        :ref="
            (el) => {
                if (el) setPreviewRef(el as HTMLElement)
            }
        "
        id="preview"
        v-html="wechatHtml"
        @click="handleDelegateClick"
        @mouseenter="onMouseEnter"
        @mouseleave="onMouseLeave"
    ></div>

    <!-- 参考:https://github.com/element-plus/element-plus/blob/dev/packages/components/image/src/image.vue -->
    <el-image-viewer v-if="isShowElImageViewer" @close="closeElImageViewer" :url-list="imgUrls" />
</template>

<script lang="ts" setup>
import "@/assets/scss/preview.scss"
import "@/assets/scss/highlight.js.jpz.scss"
import "katex/dist/katex.min.css" // katex 样式

import { useIntersectionObserver } from "@vueuse/core"
import { debounce } from "throttle-debounce"
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from "vue"

import { type MembershipRes } from "@/api/membership/common"
import { type Product as KeyRes } from "@/api/order/create"
import PayContent, { ContentPayType } from "@/components/common/pay-content"
import PayKey, { type PayKeyProps } from "@/components/common/pay-key"
import PayMembership from "@/components/common/pay-membership"
import { ScrollElementTagHeading } from "@/components/editor/command"
import VideoPlayer, { type PlayerState } from "@/components/player"
import { Names, parseHtmlToContentParts } from "@/customElements"
import { mountPayContentOnCustomElements } from "@/customElementsMount"
import { copyText } from "@/utils/clipboard"
import { shiftArray } from "@/utils/img"
import { MessageUtil } from "@/utils/message"
import { myScrollTo } from "@/utils/scrollTo"

import { CommandsKey } from "../../command"
import { copyWithCustomStyle, htmlHandleWeChat } from "../../utils"
import type { HeadingObject, PreviewProps } from "./types"

defineOptions({ name: "HtmlPreview" })

// 定义 props
const {
    html, // html 内容
    imgUrls, // 图片地址 list
    isShowElImageViewer, // 是否显示图片预览
    width, // 宽度
    height, // 高度
    isShowPreviewWechat, // 是否显示微信预览
    isUserScrollPreview, // 是否用户手动滚动预览
    viewCommand, // 预览命令
    headingShowCurrentIndex, // 当前展示的标题的索引
    isWatchMouse = false, // 是否监听鼠标进入元素

    scrollMethod = "scrollIntoView", // 滚动方法
    root, // 交叉观察器的根元素
    rootMargin = "", // 交叉观察器的根元素的边距
    threshold = 1, // 交叉观察器的阈值

    createOrderLoading = false, // 创建订单加载状态
    isPaid = false, // 是否付费阅读
    price = "0", // 价格(单位：分)
    postId = "", // 文章ID
    isAdminVideo = false, // 是否使用管理员视频接口
    videoToc = [], // 付费视频目录
} = defineProps<PreviewProps>()

// 定义 emits 子组件 传参
const emit = defineEmits<{
    (event: "show-image-viewer", imgUrls: string[], isShowElImageViewer: boolean): void
    (event: "close-image-viewer", isShowElImageViewer: boolean): void
    (event: "is-mouse-in-element", isMouseInElement: boolean): void
    (event: "is-mouse-in-element", isMouseInElement: boolean): void
    (event: "heading-show-current", headingIndex: number): void // 当前标题索引
    (event: "update-is-user-scroll", val: boolean): void // 更新是否用户手动滚动预览
    (event: "commit-heading-map", val: Map<string, HeadingObject>): void // 提交标题 map
    (event: "pay-vip", val: ContentPayType): void // vip 购买
    (event: "pay-single", val: ContentPayType): void // 立即购买
    (event: "pay-key", val: KeyRes): void // 账号密钥
    (event: "pay-membership", val: MembershipRes): void // 付费会员
}>()

const previewRef = ref<HTMLElement | null>(null)
const setPreviewRef = (el: HTMLElement | null) => {
    previewRef.value = el
}

// 分别为非微信预览(内容片段)和微信预览(html 字符串)提供独立的计算属性, 避免 string | ContentPart 的联合类型在模板中导致错误
const contentParts = computed(() => {
    return parseHtmlToContentParts(html, postId, isAdminVideo)
})

const wechatHtml = computed(() => {
    return htmlHandleWeChat(html)
})

// 判断是否为付费内容组件
const isPayContentItem = (type: Names) => [Names.PayRead, Names.PayDownload, Names.PayVideo].includes(type)

// 获取付费内容类型
const getPayContentType = (type: string): ContentPayType => {
    switch (type) {
        case Names.PayRead:
            return ContentPayType.Read
        case Names.PayDownload:
            return ContentPayType.Download
        case Names.PayVideo:
            return ContentPayType.Video
        default:
            return ContentPayType.Read
    }
}

// 鼠标进入
const onMouseEnter = () => {
    if (!isWatchMouse) return
    emit("is-mouse-in-element", true)
}

// 鼠标离开
const onMouseLeave = () => {
    if (!isWatchMouse) return
    emit("is-mouse-in-element", false)
}

// 初始化 css 变量 编辑器宽度和高度
const initializeCssVariable = () => {
    if (previewRef.value && width) {
        previewRef.value.style.setProperty("--my-preview-width", `${width}`)
    }
    if (previewRef.value && height) {
        previewRef.value.style.setProperty("--my-preview-height", `${height}`)
    }
}

// 监听 props isShowPreviewWechat 变化 添加自定义属性
watch(
    () => isShowPreviewWechat,
    async (newVal) => {
        if (newVal) {
            // 等待 DOM 更新
            await nextTick()
            if (previewRef.value) {
                previewRef.value.setAttribute("data-preview", "wechat")
                // // 验证属性是否设置成功
                // console.log("属性值:", previewRef.value.getAttribute("data-preview"))
            }
        } else {
            await nextTick()
            previewRef.value?.removeAttribute("data-preview")
        }
    },
    { flush: "post" }, // 确保在 DOM 更新后执行
)

// 防抖处理 copyWithCustomStyle
const debounceCopyWithCustomStyle = debounce(500, copyWithCustomStyle)

// 监听 viewCommand, 执行对应命令
watch(
    () => viewCommand,
    (newVal, oldVal) => {
        // 如果没有命令或者时间相同则不执行
        if (!newVal || !oldVal || !newVal.commandName || newVal.time === oldVal.time || newVal.commandName !== CommandsKey.Copy || !previewRef.value) {
            return
        }

        debounceCopyWithCustomStyle(previewRef.value)
    },
)

// 监听 props 宽高 变化
watch(
    () => [height, width],
    ([newHeight, newWidth]) => {
        if (previewRef.value && (newHeight || newWidth)) {
            initializeCssVariable() // 初始化 css 变量
        }
    },
)

// 点击事件委托 用于处理 pre 按钮和图片点击事件
const handleDelegateClick = async (event: MouseEvent) => {
    const target = event.target as HTMLElement

    if (previewRef.value) {
        if (target.tagName.toLowerCase() === "button" && target.classList.contains("copy-button")) {
            // pre 按钮
            const preElement = target.nextElementSibling as HTMLPreElement
            await handlePreCopy(preElement)
        } else if (target.tagName.toLowerCase() === "img" && "src" in target) {
            // img 图片
            const imgElement = target as HTMLImageElement
            updateImageViewer(imgElement)
        }
    }
}

// 复制代码
const handlePreCopy = async (preElement: HTMLPreElement) => {
    if (!preElement) return
    const textContent = preElement.textContent
    if (textContent) {
        // 复制文本到剪贴板
        await copyText(textContent.trim())
        MessageUtil.success("已复制到剪贴板！")
    } else {
        MessageUtil.error("复制失败，内容为空！")
    }
}

// 更新图片预览
const updateImageViewer = (imgElement: HTMLImageElement) => {
    if (imgElement.src) {
        emit("show-image-viewer", shiftArray(imgUrls, imgElement.src) || [], true)
        document.body.style.overflow = "hidden"
    }
}

// 关闭图片预览
const closeElImageViewer = () => {
    emit("close-image-viewer", false)
    document.body.style.overflow = "auto"
}

// 所有的 h 标签响应式变量
const allHeadings = ref<NodeListOf<HTMLHeadingElement> | null>(null)
const allHeadingMap: Map<string, HeadingObject> = new Map() // 所有的 h 标签 map

// 获取所有的 h 标签函数
const getAllHeadings = () => {
    if (previewRef.value) {
        const headings = previewRef.value.querySelectorAll(ScrollElementTagHeading) as NodeListOf<HTMLHeadingElement>
        allHeadings.value = headings
        allHeadingMap.clear() // 清空 map
        headings.forEach((heading, index) => {
            const obj: HeadingObject = {
                id: heading.id,
                index: index,
                element: heading as HTMLHeadingElement,
            }
            allHeadingMap.set(heading.id, obj)
        })

        // 触发提交标题 map 事件
        emit("commit-heading-map", allHeadingMap)
    }
}

// 跳转到对应的标题
const navigateToHeading = (index: number): void => {
    if (!allHeadings.value) return

    // 获取目标标题元素
    const target = allHeadings.value[index] as HTMLHeadingElement

    // 如果目标元素不存在或者是用户手动滚动预览，则不执行跳转
    if (!target || isUserScrollPreview) return

    // 使用不同的方法滚动到目标元素
    if (scrollMethod === "scrollIntoView") {
        myScrollTo(target, null, () => {
            emit("update-is-user-scroll", true)
        })
    } else {
        myScrollTo(target, previewRef.value, () => {
            emit("update-is-user-scroll", true)
        })
    }
}

// 标题跳转
watch(
    () => headingShowCurrentIndex,
    (newIndex) => {
        // 如果没有目录或者索引小于0则不执行
        if (newIndex === void 0 || newIndex < 0) return
        // 跳转目标标题
        navigateToHeading(newIndex)
    },
)

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

const stopFuncs: Array<() => void> = [] // 停止监听函数
const isIntersectingHeadings = ref<string[]>([]) // 交叉观察者的标题数组
const isBestMatchHeading = ref<string>("") // 最佳匹配的标题

// 历遍 allHeadings 观察每个标题的可见性
const observeHeadings = () => {
    allHeadings.value?.forEach((headingEl) => {
        // 使用 useIntersectionObserver 对单个 heading 进行监听
        const { stop } = useIntersectionObserver(
            headingEl,
            ([entry]) => {
                // 从 isIntersectingHeadings 中移除当前标题
                let isFromTopShow = false // 是否从上方出现
                if (entry!.isIntersecting) {
                    if (entry!.intersectionRect.top === 0) {
                        // console.log("============>从上出现")
                        isFromTopShow = true
                    } else {
                        isFromTopShow = false
                        // console.log("============>从下出现")
                    }
                    // 如果标题在视口内，设置当前标题索引
                    if (isFromTopShow) {
                        // 将元素插入到数组的开头
                        isIntersectingHeadings.value.unshift(entry!.target.id)
                    } else {
                        // 将元素插入到数组的末尾
                        isIntersectingHeadings.value.push(entry!.target.id)
                    }
                    isBestMatchHeading.value = isIntersectingHeadings.value[isIntersectingHeadings.value.length - 1]!
                } else {
                    // let isFromTopHidden = false // 是否从上方隐藏
                    // if (entry.intersectionRect.top > entry.boundingClientRect.bottom) {
                    //     console.log("============>从上隐藏")
                    //     isFromTopHidden = true
                    // }
                    // if (entry.intersectionRect.bottom < entry.boundingClientRect.top) {
                    //     isFromTopHidden = false
                    //     console.log("============>从下隐藏")
                    // }
                    if (isIntersectingHeadings.value.length === 1) {
                        isBestMatchHeading.value = isIntersectingHeadings.value[0]!
                        isIntersectingHeadings.value = isIntersectingHeadings.value.filter((id) => id !== entry!.target.id)
                    } else {
                        isIntersectingHeadings.value = isIntersectingHeadings.value.filter((id) => id !== entry!.target.id)
                        // 等于数组最后一个
                        isBestMatchHeading.value = isIntersectingHeadings.value[isIntersectingHeadings.value.length - 1]!
                        // isBestMatchHeading.value = isIntersectingHeadings.value[0]
                    }
                }

                if (isUserScrollPreview) {
                    const index = allHeadingMap.get(isBestMatchHeading.value)?.index || 0 // 获取当前标题的索引
                    emit("heading-show-current", index)
                }
            },
            {
                root, // 监听的根元素
                rootMargin, // 例如: 让在距顶部 88px 时视为未进入
                threshold, // 交叉比例阈值，表示多少比例的元素可见时触发回调
            },
        )
        stopFuncs.push(stop) // 将停止函数存储到数组中
    })
}

const emitPayVip = (val: ContentPayType) => {
    emit("pay-vip", val)
}

const emitPaySingle = (val: ContentPayType) => {
    emit("pay-single", val)
}

// 定义 payContent 组件的事件
const payContentEmits = {
    onPayVip: emitPayVip,
    onPaySingle: emitPaySingle,
}

// 定义 payKey 组件的事件
const emitPayKey = (val: KeyRes) => {
    emit("pay-key", val)
}

// 定义 payMembership 组件的事件
const emitPayMembership = (val: MembershipRes) => {
    emit("pay-membership", val)
}

const createOrderLoadingAc = computed(() => createOrderLoading) // 创建订单加载状态
const isAdminVideoAc = computed(() => isAdminVideo) // 是否使用管理员视频接口

// 是否付费阅读
const isPaidAc = computed(() => {
    if (isShowPreviewWechat) return true // 微信预览默认已付费
    return isPaid
})

// 价格(单位：分)
const priceAc = computed(() => {
    if (isShowPreviewWechat) return "0" // 微信预览默认价格为0
    return price
})

const postIdAc = computed(() => postId) // 文章ID
const videoTocAc = computed(() => videoToc) // 付费视频目录

// 监控 html 变化, 获取所有的 h 标签 并挂载自定义元素
watch(
    () => contentParts.value,
    (newHtml) => {
        if (newHtml) {
            // 注意：这里使用 nextTick，确保 html 已经渲染完成
            nextTick(() => {
                // 获取标题
                getAllHeadings()

                // 监听标题的可见性变化
                observeHeadings()
            })
        }
    },
)

// 监控 html 变化, 获取所有的 h 标签 并挂载自定义元素
watch(
    () => isShowPreviewWechat,
    (newVal) => {
        if (newVal) {
            // 注意：这里使用 nextTick，确保 html 已经渲染完成
            nextTick(() => {
                // 获取标题
                getAllHeadings()

                // 监听标题的可见性变化
                observeHeadings()

                // 挂载自定义元素

                // 付费下载
                mountPayContentOnCustomElements(
                    previewRef.value as HTMLElement,
                    Names.PayDownload,
                    ContentPayType.Download,
                    createOrderLoadingAc,
                    payContentEmits,
                    isPaidAc,
                    priceAc,
                    true, // 仅渲染 markdown 内容
                    isAdminVideoAc,
                )

                // 付费阅读
                mountPayContentOnCustomElements(
                    previewRef.value as HTMLElement,
                    Names.PayRead,
                    ContentPayType.Read,
                    createOrderLoadingAc,
                    payContentEmits,
                    isPaidAc,
                    priceAc,
                    true, // 仅渲染 markdown 内容
                    isAdminVideoAc,
                )

                // 付费视频
                mountPayContentOnCustomElements(
                    previewRef.value as HTMLElement,
                    Names.PayVideo,
                    ContentPayType.Video,
                    createOrderLoadingAc,
                    payContentEmits,
                    isPaidAc,
                    priceAc,
                    true, // 仅渲染 markdown 内容
                    isAdminVideoAc,
                    postIdAc,
                    videoTocAc,
                )
            })
        }
    },
)

// 初始化
onMounted(async () => {
    initializeCssVariable() // 初始化 css 变量

    await nextTick(() => {
        // 获取预览容器的 top 值
        getPreviewRefRect()
    })
})

onUnmounted(() => {
    // 停止所有的 IntersectionObserver 监听
    stopFuncs.forEach((stop) => {
        stop()
    })
})

// 导出
defineExpose({
    root: previewRef,
})
</script>

<style lang="scss">
@use "./style.module.scss";
</style>
