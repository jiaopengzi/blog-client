/**
 * FilePath    : blog-client\src\components\editor\utils\copy.test.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 复制管线与 KaTeX 模块测试
 */

import { describe, expect, it } from "vitest"

import { materializeListMarkersForCopy, scaleDisplayKatexByFontSize } from "./copy"

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
})
