/**
 * FilePath    : blog-client\src\utils\cssValidator.test.ts
 * Description : css 校验器单元测试
 */

import { describe, expect, it } from "vitest"

import { isValidCSS } from "./cssValidator"

describe("isValidCSS", () => {
    it("0、普通字符串", () => {
        const res = isValidCSS("abcefghijklmnopqrstuvwxyz")
        expect(res.isValid).toBe(false)
    })

    it("1、空字符串校验为合法", () => {
        const res = isValidCSS("")
        expect(res.isValid).toBe(true)
    })

    it("2、检测到未闭合的大括号", () => {
        const res = isValidCSS(".a { color: red;}\n.b { color: red;")
        expect(res.isValid).toBe(false)
        expect(res.errors.join("\n")).toContain("存在未闭合的 '{'")
    })

    it("3、验证简单的 CSS", () => {
        const res = isValidCSS("body { color: red; }")
        expect(res.isValid).toBe(true)
    })

    it("4、检测到缺少分号", () => {
        const res = isValidCSS("p { color: red }")
        expect(res.isValid).toBe(false)
        expect(res.errors.join("\n")).toContain("样式未以分号结尾")
    })

    it("5、检测到中文分号", () => {
        const res = isValidCSS("p { color: red； }")
        expect(res.isValid).toBe(false)
        expect(res.errors.join("\n")).toContain("使用了中文分号")
    })

    it("6、检测到块外样式", () => {
        const res = isValidCSS("color: red;")
        expect(res.isValid).toBe(false)
        expect(res.errors.join("\n")).toContain("块外发现样式")
    })

    it("7、检测到多余的闭合大括号", () => {
        const res = isValidCSS("} .a { color: red; }")
        expect(res.isValid).toBe(false)
        expect(res.errors.join("\n")).toContain("发现多余的闭合")
    })

    it("8、检测到无效的属性名", () => {
        const res = isValidCSS("p { 123color: red; }")
        expect(res.isValid).toBe(false)
        expect(res.errors.join("\n")).toContain("无效的属性名")
    })

    it("9、对非字符串输入返回错误", () => {
        const res = isValidCSS(123 as unknown as string)
        expect(res.isValid).toBe(false)
        expect(res.errors.join("\n")).toContain("CSS 必须为字符串")
    })

    it("10、检测到未配对的注释（缺少结束标记）", () => {
        const res = isValidCSS("p { color: red; /* 未闭合注释")
        expect(res.isValid).toBe(false)
        expect(res.errors.join("\n")).toContain("注释未配对")
    })

    it("11、检测到未配对的注释（多余结束标记）", () => {
        const res = isValidCSS("p { color: red; */ }")
        expect(res.isValid).toBe(false)
        expect(res.errors.join("\n")).toContain("注释未配对")
    })

    it("12、检测到 // 风格注释", () => {
        const res = isValidCSS("p { color: red; // 这是注释 }")
        expect(res.isValid).toBe(false)
        expect(res.errors.join("\n")).toContain("检测到不合法的 '//' 注释")
    })

    it("13、字符串中包含 /* 不应误判为注释", () => {
        const res = isValidCSS('p { content: "/* not a comment */"; }')
        expect(res.isValid).toBe(true)
    })

    it("14、字符串中包含 { 不应误判为大括号", () => {
        const res = isValidCSS('p { content: "url({valid})"; }')
        expect(res.isValid).toBe(true)
    })

    it("15、字符串中包含 : 不应误判为属性分隔符", () => {
        const res = isValidCSS('p { content: "color: red"; }')
        expect(res.isValid).toBe(true)
    })

    it("16、转义字符串中的引号不应破坏字符串检测", () => {
        const res = isValidCSS('p { content: "He said \\"Hello\\""; }')
        expect(res.isValid).toBe(true)
    })

    it("17、转义反斜杠不应破坏字符串检测", () => {
        const res = isValidCSS('p { content: "path\\\\to\\\\file"; }')
        expect(res.isValid).toBe(true)
    })

    it("18、内联样式中的字符串包含特殊字符", () => {
        const res = isValidCSS('p { color: red; content: "text{inside}"; }')
        expect(res.isValid).toBe(true)
    })

    it("19、css 变量", () => {
        const res = isValidCSS("p { --my-color: red; }")
        expect(res.isValid).toBe(true)
    })

    it("20、属性值包含中文应允许（合法 CSS）", () => {
        const res = isValidCSS('p { font-family: "微软雅黑"; }')
        expect(res.isValid).toBe(true)
    })

    it("21、属性值包含中文（无引号）应允许", () => {
        const res = isValidCSS('p { content: "中文内容"; }')
        expect(res.isValid).toBe(true)
    })

    it("22、选择器包含 Unicode 字符应允许", () => {
        const res = isValidCSS(".测试 { color: red; }")
        expect(res.isValid).toBe(true)
    })

    it("23、内联样式块解析应正确处理", () => {
        const res = isValidCSS("div { color: blue; background: white; }")
        expect(res.isValid).toBe(true)
    })

    it("24、注释中的特殊字符不应影响解析", () => {
        const res = isValidCSS("/* color: red; */ p { color: blue; }")
        expect(res.isValid).toBe(true)
    })

    it("25、/*! 强制保留注释应被正常移除", () => {
        const res = isValidCSS("/*! copyright */ p { color: red; }")
        expect(res.isValid).toBe(true)
    })

    it("26、@import 规则应跳过检查", () => {
        const res = isValidCSS('@import "style.css";')
        expect(res.isValid).toBe(true)
    })

    it("27、内联样式块中字符串包含分号应正确处理", () => {
        const res = isValidCSS('p { content: "a;b;c"; color: red; }')
        expect(res.isValid).toBe(true)
    })

    it("28、字符串中包含 } 不应误判为大括号", () => {
        const res = isValidCSS('p { content: "url(test})"; }')
        expect(res.isValid).toBe(true)
    })

    it("29、字符串中包含 ; 不应误判为分号", () => {
        const res = isValidCSS('p { content: "a;b;c"; }')
        expect(res.isValid).toBe(true)
    })

    it("30、单行多样式缺少分号", () => {
        const res = isValidCSS("p { color: red background: blue; }")
        expect(res.isValid).toBe(false)
        expect(res.errors.join("\n")).toContain("样式未以分号结尾")
    })

    it("31、嵌套规则（非法）应被检测", () => {
        const res = isValidCSS("p { color: red; div { margin: 0; } }")
        expect(res.isValid).toBe(false)
        expect(res.errors.join("\n")).toContain("嵌套规则不被支持")
    })

    it("32、左花括号前必须有选择器同一行缺少选择器", () => {
        const res = isValidCSS("{ color: red; }")
        expect(res.isValid).toBe(false)
        expect(res.errors.join("\n")).toContain("左花括号前缺少选择器")
    })

    it("33、左花括号在下一行且上一行为选择器视为非法", () => {
        const res = isValidCSS("p\n{ color: red; }")
        expect(res.isValid).toBe(false)
    })

    it("32、带有属性选择器", () => {
        const res = isValidCSS('input[type="text"] { border: 1px solid #ccc; }')
        expect(res.isValid).toBe(true)
    })

    it("33、左花括号缺少选择器", () => {
        const res = isValidCSS("\n{\n  color: red;\n}")
        expect(res.isValid).toBe(false)
        expect(res.errors.join("\n")).toContain("左花括号前缺少选择器")
    })
})
