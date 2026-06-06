/**
 * FilePath    : blog-client\src\components\editor\utils\copy.test.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 复制管线与 KaTeX 模块测试
 */

import { afterEach, describe, expect, it, vi } from "vitest"

import { materializeListMarkersForCopy, prepareCopyWithCustomStyle, scaleDisplayKatexByFontSize } from "./copy"

afterEach(() => {
    vi.unstubAllGlobals()
})

describe("scaleDisplayKatexByFontSize", () => {
    it("在容器宽度不足时缩放行间公式", () => {
        const container = document.createElement("div")
        const wrapper = document.createElement("div")
        const displayElement = document.createElement("div")
        const formulaElement = document.createElement("span")

        displayElement.className = "katex-display"
        formulaElement.className = "katex"

        displayElement.appendChild(formulaElement)
        wrapper.appendChild(displayElement)
        container.appendChild(wrapper)

        Object.defineProperty(wrapper, "clientWidth", {
            configurable: true,
            value: 200,
        })
        Object.defineProperty(formulaElement, "offsetWidth", {
            configurable: true,
            value: 400,
        })

        scaleDisplayKatexByFontSize(container)

        expect(formulaElement.style.fontSize).toBe("50%")
    })

    it("在容器宽度充足时清除旧的缩放样式", () => {
        const container = document.createElement("div")
        const wrapper = document.createElement("div")
        const displayElement = document.createElement("div")
        const formulaElement = document.createElement("span")

        displayElement.className = "katex-display"
        formulaElement.className = "katex"
        formulaElement.style.fontSize = "50%"

        displayElement.appendChild(formulaElement)
        wrapper.appendChild(displayElement)
        container.appendChild(wrapper)

        Object.defineProperty(wrapper, "clientWidth", {
            configurable: true,
            value: 400,
        })
        Object.defineProperty(formulaElement, "offsetWidth", {
            configurable: true,
            value: 200,
        })

        scaleDisplayKatexByFontSize(container)

        expect(formulaElement.style.fontSize).toBe("")
    })
})

