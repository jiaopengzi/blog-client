<!--
 * FilePath    : blog-client-nuxt\src\components\common\poster-share\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 海报分享组件 (视觉: 极简编辑风)
-->

<template>
    <div class="poster-wrapper">
        <div class="poster-container" id="poster-container">
            <!-- 海报主图, 无图时隐藏 -->
            <div v-if="dataAc.imgSrc" class="main-img">
                <img :src="dataAc.imgSrc" crossorigin="anonymous" />
            </div>
            <!-- 内容信息区 -->
            <div class="poster-content" :class="{ 'no-img': !dataAc.imgSrc }">
                <!-- 品牌色短尺, 纯装饰的视觉锚点 -->
                <span class="accent-line" aria-hidden="true"></span>
                <h1 class="title">{{ dataAc.titleText }}</h1>
            </div>
            <!-- 底部二维码与链接区 -->
            <div class="poster-footer">
                <!-- 行动提示与二维码行 -->
                <div class="qr-row">
                    <div class="qr-action">
                        <div class="qr-action-title">扫码阅读原文</div>
                        <div class="qr-action-sub">长按识别二维码</div>
                    </div>
                    <div class="qrcode">
                        <QrCode :options="qrCodeOptions" @qr-code-complete="draw" />
                    </div>
                </div>
                <!-- 链接地址, 完整展示, 弱化视觉权重 -->
                <div class="url-row">
                    <span class="url">{{ dataAc.urlText }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { snapdom } from "@zumer/snapdom"
import { computed, type ComputedRef, nextTick } from "vue"

import QrCode from "@/components/common/qr-code"
import { waitForImagesLoaded } from "@/utils/img"

import { type PosterPropsOptions } from "./types"

// 标题区域内容宽度: 容器 320px - 左右 padding 各 24px = 272px
// font-size 20px, CJK 字符约 20px 宽, 每行约 13.6 个视觉单位
// 最多 3 行 = 40 个视觉单位(留少量余量)
const TITLE_MAX_VISUAL_WIDTH = 40

// 主图画框内尺寸: 容器 320px - 左右 margin 各 16px = 288px 宽, 高按 4:3 = 216px.
// 4:3 与文章列表 post-item-main 缩略图(PC 200x150 / PAD 100x75 / PHONE 128x96)保持一致,
// 让封面图在海报里以与列表页相同的比例呈现, 避免额外裁切.
const IMG_FRAME_WIDTH = 288
const IMG_FRAME_HEIGHT = 216
const IMG_FRAME_RATIO = IMG_FRAME_WIDTH / IMG_FRAME_HEIGHT // 4/3 ≈ 1.333

// cover 铺满判定区间: 图片宽高比 / 画框宽高比的比值落在 [0.6, 1.4] 内.
// 以 4:3 为中心: 4:3 图 ratioFit=1.0 完美铺满; 16:9(1.78) ratioFit=1.33 竖向裁约 25%;
// 接近方形(1:1) ratioFit=0.75 横向裁约 25%, 均在可接受范围; 竖长图/超宽扁图仍走 contain.
const COVER_FIT_MIN = 0.6
const COVER_FIT_MAX = 1.4

/**
 * resolveImgFitMode 按图片自然尺寸与画框比例的匹配度决定填充模式.
 * 常规横版图(4:3 / 16:9 等, 比例与画框接近)且分辨率足够时返回 "cover", 铺满画框避免留白;
 * 方形 logo / 竖长图 / 超宽扁图 / 小尺寸图返回 "contain", 完整居中防止裁切不可读.
 * @param img - 已加载完成的 img 元素.
 * @returns "cover" 或 "contain".
 */
function resolveImgFitMode(img: HTMLImageElement): "cover" | "contain" {
    if (!img.naturalWidth || !img.naturalHeight) {
        return "contain"
    }
    const ratioFit = img.naturalWidth / img.naturalHeight / IMG_FRAME_RATIO
    // 宽度不足画框宽的图片禁止 cover, 避免小图被放大模糊
    return img.naturalWidth >= IMG_FRAME_WIDTH && ratioFit >= COVER_FIT_MIN && ratioFit <= COVER_FIT_MAX ? "cover" : "contain"
}

/**
 * truncateByVisualWidth 按视觉宽度截断文本
 * CJK/全角字符计为 1 个单位, ASCII/半角字符计为 0.5 个单位
 * 超出 maxWidth 时在截断处追加 "..."
 */
function truncateByVisualWidth(text: string, maxWidth: number): string {
    let width = 0
    for (let i = 0; i < text.length; i++) {
        const code = text.charCodeAt(i)
        // CJK 统一表意文字及常见全角字符视为宽字符
        const isWide = code > 0x7f
        width += isWide ? 1 : 0.5
        if (width > maxWidth) {
            return text.slice(0, i) + "..."
        }
    }
    return text
}

defineOptions({ name: "PosterShare" })

const { data } = defineProps<{
    data: PosterPropsOptions
}>()

// 事件声明
const emit = defineEmits<{
    (event: "poster-complete"): void // 生成海报完成
}>()

const dataAc: ComputedRef<PosterPropsOptions> = computed(() => {
    const defaultOptions: PosterPropsOptions = {
        // logo
        logoSrc: "",

        // 海报主图
        imgSrc: "",

        // 海报标题
        titleText: "分享标题",

        // 分享的链接
        urlText: "https://jiaopengzi.com",
    }

    // 过滤空字符串属性, 避免覆盖默认值
    const incoming = Object.fromEntries(Object.entries(data ?? {}).filter(([, v]) => v !== "" && v !== undefined && v !== null)) as PosterPropsOptions

    let titleText = incoming.titleText ?? defaultOptions.titleText

    // 基于视觉宽度截断标题: snapdom 不支持 CSS line-clamp, 改用 JS 计算
    titleText = truncateByVisualWidth(titleText ?? "", TITLE_MAX_VISUAL_WIDTH)

    // 合并默认配置和用户配置, 并使用处理后的标题
    return { ...defaultOptions, ...incoming, titleText }
})

/**
 * 构造二维码配置
 * 仅在存在有效中心图标时传入 image, 避免二维码库在移动端因图标资源异常而不触发完成事件
 */
const qrCodeOptions = computed(() => {
    const options = {
        data: dataAc.value.urlText,
        margin: 2,
        width: 80,
        height: 80,
    }

    if (dataAc.value.logoSrc) {
        return {
            ...options,
            image: dataAc.value.logoSrc,
        }
    }

    return options
})

// 绘制海报
const draw = async () => {
    await nextTick()

    // 等待图片加载完成
    const el = document.querySelector("#poster-container") as HTMLElement | null
    if (!el) {
        return
    }

    await waitForImagesLoaded(el)

    // 在 snapdom 截图前同步把主图填充模式写入内联 style, 确保抓取到的就是最终样式.
    // 不能依赖 reactive class 切换: load 事件与 snapdom 启动几乎同帧, class 更新可能赶不上.
    const posterImg = el.querySelector<HTMLImageElement>(".main-img img")
    if (posterImg) {
        const fitMode = resolveImgFitMode(posterImg)
        posterImg.style.objectFit = fitMode
        if (fitMode === "cover") {
            posterImg.style.width = "100%"
            posterImg.style.height = "100%"
        } else {
            posterImg.style.maxWidth = "100%"
            posterImg.style.maxHeight = "100%"
        }
    }

    // 使用 snapdom 生成图片 (替代 html2canvas).
    // reconcile: true 逐盒对齐真实 DOM 尺寸, 消除标题文字在字体回退光栅化下可能换行漂移的警告,
    // 代价是截取耗时约翻倍, 320px 海报体量下可接受.
    const result = await snapdom(el, {
        embedFonts: true,
        reconcile: true,
    })
    await result.download({
        filename: "poster.png",
        type: "png",
        scale: 3,
    })

    // 下载完成回调
    emit("poster-complete")
}
</script>

<style lang="scss" scoped>
.poster-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 16px;
    background-color: transparent;
}

