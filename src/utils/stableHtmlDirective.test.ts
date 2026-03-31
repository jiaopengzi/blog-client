/**
 * FilePath    : blog-client\src\utils\stableHtmlDirective.test.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 测试 stableHtmlDirective.ts 中的函数，确保在增量更新 innerHTML 时正确收集、同步和恢复已加载的 img 元素，避免重建造成的闪烁。
 */

import { describe, expect, it } from "vitest"

import { collectLoadedImages, restoreLoadedImages, syncImgAttributes } from "./stableHtmlDirective"

// 创建一个模拟已加载完成的 img 元素（jsdom 不实际加载图片，需手动 mock 属性）
function makeLoadedImg(src: string, attrs: Record<string, string> = {}): HTMLImageElement {
    const img = document.createElement("img")
    img.src = src
    Object.entries(attrs).forEach(([k, v]) => img.setAttribute(k, v))
    Object.defineProperty(img, "complete", { value: true, configurable: true })
    Object.defineProperty(img, "naturalWidth", { value: 100, configurable: true })
    return img
}

function makeContainer(...imgs: HTMLImageElement[]): HTMLDivElement {
    const el = document.createElement("div")
    imgs.forEach((img) => el.appendChild(img))
    return el
}

describe("collectLoadedImages", () => {
    it("容器内无 img 时返回空 Map", () => {
        const el = document.createElement("div")
        el.innerHTML = "<p>无图片</p>"
        expect(collectLoadedImages(el).size).toBe(0)
    })

    it("img 未加载完成（complete=false）时不收集", () => {
        const img = document.createElement("img")
        img.src = "http://example.com/a.png"
        Object.defineProperty(img, "complete", { value: false, configurable: true })
        Object.defineProperty(img, "naturalWidth", { value: 0, configurable: true })
        const el = makeContainer(img)
        expect(collectLoadedImages(el).size).toBe(0)
    })

    it("img 加载失败（naturalWidth=0）时不收集", () => {
        const img = document.createElement("img")
        img.src = "http://example.com/broken.png"
        Object.defineProperty(img, "complete", { value: true, configurable: true })
        Object.defineProperty(img, "naturalWidth", { value: 0, configurable: true })
        const el = makeContainer(img)
        expect(collectLoadedImages(el).size).toBe(0)
    })

    it("img 无 src 时不收集", () => {
        const img = document.createElement("img")
        Object.defineProperty(img, "complete", { value: true, configurable: true })
        Object.defineProperty(img, "naturalWidth", { value: 100, configurable: true })
        const el = makeContainer(img)
        expect(collectLoadedImages(el).size).toBe(0)
    })

    it("单张已加载 img 按 src 收集", () => {
        const src = "http://example.com/a.png"
        const img = makeLoadedImg(src)
        const el = makeContainer(img)
        const result = collectLoadedImages(el)
        expect(result.size).toBe(1)
        expect(result.get(img.src)).toEqual([img])
    })

    it("相同 src 的多张已加载 img 收集到同一个数组，顺序保持", () => {
        const src = "http://example.com/a.png"
        const img1 = makeLoadedImg(src, { alt: "first" })
        const img2 = makeLoadedImg(src, { alt: "second" })
        const el = makeContainer(img1, img2)
        const result = collectLoadedImages(el)
        expect(result.size).toBe(1)
        const list = result.get(img1.src)!
        expect(list).toHaveLength(2)
        expect(list[0]).toBe(img1)
        expect(list[1]).toBe(img2)
    })

    it("不同 src 的 img 各自独立收集", () => {
        const img1 = makeLoadedImg("http://example.com/a.png")
        const img2 = makeLoadedImg("http://example.com/b.png")
        const el = makeContainer(img1, img2)
        const result = collectLoadedImages(el)
        expect(result.size).toBe(2)
    })
})

