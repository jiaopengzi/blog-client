<!--
 * FilePath    : blog-client\src\components\common\poster-share\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 海报分享组件
-->

<template>
    <div class="poster-container">
        <div class="main-img">
            <img :src="dataAc.imgSrc" />
        </div>
        <h1 class="title">{{ dataAc.titleText }}</h1>
        <div class="url">{{ dataAc.urlText }}</div>
        <div class="qrcode">
            <!-- <QrCode :options="{ data: dataAc.urlText }" @qr-code-complete="draw" /> -->
            <QrCode :options="{ data: dataAc.urlText, image: dataAc.logoSrc }" @qr-code-complete="draw" />
            <p class="qrcode-text">长按识别</p>
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
        logoSrc: "https://jiaopengzi.com/favicon.ico",

        // 海报主图
        imgSrc: "https://jiaopengzi.com/favicon.ico",

        // 海报标题
        titleText: "分享标题",

        // 分享的链接
        urlText: "https://jiaopengzi.com",
    }

    const incoming = (data ?? {}) as PosterPropsOptions

    // 处理标题长度
    let titleText = incoming.titleText ?? defaultOptions.titleText
    if (titleText && titleText.length > 30) {
        titleText = titleText.slice(0, 30) + "..."
    }

    // 合并默认配置和用户配置，并使用处理后的标题
    return { ...defaultOptions, ...incoming, titleText }
})

// 绘制海报
const draw = async () => {
    await nextTick()

    // 等待图片加载完成
    const el = document.querySelector(".poster-container") as HTMLElement
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
.poster-container {
    width: 309px;
    height: 500px;
    background-color: #f9f9f9; // 浅灰色背景，更加通用
    border-radius: 8px; // 圆角稍微加大，显得更友好
    padding: 15px;
}

.main-img {
    width: 100%;
    margin-bottom: 20px;
    display: flex;
    justify-content: center;
    align-items: center;

    img {
        max-height: 200px;
    }
}

.title {
    font-family: "SmileySans", "Microsoft YaHei", sans-serif;
    font-size: 20px;
    color: #333;
    text-align: center;
    margin-bottom: 10px;
    line-height: 1.6;
    font-weight: 500;
}

.url {
    font-family: "JBMonoWOFF2", "Microsoft YaHei", sans-serif;
    font-size: 14px;
    color: #555;
    text-align: center;
    margin-bottom: 20px;
    line-height: 1.5;
    font-weight: 500;
}

.qrcode {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .qrcode-text {
        font-family: "Microsoft YaHei", sans-serif;
        font-size: 12px;
        color: #555;
        text-align: center;
    }
}
</style>
