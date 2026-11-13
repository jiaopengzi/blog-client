/**
 * FilePath    : blog-client\src\components\views\admin\component\main\app-option\base\index.test.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 网站选项表单 textarea 清除按钮的样式加载顺序回归测试
 */

import { readFileSync } from "node:fs"
import { createRequire } from "node:module"

import { compileString } from "sass"
import { afterEach, describe, expect, it } from "vitest"
import { compileStyle, parse } from "vue/compiler-sfc"

import formSource from "./index.vue?raw"

// Vitest 默认不处理 CSS, 直接读取发行样式以验证真实级联, 不调整全局测试配置.
const require = createRequire(import.meta.url)
const baseCss = readFileSync(require.resolve("element-plus/theme-chalk/base.css"), "utf8")
const inputCss = readFileSync(require.resolve("element-plus/theme-chalk/el-input.css"), "utf8")
const scopeId = "data-v-textarea-clear-test"
const { descriptor, errors } = parse(formSource)
if (errors.length > 0) {
    throw new AggregateError(errors, "网站选项表单解析失败")
}

const scopedStyle = descriptor.styles.find((style) => style.scoped)
if (!scopedStyle) {
    throw new Error("网站选项表单缺少 scoped 样式")
}

const formStyle = compileStyle({
    source: compileString(scopedStyle.content).css,
    filename: "index.vue",
    id: scopeId,
    scoped: true,
})
if (formStyle.errors.length > 0) {
    throw new AggregateError(formStyle.errors, "网站选项表单样式编译失败")
}

const mountedNodes: Element[] = []

/**
 * 安装真实组件样式和最小表单 DOM, 隔离验证 CSS 加载顺序的影响.
 * @param styles - 按实际加载顺序排列的样式内容.
 * @returns 包含表单内外清除图标的测试容器.
 */
function mountFixture(styles: string[]): HTMLDivElement {
    for (const css of styles) {
        const style = document.createElement("style")
        style.textContent = css
        document.head.append(style)
        mountedNodes.push(style)
    }

    const fixture = document.createElement("div")
    fixture.innerHTML = `
        <form class="base-form" ${scopeId}>
            <div class="el-textarea">
                <textarea class="el-textarea__inner is-clearable"></textarea>
                <i class="el-icon el-textarea__clear"></i>
            </div>
            <div class="el-input">
                <i class="el-icon el-input__clear"></i>
            </div>
        </form>
        <div class="outside-form el-textarea">
            <i class="el-icon el-textarea__clear"></i>
        </div>
    `
    document.body.append(fixture)
    mountedNodes.push(fixture)
    return fixture
}

afterEach(() => {
    for (const node of mountedNodes.splice(0)) {
        node.remove()
    }
})

describe("网站选项表单清除按钮布局", () => {
    it.each([
        { order: "先", styles: [baseCss, inputCss, formStyle.code], outsidePosition: "absolute" },
        { order: "后", styles: [inputCss, formStyle.code, baseCss], outsidePosition: "relative" },
    ])("图标基础样式$order 加载时, 多行清除按钮保持绝对定位且不影响其他图标", ({ styles, outsidePosition }) => {
        const fixture = mountFixture(styles)

        expect(getComputedStyle(fixture.querySelector(".base-form .el-textarea__clear")!).position).toBe("absolute")
        expect(getComputedStyle(fixture.querySelector(".el-input__clear")!).position).toBe("relative")
        expect(getComputedStyle(fixture.querySelector(".outside-form .el-textarea__clear")!).position).toBe(outsidePosition)
    })
})
