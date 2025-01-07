import { describe, expect,it } from "vitest"

import { unit } from "./unit"

describe("unit", () => {
    it("非数字", () => {
        expect(unit("abc")).toBe("")
    })

    it("空字符串", () => {
        expect(unit("")).toBe("")
    })

    it("数字零", () => {
        expect(unit(0)).toBe("")
    })

    it("字符串零", () => {
        expect(unit("0")).toBe("")
    })

    it("小于1万", () => {
        expect(unit(234)).toBe("234")
        expect(unit(1234)).toBe("1,234")
        expect(unit("5678")).toBe("5,678")
    })

    it("大于1万,千位为零", () => {
        expect(unit(10001)).toBe("1w")
        expect(unit("20001")).toBe("2w")
    })

    it("大于1万,千位不为零", () => {
        expect(unit(12345)).toBe("1.2w")
        expect(unit(123456)).toBe("12.3w")
        expect(unit(120456)).toBe("12w")
    })
})
