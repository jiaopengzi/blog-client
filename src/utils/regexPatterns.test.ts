/**
 * @Author       : jiaopengzi
 * @Date         : 2024-11-27 15:17:31
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-07 14:04:22
 * @FilePath     : \blog-client\src\utils\regexPatterns.test.ts
 * @Description  : 正则表达式测试
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */
import { describe, expect, it } from "vitest"

import { RegexPatterns } from "./regexPatterns"

describe("RegexPatterns.UserName", () => {
    it("正确示例", () => {
        expect(RegexPatterns.UserName.test("user123")).toBe(true)
    })
    it("数字开头", () => {
        expect(RegexPatterns.UserName.test("1username")).toBe(false)
    })
    it("不足6个字符", () => {
        expect(RegexPatterns.UserName.test("user1")).toBe(false)
    })
    it("大于20字符", () => {
        expect(RegexPatterns.UserName.test("user123456789user123456789")).toBe(false)
    })
    it("有大写字符", () => {
        expect(RegexPatterns.UserName.test("USER123")).toBe(false)
    })
    it("其他情况", () => {
        expect(RegexPatterns.UserName.test("非法字符")).toBe(false)
    })
})

describe("RegexPatterns.NickName", () => {
    it("正确示例", () => {
        expect(RegexPatterns.NickName.test("昵称")).toBe(true)
    })

    it("空字符串", () => {
        expect(RegexPatterns.NickName.test("")).toBe(false)
    })

    it("大于20字符", () => {
        expect(RegexPatterns.NickName.test("abcdefghijklmnopqrstuvwxyz")).toBe(false)
    })
})

describe("RegexPatterns.Email", () => {
    it("正确示例", () => {
        expect(RegexPatterns.Email.test("test@jiaopengzi.com")).toBe(true)
    })

    it("不包含@", () => {
        expect(RegexPatterns.Email.test("testjiaopengzi.com")).toBe(false)
    })

    it("不包含.", () => {
        expect(RegexPatterns.Email.test("test@jiaopengzicom")).toBe(false)
    })

    it("不包含@和.", () => {
        expect(RegexPatterns.Email.test("testjiaopengzicom")).toBe(false)
    })

    it("大写字母", () => {
        expect(RegexPatterns.Email.test("TEST@jiaopengzi.com")).toBe(true)
    })
})

describe("RegexPatterns.Captcha", () => {
    it("正确示例", () => {
        expect(RegexPatterns.Captcha.test("123456")).toBe(true)
    })

    it("超过7位", () => {
        expect(RegexPatterns.Captcha.test("1234567")).toBe(false)
    })

    it("不足6位", () => {
        expect(RegexPatterns.Captcha.test("12345")).toBe(false)
    })

    it("空", () => {
        expect(RegexPatterns.Captcha.test("")).toBe(false)
    })

    it("不是纯数字", () => {
        expect(RegexPatterns.Captcha.test("123abc")).toBe(false)
    })
})

describe("RegexPatterns.Password", () => {
    it("正确示例", () => {
        expect(RegexPatterns.Password.test("ABCabc123456")).toBe(true)
    })

    it("正确示例包含特殊字符", () => {
        expect(RegexPatterns.Password.test("ABC@abc123456")).toBe(true)
    })

    it("不足6位", () => {
        expect(RegexPatterns.Password.test("Aab12")).toBe(false)
    })

    it("超过64位", () => {
        expect(RegexPatterns.Password.test("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890000")).toBe(false)
    })

    it("纯大写字母", () => {
        expect(RegexPatterns.Password.test("ABCDEFGHIJKLMNO")).toBe(false)
    })
    it("纯小写字母", () => {
        expect(RegexPatterns.Password.test("abcdefghijklmno")).toBe(false)
    })

    it("纯数字", () => {
        expect(RegexPatterns.Password.test("123456789")).toBe(false)
    })

    it("不含大写", () => {
        expect(RegexPatterns.Password.test("abc123456789")).toBe(false)
    })

    it("不含小写", () => {
        expect(RegexPatterns.Password.test("ABC123456789")).toBe(false)
    })

    it("不含数字", () => {
        expect(RegexPatterns.Password.test("ABCDabcd")).toBe(false)
    })
})

