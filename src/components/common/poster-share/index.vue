<!--
 * FilePath    : blog-client\src\components\common\poster-share\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 海报分享组件
-->

<template>
    <div class="poster-container">
        <div class="logo">
            <img :src="dataAc.logoSrc" />
        </div>
        <div class="main-img">
            <img :src="dataAc.imgSrc" />
        </div>
        <h1 class="title">{{ dataAc.titleText }}</h1>
        <div class="url">{{ dataAc.urlText }}</div>
        <div class="qrcode">
            <img :src="dataAc.qrCodeSrc" />
            <p class="qrcode-text">长按识别</p>
        </div>
    </div>
</template>

<script lang="ts" setup>
import html2canvas from "html2canvas"
import { computed, nextTick, onMounted } from "vue"

import { type PosterPropsOptions } from "./types"

defineOptions({ name: "PosterShare" })

const { data } = defineProps<{
    data: PosterPropsOptions
}>()

const dataAc = computed(() => {
    const defaultOptions = {
        // logo
        logoSrc: "https://jiaopengzi.com/favicon.ico",

        // 海报主图
        imgSrc: "https://jiaopengzi.com/favicon.ico",

        // 海报标题
        titleText: "分享标题",

        // 分享的链接
        urlText: "https://jiaopengzi.com",

        // 链接对应的二维码
        qrCodeSrc: "https://jiaopengzi.com/favicon.ico",
    }

    return { ...defaultOptions, ...data } // 合并默认配置和用户配置
})

onMounted(async () => {
    await nextTick(async () => {
        // 使用 html2canvas 生成图片
        const el = document.querySelector(".poster-container") as HTMLElement
        // 使用 canvas 生成图片
        const canvas = await html2canvas(el, {
            scale: 3,
            logging: false,
            width: el.offsetWidth,
            height: el.offsetHeight,
        })

        // 将图片转换为 Blob 对象并复制到剪贴板
        canvas.toBlob((blob) => {
            if (blob) {
                if (typeof ClipboardItem !== "undefined") {
                    // 新API
                    console.log("新API")
                    const item = new ClipboardItem({
                        [blob.type]: blob,
                    })
                    navigator.clipboard.write([item]).then(() => {
                        console.log("图片已复制到剪贴板")
                    })
                } else {
                    // 旧API
                    console.log("旧API")
                    const reader = new FileReader()
                    reader.onload = (e) => {
                        const base64 = e.target?.result as string
                        const link = document.createElement("a")
                        link.href = base64
                        link.download = "poster.png"
                        link.click()
                    }
                    reader.readAsDataURL(blob)
                }
            }
        })
    })
})
</script>
<style lang="scss" scoped>
.poster-container {
    width: 309px;
    height: 500px;
    background-color: #f9f9f9; // 浅灰色背景，更加通用
    border-radius: 8px; // 圆角稍微加大，显得更友好
    padding: 15px;
    position: relative;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); // 更柔和的阴影
}

.logo {
    width: 100%;
    height: auto;
    margin-bottom: 15px;
    display: flex;
    justify-content: left;
    align-items: center;

    img {
        max-height: 40px;
        height: auto;
        width: auto;
    }
}

.main-img {
    width: 100%;
    height: auto;
    margin-bottom: 15px;
    display: flex;
    justify-content: center;
    align-items: center;

    img {
        max-height: 200px;
        height: auto;
        width: auto;
    }
}

.title {
    font-family: "SmileySans", "Microsoft YaHei", sans-serif;
    font-size: 22px; // 稍微减小字体
    color: #333; // 深灰色文字，更加柔和
    text-align: center;
    margin-bottom: 15px; // 减少间距
    line-height: 1.6;
}

.url {
    font-family: "JBMonoWOFF2", "Microsoft YaHei", sans-serif;
    font-size: 14px;
    color: #555; // 中灰色文字，区分层次
    text-align: center;
    margin-bottom: 15px;
    line-height: 1.5;
}

.qrcode {
    display: flex;
    flex-direction: column; // 设置为列方向排列
    justify-content: center;
    align-items: center;
    height: auto;

    img {
        max-height: 80px; // 稍微增大二维码尺寸
        height: auto;
        width: auto;
    }

    .qrcode-text {
        font-family: "Microsoft YaHei", sans-serif;
        font-size: 12px; // 稍微增大字体
        color: #333; // 深灰色文字
        text-align: center;
    }
}
</style>