describe("materializeListMarkersForCopy", () => {
    it("会将普通列表恢复为微信原生列表, 并保留 task list 的 svg 图标", () => {
        const container = document.createElement("div")

        container.style.setProperty("--preview-paragraph-indent", "2em")
        container.style.setProperty("--preview-list-text-offset", "1.28em")
        container.style.setProperty("--preview-task-list-icon-width", "1em")
        container.innerHTML = `
            <ol>
                <li><p>第一项</p></li>
                <li>第二项</li>
            </ol>
            <ul>
                <li>顶层无序</li>
                <li>顶层无序2<ul><li>二级无序</li></ul></li>
            </ul>
            <ul>
                <li class="task-list-item task-list-item-unchecked"><svg class="task-list-icon"></svg>todo item</li>
            </ul>
        `
        document.body.appendChild(container)

        materializeListMarkersForCopy(container)

        const orderedList = container.querySelector("ol") as HTMLOListElement
        const unorderedList = container.querySelector("ul") as HTMLUListElement
        const nestedUnorderedList = container.querySelector("ul ul") as HTMLUListElement
        const orderedListItem = container.querySelector("ol > li") as HTMLLIElement
        const orderedListSection = container.querySelector("ol > li > section") as HTMLElement
        const nestedUnorderedSection = container.querySelector("ul ul > li > section") as HTMLElement
        const taskListItem = container.querySelector(".task-list-item") as HTMLLIElement
        const taskListIcon = container.querySelector(".task-list-item > .task-list-icon") as SVGElement

        expect(orderedList.style.listStyleType).toBe("decimal")
        expect(orderedList.style.paddingLeft).toBe("")
        expect(unorderedList.style.listStyleType).toBe("disc")
        expect(nestedUnorderedList.style.listStyleType).toBe("circle")
        expect(orderedList.classList.contains("list-paddingleft-1")).toBe(true)
        expect(orderedListItem.style.display).toBe("list-item")
        expect(orderedListSection.querySelector("span[leaf]")?.textContent).toContain("第一项")
        expect(nestedUnorderedSection.querySelector("span[leaf]")?.textContent).toContain("二级无序")
        expect(taskListItem.querySelector(".jpz-copy-list-marker")).toBeNull()
        expect(taskListItem.style.display).toBe("flex")
        expect(taskListItem.style.marginLeft).toBe("-1.5em")
        expect(taskListIcon.style.display).toBe("inline-block")
        expect(taskListIcon.style.marginRight).toBe("0.5em")

        document.body.removeChild(container)
    })

    it("在关闭首行缩进时不应把 task list 图标裁出复制容器", () => {
        const container = document.createElement("div")

        container.style.setProperty("--preview-paragraph-indent", "0")
        container.style.setProperty("--preview-list-text-offset", "1.28em")
        container.style.setProperty("--preview-task-list-icon-width", "1em")
        container.innerHTML = `
            <ul style="padding-left: 0px;">
                <li class="task-list-item task-list-item-unchecked"><svg class="task-list-icon"></svg>todo item</li>
            </ul>
        `
        document.body.appendChild(container)

        materializeListMarkersForCopy(container)

        const taskListItem = container.querySelector(".task-list-item") as HTMLLIElement
        const taskListIcon = container.querySelector(".task-list-item > .task-list-icon") as SVGElement

        expect(taskListItem.style.marginLeft).toBe("0em")
        expect(taskListItem.style.display).toBe("flex")
        expect(taskListIcon.style.display).toBe("inline-block")

        document.body.removeChild(container)
    })

    it("编辑期间原始预览 DOM 继续变化时, 预生成复制缓存不应输出子节点数量不匹配警告", async () => {
        const element = document.createElement("div")
        const imageBlockCount = 25

        element.id = "preview"
        element.innerHTML = Array.from({ length: imageBlockCount }, (_, index) => {
            if (index === imageBlockCount - 1) {
                return '<section class="jpz-image-wrapper"><img src="https://example.com/demo.png" alt="demo"></section>'
            }

            return `<section class="copy-block"><span>block-${index}</span></section>`
        }).join("")
        document.body.appendChild(element)

        const consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(() => undefined)
        let rafCallCount = 0

        vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
            rafCallCount += 1
            if (rafCallCount === 1) {
                const wrapper = element.querySelector(".jpz-image-wrapper") as HTMLElement | null
                if (wrapper) {
                    wrapper.innerHTML = ""
                }
            }

            callback(0)
            return rafCallCount
        })

        const preparedHtml = await prepareCopyWithCustomStyle(element)

        expect(preparedHtml).toContain('class="jpz-image-wrapper"')
        expect(preparedHtml).toContain('src="https://example.com/demo.png"')
        expect(consoleWarnSpy).not.toHaveBeenCalledWith("Original and cloned element child count mismatch", expect.anything(), expect.anything())

        document.body.removeChild(element)
    })

    it("编辑期间原始预览 DOM 新增图片节点时, 预生成复制缓存不应输出子节点数量不匹配警告", async () => {
        const element = document.createElement("div")
        const imageBlockCount = 25

        element.id = "preview"
        element.innerHTML = Array.from({ length: imageBlockCount }, (_, index) => {
            if (index === imageBlockCount - 1) {
                return '<section class="jpz-image-wrapper"></section>'
            }

            return `<section class="copy-block"><span>block-${index}</span></section>`
        }).join("")
        document.body.appendChild(element)

        const consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(() => undefined)
        let rafCallCount = 0

        vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
            rafCallCount += 1
            if (rafCallCount === 1) {
                const wrapper = element.querySelector(".jpz-image-wrapper") as HTMLElement | null
                if (wrapper) {
                    wrapper.innerHTML = '<img src="https://example.com/added.png" alt="added">'
                }
            }

            callback(0)
            return rafCallCount
        })

        const preparedHtml = await prepareCopyWithCustomStyle(element)

        expect(preparedHtml).toContain('class="jpz-image-wrapper"')
        expect(preparedHtml).not.toContain('src="https://example.com/added.png"')
        expect(consoleWarnSpy).not.toHaveBeenCalledWith("Original and cloned element child count mismatch", expect.anything(), expect.anything())

        document.body.removeChild(element)
    })

    it("会将三层普通列表归一化为微信兼容的兄弟级嵌套结构", () => {
        const container = document.createElement("div")

        container.style.setProperty("--preview-list-text-offset", "1.28em")
        container.style.setProperty("--preview-task-list-icon-width", "1em")
        container.innerHTML = `
            <ol>
                <li>有序第一层</li>
                <li>有序第二层
                    <ol>
                        <li>有序第二层-1</li>
                        <li>有序第二层-2
                            <ol>
                                <li>有序第三层-1</li>
                                <li>有序第三层-2</li>
                            </ol>
                        </li>
                    </ol>
                </li>
            </ol>
            <ul>
                <li>无序第一层</li>
                <li>无序第二层
                    <ul>
                        <li>无序第二层-1</li>
                        <li>无序第二层-2
                            <ul>
                                <li>无序第三层-1</li>
                                <li>无序第三层-2</li>
                            </ul>
                        </li>
                    </ul>
                </li>
            </ul>
        `
        document.body.appendChild(container)

        materializeListMarkersForCopy(container)

        const topOrderedList = container.querySelector("ol") as HTMLOListElement
        const secondOrderedItem = topOrderedList.children[1] as HTMLLIElement
        const secondOrderedList = topOrderedList.children[2] as HTMLOListElement
        const secondOrderedNestedItem = secondOrderedList.children[1] as HTMLLIElement
        const thirdOrderedList = secondOrderedList.children[2] as HTMLOListElement

        const topUnorderedList = container.querySelector("ul") as HTMLUListElement
        const secondUnorderedItem = topUnorderedList.children[1] as HTMLLIElement
        const secondUnorderedList = topUnorderedList.children[2] as HTMLUListElement
        const secondUnorderedNestedItem = secondUnorderedList.children[1] as HTMLLIElement
        const thirdUnorderedList = secondUnorderedList.children[2] as HTMLUListElement

        expect(secondOrderedItem.querySelector(":scope > ol")).toBeNull()
        expect(secondOrderedList.parentElement).toBe(topOrderedList)
        expect(secondOrderedList.previousElementSibling).toBe(secondOrderedItem)
        expect(secondOrderedNestedItem.querySelector(":scope > ol")).toBeNull()
        expect(thirdOrderedList.parentElement).toBe(secondOrderedList)
        expect(thirdOrderedList.previousElementSibling).toBe(secondOrderedNestedItem)
        expect(secondOrderedList.style.listStyleType).toBe("decimal")
        expect(thirdOrderedList.style.listStyleType).toBe("decimal")

        expect(secondUnorderedItem.querySelector(":scope > ul")).toBeNull()
        expect(secondUnorderedList.parentElement).toBe(topUnorderedList)
        expect(secondUnorderedList.previousElementSibling).toBe(secondUnorderedItem)
        expect(secondUnorderedNestedItem.querySelector(":scope > ul")).toBeNull()
        expect(thirdUnorderedList.parentElement).toBe(secondUnorderedList)
        expect(thirdUnorderedList.previousElementSibling).toBe(secondUnorderedNestedItem)
        expect(secondUnorderedList.style.listStyleType).toBe("circle")
        expect(thirdUnorderedList.style.listStyleType).toBe("square")

        document.body.removeChild(container)
    })

    it("blockquote 同时命中 border reset 和 border-left 时, 复制结果仍保留左边框宽度与样式", async () => {
        const style = document.createElement("style")
        style.textContent = `
            #preview blockquote,
            #preview blockquote p,
            #preview blockquote strong {
                margin: 0;
                padding: 0;
                border: 0;
                font: inherit;
                vertical-align: baseline;
            }

            #preview blockquote {
                margin: 16px 0;
                padding: 12px 16px;
                border-left: 4px solid rgb(255, 102, 102);
                background-color: rgb(242, 243, 245);
                border-radius: 4px;
            }

            #preview blockquote p {
                margin: 12px 0;
                text-indent: 0;
            }
        `
        document.head.appendChild(style)

        const element = document.createElement("div")
        element.id = "preview"
        element.innerHTML = "<blockquote><p>引用内容</p></blockquote>"
        document.body.appendChild(element)

        const preparedHtml = await prepareCopyWithCustomStyle(element)
        const container = document.createElement("div")
        container.innerHTML = preparedHtml
        const blockquote = container.querySelector("blockquote") as HTMLQuoteElement
        const blockquoteStyle = blockquote.getAttribute("style") ?? ""

        expect(blockquoteStyle).toContain("border-left-width: 4px")
        expect(blockquoteStyle).toContain("border-left-style: solid")
        expect(blockquoteStyle).toContain("border-left-color: rgb(255, 102, 102)")

        document.body.removeChild(element)
        document.head.removeChild(style)
    })
})