describe("RegexPatterns.LoginName", () => {
    it("正确示例", () => {
        expect(RegexPatterns.LoginName.test("user123")).toBe(true)
    })
    it("数字开头", () => {
        expect(RegexPatterns.LoginName.test("1username")).toBe(false)
    })
    it("不足6个字符", () => {
        expect(RegexPatterns.LoginName.test("user1")).toBe(false)
    })
    it("大于20字符", () => {
        expect(RegexPatterns.LoginName.test("user123456789user123456789")).toBe(false)
    })
    it("有大写字符", () => {
        expect(RegexPatterns.LoginName.test("USER123")).toBe(false)
    })
    it("其他情况", () => {
        expect(RegexPatterns.LoginName.test("非法字符")).toBe(false)
    })

    it("正确示例", () => {
        expect(RegexPatterns.LoginName.test("test@jiaopengzi.com")).toBe(true)
    })

    it("不包含@", () => {
        expect(RegexPatterns.LoginName.test("testjiaopengzi.com")).toBe(false)
    })

    it("不包含.", () => {
        expect(RegexPatterns.LoginName.test("test@jiaopengzicom")).toBe(false)
    })

    it("不包含@和.", () => {
        expect(RegexPatterns.LoginName.test("testjiaopengzicom")).toBe(true)
    })

    it("大写字母", () => {
        expect(RegexPatterns.LoginName.test("TEST@jiaopengzi.com")).toBe(true)
    })
})

describe("RegexPatterns.DisableSeconds", () => {
    it("正确示例", () => {
        expect(RegexPatterns.DisableSeconds.test("100")).toBe(true)
    })

    it("负数", () => {
        expect(RegexPatterns.DisableSeconds.test("-100")).toBe(false)
    })

    it("零值", () => {
        expect(RegexPatterns.DisableSeconds.test("0")).toBe(false)
    })

    it("小数", () => {
        expect(RegexPatterns.DisableSeconds.test("1.2")).toBe(false)
    })

    it("不是纯数字", () => {
        expect(RegexPatterns.DisableSeconds.test("123abc")).toBe(false)
    })
})

describe("RegexPatterns.Slug", () => {
    it("正确示例字符", () => {
        expect(RegexPatterns.Slug.test("abc100")).toBe(true)
    })

    it("正确示例转义字符", () => {
        expect(RegexPatterns.Slug.test("%E6%B5%8B%E8%AF%95%E6%8F%90%E4%BA%A4")).toBe(true)
    })

    it("正确示例转义带+", () => {
        expect(RegexPatterns.Slug.test("Power+BI")).toBe(true)
    })

    it("正确示例大写字符", () => {
        expect(RegexPatterns.Slug.test("ABC")).toBe(true)
    })

    it("不完整转义", () => {
        expect(RegexPatterns.Slug.test("%E6%B5%")).toBe(false)
    })
})

describe("RegexPatterns.SeoKeyWords", () => {
    it("正确示例", () => {
        expect(RegexPatterns.SeoKeyWords.test("abc,关键字,ABC100")).toBe(true)
    })

    it("正确示例只有一个值", () => {
        expect(RegexPatterns.SeoKeyWords.test("abc")).toBe(true)
    })

    it("正确示例关键字中间有空格", () => {
        expect(RegexPatterns.SeoKeyWords.test("abc test,关键字,abc defg")).toBe(true)
    })

    it("中文逗号", () => {
        expect(RegexPatterns.SeoKeyWords.test("abc，关键字，ABC100")).toBe(false)
    })

    it("开头空格", () => {
        expect(RegexPatterns.SeoKeyWords.test(" abc,关键字,ABC100")).toBe(false)
    })

    it("逗号后面不能有空格即每个关键字不能用空格开头", () => {
        expect(RegexPatterns.SeoKeyWords.test("abc, 关键字, abcdefg")).toBe(false)
    })

    it("结束空格", () => {
        expect(RegexPatterns.SeoKeyWords.test("abc,关键字,ABC100 ")).toBe(false)
    })

    it("结束多余逗号", () => {
        expect(RegexPatterns.SeoKeyWords.test("abc,关键字,ABC100,")).toBe(false)
    })
})

