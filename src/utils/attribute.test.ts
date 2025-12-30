import { describe, expect, it } from "vitest"

import { parseAttributes } from "./attribute"

describe("parseAttributes 函数", () => {
    it("对于空或仅空白输入返回空对象", () => {
        expect(parseAttributes("")).toEqual({})
        expect(parseAttributes("   ")).toEqual({})
    })

    it("解析双引号属性", () => {
        const input = 'id="123" title="abc" description="测试"'
        expect(parseAttributes(input)).toEqual({
            id: "123",
            title: "abc",
            description: "测试",
        })
    })

    it("解析单引号属性", () => {
        const input = "data-info='some info' checked='true'"
        expect(parseAttributes(input)).toEqual({
            "data-info": "some info",
            checked: "true",
        })
    })

    it("解析混合引号以及包含等号或空格的值", () => {
        const input = `class="btn primary" data-value='x=1&y=2' aria-label="Label text"`
        expect(parseAttributes(input)).toEqual({
            class: "btn primary",
            "data-value": "x=1&y=2",
            "aria-label": "Label text",
        })
    })

    it("支持名称中的连字符、冒号、下划线和数字", () => {
        const input = `data-id="1" x_y="v" x-y="z" svg:role="img" n123="9"`
        expect(parseAttributes(input)).toEqual({
            "data-id": "1",
            x_y: "v",
            "x-y": "z",
            "svg:role": "img",
            n123: "9",
        })
    })

    it("重复键以最后出现者为准并忽略无值属性", () => {
        const input = `a="1" disabled b='x' a="2"`
        const result = parseAttributes(input)
        expect(result.a).toBe("2")
        expect(result.disabled).toBeUndefined()
        expect(result.b).toBe("x")
    })
})
