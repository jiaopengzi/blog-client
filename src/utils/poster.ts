/*
 * FilePath    : blog-client\src\utils\poster.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 生成分享海报
 */

// 海报元素类型
type Poster = {
    width: number // 海报宽度
    height: number // 海报高度
    backgroundColor: string // 海报背景色

    // logo
    logoSrc: string // logo图片地址
    logoWidth: number // logo图片宽度
    logoHeight: number // logo图片高度
    logoX: number // logo图片X坐标
    logoY: number // logo图片Y坐标

    // 海报主图
    imgSrc: string // 图片地址
    imgWidth: number // 图片宽度
    imgHeight: number // 图片高度
    imgX: number // 图片X坐标
    imgY: number // 图片Y坐标

    // 海报标题
    titleText: string // 标题文字
    titleFontSize: number // 标题字体大小
    titleFontColor: string // 标题字体颜色
    titleFontFamily: string // 标题字体
    titleFontWeight: string // 标题字体粗细
    titleTextAlign: CanvasTextAlign // 标题字体对齐方式
    titleTextBaseline: CanvasTextBaseline // 标题字体基线对齐方式
    titlePadding: number // 标题内边距
    titleX: number // 标题X坐标
    titleY: number // 标题Y坐标
    titleWidth: number // 标题宽度
    titleHeight: number // 标题高度

    // 分享的链接
    urlText: string // 链接文字
    urlFontSize: number // 链接字体大小
    urlFontColor: string // 链接字体颜色
    urlFontFamily: string // 链接字体
    urlFontWeight: string // 链接字体粗细
    urlTextAlign: CanvasTextAlign // 链接字体对齐方式
    urlTextBaseline: CanvasTextBaseline // 链接字体基线对齐方式
    urlPadding: number // 链接内边距
    urlX: number // 链接X坐标
    urlY: number // 链接Y坐标
    urlWidth: number // 链接宽度
    urlHeight: number // 链接高度

    // 链接对应的二维码
    qrCodeSrc: string // 二维码图片地址
    qrCodeWidth: number // 二维码图片宽度
    qrCodeHeight: number // 二维码图片高度
    qrCodeX: number // 二维码图片X坐标
    qrCodeY: number // 二维码图片Y坐标
}

// 海报配置项
type PosterOptions = Partial<Poster>

// 默认海报配置
const defaultPosterOptions = (): Poster => {
    return {
        width: 618,
        height: 1000,
        backgroundColor: "red",

        // logo
        logoSrc: "https://jiaopengzi.com/favicon.ico",
        logoWidth: 40,
        logoHeight: 40,
        logoX: 25,
        logoY: 25,

        // 海报主图
        imgSrc: "https://jiaopengzi.com/favicon.ico",
        imgWidth: 568,
        imgHeight: 568,
        imgX: 25,
        imgY: 90,

        // 海报标题
        titleText: "分享标题",
        titleFontSize: 40,
        titleFontColor: "#000000",
        titleFontFamily: "Arial",
        titleFontWeight: "bold",
        titleTextAlign: "left",
        titleTextBaseline: "top",
        titlePadding: 10,
        titleX: 25,
        titleY: 683,
        titleWidth: 568,
        titleHeight: 100,

        // 分享的链接
        urlText: "https://jiaopengzi.com",
        urlFontSize: 20,
        urlFontColor: "#000000",
        urlFontFamily: "Arial",
        urlFontWeight: "normal",
        urlTextAlign: "left",
        urlTextBaseline: "top",
        urlPadding: 10,
        urlX: 25,
        urlY: 720,
        urlWidth: 568,
        urlHeight: 100,

        // 链接对应的二维码
        qrCodeSrc: "https://jiaopengzi.com/favicon.ico",
        qrCodeWidth: 100,
        qrCodeHeight: 100,
        qrCodeX: 20,
        qrCodeY: 300,
    }
}

// 生成海报
export const generatePoster = (options: PosterOptions = {}) => {
    const posterOptions = { ...defaultPosterOptions(), ...options } // 合并默认配置和用户配置

    // 创建画布
    const canvas = document.createElement("canvas")
    canvas.width = posterOptions.width
    canvas.height = posterOptions.height
    const ctx = canvas.getContext("2d")

    if (!ctx) return

    // 绘制背景色
    ctx.fillStyle = posterOptions.backgroundColor || "#ffffff"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // 绘制logo
    const logoImg = new Image()
    logoImg.src = posterOptions.logoSrc
    logoImg.onload = () => {
        ctx.drawImage(logoImg, posterOptions.logoX || 0, posterOptions.logoY || 0, posterOptions.logoWidth || 100, posterOptions.logoHeight || 100)
    }

    // 绘制主图
    const imageImg = new Image()
    imageImg.src = posterOptions.imgSrc
    imageImg.onload = () => {
        ctx.drawImage(imageImg, posterOptions.imgX || 0, posterOptions.imgY || 0, posterOptions.imgWidth || 200, posterOptions.imgHeight || 200)
    }

    // 绘制标题文字
    ctx.font = `${posterOptions.titleFontWeight} ${posterOptions.titleFontSize}px ${posterOptions.titleFontFamily}`
    ctx.fillStyle = posterOptions.titleFontColor || "#000000"
    ctx.textAlign = posterOptions.titleTextAlign || "left"
    ctx.textBaseline = posterOptions.titleTextBaseline || "top"
    const titleLines = wrapText(ctx, posterOptions.titleText, posterOptions.titleWidth)
    titleLines.forEach((line, index) => {
        ctx.fillText(line, posterOptions.titleX || 0, (posterOptions.titleY || 0) + index * (posterOptions.titleFontSize + posterOptions.titlePadding))
    })

    // 绘制链接文字
    ctx.font = `${posterOptions.urlFontWeight} ${posterOptions.urlFontSize}px ${posterOptions.urlFontFamily}`
    ctx.fillStyle = posterOptions.urlFontColor || "#000000"
    ctx.textAlign = posterOptions.urlTextAlign || "left"
    ctx.textBaseline = posterOptions.urlTextBaseline || "top"
    const urlLines = wrapText(ctx, posterOptions.urlText, posterOptions.urlWidth)
    urlLines.forEach((line, index) => {
        ctx.fillText(line, posterOptions.urlX || 0, (posterOptions.urlY || 0) + index * (posterOptions.urlFontSize + posterOptions.urlPadding))
    })

    // 绘制二维码
    const qrCodeImg = new Image()
    qrCodeImg.src = posterOptions.qrCodeSrc
    qrCodeImg.onload = () => {
        ctx.drawImage(qrCodeImg, posterOptions.qrCodeX || 0, posterOptions.qrCodeY || 0, posterOptions.qrCodeWidth || 100, posterOptions.qrCodeHeight || 100)
    }

    document.body.appendChild(canvas)
}

// 文本换行处理
const wrapText = (ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] => {
    const words = text.split(" ")
    const lines: string[] = []
    let currentLine = words[0]

    for (let i = 1; i < words.length; i++) {
        const word = words[i]
        const width = ctx.measureText(currentLine + " " + word).width
        if (width < maxWidth) {
            currentLine += " " + word
        } else {
            lines.push(currentLine)
            currentLine = word
        }
    }
    lines.push(currentLine)
    return lines
}