describe("RegexPatterns.ImgURL", () => {
    it("正确示例 png", () => {
        expect(RegexPatterns.ImgURL.test("https://image.jiaopengzi.com/test.png")).toBe(true)
    })

    it("正确示例 jpg", () => {
        expect(RegexPatterns.ImgURL.test("https://image.jiaopengzi.com/test.jpg")).toBe(true)
    })

    it("正确示例 jpeg", () => {
        expect(RegexPatterns.ImgURL.test("https://image.jiaopengzi.com/test.jpeg")).toBe(true)
    })

    it("正确示例 gif", () => {
        expect(RegexPatterns.ImgURL.test("https://image.jiaopengzi.com/test.gif")).toBe(true)
    })

    it("正确示例 webp", () => {
        expect(RegexPatterns.ImgURL.test("https://image.jiaopengzi.com/test.webp")).toBe(true)
    })

    it("正确示例 svg", () => {
        expect(RegexPatterns.ImgURL.test("https://image.jiaopengzi.com/test.svg")).toBe(true)
    })

    it("正确示例 psd", () => {
        expect(RegexPatterns.ImgURL.test("https://image.jiaopengzi.com/test.psd")).toBe(true)
    })

    it("正确示例 bmp", () => {
        expect(RegexPatterns.ImgURL.test("https://image.jiaopengzi.com/test.bmp")).toBe(true)
    })

    it("正确示例 tif", () => {
        expect(RegexPatterns.ImgURL.test("https://image.jiaopengzi.com/test.tif")).toBe(true)
    })

    it("正确示例 png 带参数 =", () => {
        expect(RegexPatterns.ImgURL.test("https://image.jiaopengzi.com/test.png=style/stylename")).toBe(true)
    })

    it("正确示例 png 带参数 !", () => {
        expect(RegexPatterns.ImgURL.test("https://image.jiaopengzi.com/test.png!style/stylename")).toBe(true)
    })

    it("正确示例 png 带参数 ?", () => {
        expect(RegexPatterns.ImgURL.test("https://image.jiaopengzi.com/test.png?style/stylename")).toBe(true)
    })
})

describe("RegexPatterns.IsTrim", () => {
    it("全是空格", () => {
        expect(RegexPatterns.IsTrim.test("  ")).toBe(true)
    })
    it("开头包含1个空格", () => {
        expect(RegexPatterns.IsTrim.test(" abcdefg")).toBe(true)
    })
    it("开头包含多个个空格", () => {
        expect(RegexPatterns.IsTrim.test("   abcdefg")).toBe(true)
    })

    it("结尾包含1个空格", () => {
        expect(RegexPatterns.IsTrim.test("abcdefg ")).toBe(true)
    })

    it("结尾包含多个空格", () => {
        expect(RegexPatterns.IsTrim.test("abcdefg   ")).toBe(true)
    })

    it("首尾包含1个空格", () => {
        expect(RegexPatterns.IsTrim.test(" abcdefg ")).toBe(true)
    })

    it("首尾包含多个空格", () => {
        expect(RegexPatterns.IsTrim.test("   abcdefg   ")).toBe(true)
    })

    it("首尾不包含空格中间有一个空格", () => {
        expect(RegexPatterns.IsTrim.test("abcd efg")).toBe(false)
    })

    it("首尾不包含空格中间有多个连续空格", () => {
        expect(RegexPatterns.IsTrim.test("abcd   efg")).toBe(false)
    })
    it("首尾不包含空格中间有多个间隔空格", () => {
        expect(RegexPatterns.IsTrim.test("abc d   efg")).toBe(false)
    })
    it("不包含空格", () => {
        expect(RegexPatterns.IsTrim.test("abcdefg")).toBe(false)
    })
})
