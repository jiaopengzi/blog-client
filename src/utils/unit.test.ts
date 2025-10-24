/**
 * @FilePath     : \blog-client\src\utils\unit.test.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 单位转换测试
 */

import { describe, expect, it } from "vitest"

import { unit, unitNumber } from "./unit"

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

describe("unitNumber", () => {
    it("非数字", () => {
        expect(unitNumber("abc")).toBe("")
    })
    it("空字符串", () => {
        expect(unitNumber("")).toBe("")
    })
    it("数字零", () => {
        expect(unitNumber(0)).toBe("0")
    })
    it("字符串零", () => {
        expect(unitNumber("0")).toBe("0")
    })
    it("小于1万", () => {
        expect(unitNumber(234)).toBe("234")
        expect(unitNumber(1234)).toBe("1234")
        expect(unitNumber("5678")).toBe("5678")
    })
    it("大于1万,小于1亿", () => {
        expect(unitNumber(10001)).toBe("1.00万")
        expect(unitNumber("20001")).toBe("2.00万")
        expect(unitNumber(1234567)).toBe("123.46万")
    })
    it("大于1亿", () => {
        expect(unitNumber(100000000)).toBe("1.00亿")
        expect(unitNumber("250000000")).toBe("2.50亿")
        expect(unitNumber(1234567890)).toBe("12.35亿")
    })
    it("负值", () => {
        expect(unitNumber(-10000)).toBe("-1.00万")
        expect(unitNumber("-250000000")).toBe("-2.50亿")
    })
    // 自定义小数位
    it("自定义小数位", () => {
        expect(unitNumber(1234567, 3)).toBe("123.457万")
        expect(unitNumber(100000000, 1)).toBe("1.0亿")
    })
})