describe("syncImgAttributes", () => {
    it("将 newImg 的非 src 属性写入 savedImg", () => {
        const savedImg = document.createElement("img")
        savedImg.src = "http://example.com/a.png"

        const newImg = document.createElement("img")
        newImg.src = "http://example.com/a.png"
        newImg.alt = "新描述"
        newImg.setAttribute("class", "preview-img")

        syncImgAttributes(savedImg, newImg)

        expect(savedImg.alt).toBe("新描述")
        expect(savedImg.getAttribute("class")).toBe("preview-img")
    })

    it("不复制 src 属性，savedImg 的 src 保持不变", () => {
        const savedImg = document.createElement("img")
        savedImg.src = "http://example.com/original.png"

        const newImg = document.createElement("img")
        newImg.src = "http://example.com/different.png"

        syncImgAttributes(savedImg, newImg)

        expect(savedImg.src).toBe("http://example.com/original.png")
    })

    it("移除 savedImg 上在 newImg 中已不存在的属性（src 不受影响）", () => {
        const savedImg = document.createElement("img")
        savedImg.src = "http://example.com/a.png"
        savedImg.alt = "旧描述"
        savedImg.setAttribute("data-old", "值")

        const newImg = document.createElement("img")
        newImg.src = "http://example.com/a.png"

        syncImgAttributes(savedImg, newImg)

        expect(savedImg.hasAttribute("alt")).toBe(false)
        expect(savedImg.hasAttribute("data-old")).toBe(false)
        expect(savedImg.src).toBe("http://example.com/a.png")
    })

    it("更新 savedImg 上已有属性的值", () => {
        const savedImg = document.createElement("img")
        savedImg.src = "http://example.com/a.png"
        savedImg.alt = "旧描述"

        const newImg = document.createElement("img")
        newImg.src = "http://example.com/a.png"
        newImg.alt = "新描述"

        syncImgAttributes(savedImg, newImg)

        expect(savedImg.alt).toBe("新描述")
    })
})

describe("restoreLoadedImages", () => {
    it("savedImages 为空时不修改 DOM", () => {
        const el = document.createElement("div")
        el.innerHTML = '<img src="http://example.com/a.png">'
        const originalImg = el.querySelector("img")!

        restoreLoadedImages(el, new Map())

        expect(el.querySelector("img")).toBe(originalImg)
    })

    it("将容器内的新 img 替换为已保存的 img", () => {
        const src = "http://example.com/a.png"
        const savedImg = makeLoadedImg(src)

        const el = document.createElement("div")
        el.innerHTML = `<img src="${src}">`

        const savedImages = new Map([[savedImg.src, [savedImg]]])
        restoreLoadedImages(el, savedImages)

        expect(el.querySelector("img")).toBe(savedImg)
    })

    it("相同 src 多张 img 按 FIFO 顺序逐一替换", () => {
        const src = "http://example.com/a.png"
        const saved1 = makeLoadedImg(src, { alt: "first" })
        const saved2 = makeLoadedImg(src, { alt: "second" })

        const el = document.createElement("div")
        el.innerHTML = `<img src="${src}"><img src="${src}">`

        const savedImages = new Map([[saved1.src, [saved1, saved2]]])
        restoreLoadedImages(el, savedImages)

        const imgs = el.querySelectorAll("img")
        expect(imgs[0]).toBe(saved1)
        expect(imgs[1]).toBe(saved2)
    })

    it("src 不在 savedImages 中的 img 保持不变", () => {
        const srcA = "http://example.com/a.png"
        const srcB = "http://example.com/b.png"
        const savedImg = makeLoadedImg(srcA)

        const el = document.createElement("div")
        el.innerHTML = `<img src="${srcA}"><img src="${srcB}">`
        const originalImgB = el.querySelectorAll("img")[1]!

        const savedImages = new Map([[savedImg.src, [savedImg]]])
        restoreLoadedImages(el, savedImages)

        const imgs = el.querySelectorAll("img")
        expect(imgs[0]).toBe(savedImg)
        expect(imgs[1]).toBe(originalImgB)
    })
})
