<!--
 * FilePath    : blog-client\src\components\common\poster-share\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 海报分享组件
-->

<template>
    <div class="poster-wrapper">
        <div class="poster-container" id="poster-container">
            <!-- 海报主图, 无图时隐藏 -->
            <div v-if="dataAc.imgSrc" class="main-img">
                <img :src="dataAc.imgSrc" crossorigin="anonymous" />
            </div>
            <!-- 内容信息区 -->
            <div class="poster-content">
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
// import html2canvas from "html2canvas"
import { computed, type ComputedRef, nextTick } from "vue"

import QrCode from "@/components/common/qr-code"
// import { copyImg } from "@/utils/clipboard"
import { waitForImagesLoaded } from "@/utils/img"

// import { MessageUtil } from "@/utils/message"
import { type PosterPropsOptions } from "./types"

// 标题区域内容宽度: 容器 320px - 左右 padding 各 24px = 272px
// font-size 20px, CJK 字符约 20px 宽, 每行约 13.6 个视觉单位
// 最多 3 行 = 40 个视觉单位(留少量余量)
const TITLE_MAX_VISUAL_WIDTH = 40

/**
 * truncateByVisualWidth 按视觉宽度截断文本。
 * CJK/全角字符计为 1 个单位, ASCII/半角字符计为 0.5 个单位。
 * 超出 maxWidth 时在截断处追加 "..."。
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

// 事件
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

    // 合并默认配置和用户配置，并使用处理后的标题
    return { ...defaultOptions, ...incoming, titleText }
})

/**
 * 构造二维码配置.
 * 仅在存在有效中心图标时传入 image, 避免二维码库在移动端因图标资源异常而不触发完成事件.
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

    // // 使用 html2canvas 生成图片
    // const canvas = await html2canvas(el, {
    //     scale: 3,
    //     logging: false,
    //     useCORS: true, // 允许跨域图片
    // })

    // // 将图片转换为 Blob 对象并复制到剪贴板
    // canvas.toBlob((blob) => {
    //     if (blob) {
    //         // 复制到剪贴板
    //         copyImg(blob, "poster.png").then(() => {
    //             emit("poster-complete")
    //             MessageUtil.success("分享海报已复制到剪贴板")
    //         })
    //     }
    // })

    // 使用 snapdom 生成图片 (替代 html2canvas)
    const result = await snapdom(el, {
        embedFonts: true,
    })
    await result.download({
        filename: "poster.png",
        type: "png",
        scale: 3,
    })

    // 下载完成回调
    emit("poster-complete")
    // MessageUtil.success("分享海报已复制到剪贴板")
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
    border-radius: 16px;
    box-shadow:
        0 8px 32px rgba(0, 0, 0, 0.1),
        0 1px 4px rgba(0, 0, 0, 0.04);
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

.main-img {
    width: 100%;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    background-color: transparent;
    padding: 24px 24px 16px;

    img {
        width: 100%;
        max-height: 180px;
        object-fit: contain;
        border-radius: 12px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
        display: block;
    }
}

.poster-content {
    padding: 12px 24px 16px;

    .title {
        font-family: var(--jpz-font-family-title, "SmileySans", "Microsoft YaHei", sans-serif);
        font-size: 20px;
        color: #1a1a1a;
        line-height: 1.4;
        font-weight: 600;
        margin: 0;
        word-break: break-word;
    }
}

.poster-footer {
    display: flex;
    flex-direction: column;
    padding: 20px 24px 24px;
    border-top: 1px dashed #e8e8e8;
    margin-top: 4px;
    gap: 14px;
    background: linear-gradient(180deg, #fafbfc 0%, #f5f6f8 100%);

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
            font-size: 15px;
            font-weight: 600;
            color: #1a1a1a;
            letter-spacing: 0.5px;
            line-height: 1.5;
        }

        .qr-action-sub {
            font-size: 11px;
            color: #9ca3af;
            margin-top: 4px;
            letter-spacing: 0.3px;
        }
    }

    // 右侧二维码
    .qrcode {
        width: 80px;
        height: 80px;
        border-radius: 8px;
        overflow: hidden;
        border: 2px solid #ffffff;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
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
            color: #c0c0c0;
            line-height: 1.5;
            word-break: break-all;
        }
    }
}
</style>