#poster-container {
    width: 320px;
    background: #ffffff;
    border-radius: 14px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

.main-img {
    // 内嵌画布: 4:3 高度(216px) + 浅灰底 + 自适应填充, 比例对齐文章列表缩略图.
    // img 的 object-fit / 尺寸由 draw() 在截图前按 naturalWidth/Height 同步写入内联 style:
    //   常规横版图 cover 铺满画框(无留白); 方形 logo / 竖长图 / 超宽扁图 contain 完整居中.
    // 这里只提供布局容器, 不预设填充模式, 避免 reactive class 切换赶不上 snapdom 抓取时序.
    height: 216px;
    margin: 16px 16px 0;
    border-radius: 8px;
    overflow: hidden;
    background-color: #f3f5f7;
    display: flex;
    justify-content: center;
    align-items: center;

    img {
        max-width: 100%;
        max-height: 100%;
        display: block;
    }
}

.poster-content {
    padding: 18px 24px 0;

    // 无封面图时短尺即顶部第一元素, 加大上 padding 保持版面平衡
    &.no-img {
        padding-top: 26px;
    }
    // 品牌色短尺, 跟随主题主色, 无图时也能给顶部提供视觉锚点
    .accent-line {
        display: block;
        width: 24px;
        height: 3px;
        border-radius: 2px;
        background: var(--jpz-color-primary, #1e2858);
        margin-bottom: 12px;
    }

    .title {
        font-family: var(--jpz-font-family-title, "SmileySans", "Microsoft YaHei", sans-serif);
        font-size: 20px;
        color: #16161a;
        line-height: 1.45;
        font-weight: 600;
        margin: 0;
        word-break: break-word;
    }
}

.poster-footer {
    display: flex;
    flex-direction: column;
    padding: 18px 24px 20px;
    // 细分隔线替代原虚线 + 灰渐变底色, 保持海报整体为纯净白底
    border-top: 1px solid #eef0f3;
    margin-top: 20px;
    gap: 14px;

    // 行动提示与二维码行
    .qr-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
    }

    // 左侧行动提示文案, 强调引导
    .qr-action {
        flex: 1;

        .qr-action-title {
            font-size: 14px;
            font-weight: 600;
            color: #16161a;
            letter-spacing: 0.5px;
            line-height: 1.5;
        }

        .qr-action-sub {
            font-size: 11px;
            color: #9aa0a6;
            margin-top: 4px;
            letter-spacing: 0.3px;
        }
    }

    // 右侧二维码: 白底细边框卡片, 二维码本体为透明底, 白底保证任何场景下可扫
    .qrcode {
        width: 80px;
        height: 80px;
        box-sizing: border-box;
        padding: 6px;
        border-radius: 8px;
        overflow: hidden;
        background-color: #ffffff;
        border: 1px solid #e8eaee;
        flex-shrink: 0;

        :deep(canvas),
        :deep(img) {
            display: block;
            width: 100%;
            height: 100%;
        }
    }

    // 链接地址, 完整展示, 弱化视觉权重
    .url-row {
        .url {
            font-family: var(--jpz-font-family-code, "JBMonoWOFF2", "Microsoft YaHei", sans-serif);
            font-size: 9px;
            color: #b9bec7;
            line-height: 1.5;
            word-break: break-all;
        }
    }
}
</style>
