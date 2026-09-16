/**
 * FilePath    : blog-client\src\utils\localStorageJson.test.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : localStorage JSON 工具测试
 */

import { afterEach, beforeEach, describe, expect, it } from "vitest"

import { loadLocalStorageJson, loadLocalStorageRecord, removeLocalStorageJson, saveLocalStorageJson } from "./localStorageJson"

beforeEach(() => {
    localStorage.clear()
})

afterEach(() => {
    localStorage.clear()
})

interface NamedItem {
    name: string
}

/**
 * isNamedItem 判断未知数据是否为测试用 NamedItem.
 * @param value - 待校验数据.
 * @returns true 表示数据包含合法 name 字段.
 */
function isNamedItem(value: unknown): value is NamedItem {
    return Boolean(value) && typeof value === "object" && !Array.isArray(value) && typeof (value as NamedItem).name === "string"
}

describe("localStorageJson", () => {
    it("保存后可以读取 JSON 数据", () => {
        saveLocalStorageJson("json:test", { name: "draft" })

        expect(loadLocalStorageJson<NamedItem>("json:test")).toEqual({ name: "draft" })
    })

    it("JSON 非法或校验失败时返回 null", () => {
        localStorage.setItem("json:test", "{")
        expect(loadLocalStorageJson<NamedItem>("json:test", isNamedItem)).toBeNull()

        localStorage.setItem("json:test", JSON.stringify({ name: 1 }))
        expect(loadLocalStorageJson<NamedItem>("json:test", isNamedItem)).toBeNull()
    })

    it("读取对象集合时会过滤非法条目", () => {
        saveLocalStorageJson("json:record", {
            a: { name: "valid" },
            b: { name: 1 },
        })

        expect(loadLocalStorageRecord("json:record", isNamedItem)).toEqual({
            a: { name: "valid" },
        })
    })

    it("删除后不再读取数据", () => {
        saveLocalStorageJson("json:test", { name: "draft" })

        removeLocalStorageJson("json:test")

        expect(loadLocalStorageJson<NamedItem>("json:test")).toBeNull()
    })
})
