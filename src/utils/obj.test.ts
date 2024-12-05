/**
 * @Author       : jiaopengzi
 * @Date         : 2024-11-25 22:23:57
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-05 11:04:51
 * @FilePath     : \blog-client\src\utils\obj.test.ts
 * @Description  : 对象相关工具函数测试
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import { describe, it, expect } from "vitest"
import { deepClone, deepEqual, getUpdatedFields, getNumberKeyOfTops } from "./obj"

enum PostStatusCode {
    Draft = 1, // 草稿
    Private = 2, // 私密
    Future = 3, // 定时
    Password = 4, // 密码
    Publish = 5, // 发布
    Expired = 6, // 过期
}

enum CommentStatusCode {
    Close = 1, // 关闭
    Open = 2, // 开启
}

interface PgSqlDateTime {
    Time: Date | null // 禁用到期时间
    Valid: boolean
}

interface UpsertPostForm {
    id: string // 文章ID
    post_author: string // 文章作者
    post_content: string // 文章内容
    post_title: string // 文章标题
    post_status: PostStatusCode // 文章状态 0 草稿 1 待审核 2 私密 3 定时发布 4 已发布 5 过期 6 回收站
    post_password: string // 文章密码
    comment_status: CommentStatusCode // 评论是否开启 0 关闭 1 开启
    price: string // 价格
    seo_title: string // SEO标题
    seo_keywords: string // SEO关键词
    seo_description: string // SEO描述
    slug: string // 别名
    thumbnail: string // 缩略图
    category_ids: string[] // 分类id
    tag_names: string[] // 标签
    pay_roles: string[] // 付费角色
    post_push_time: PgSqlDateTime // 发布时间
    post_expired_time: PgSqlDateTime // 过期时间
}

const fixedDate = new Date("2024-11-25T12:13:38.231Z")
const newFixedDate = new Date("2024-11-25T12:13:38.230Z")

// 原对象
const sourceObj: UpsertPostForm = {
    id: "1",
    post_author: "1",
    post_content: "content",
    post_title: "title",
    post_status: PostStatusCode.Publish,
    post_password: "password",
    comment_status: CommentStatusCode.Open,
    price: "100",
    seo_title: "seo_title",
    seo_keywords: "seo_keywords",
    seo_description: "seo_description",
    slug: "slug",
    thumbnail: "thumbnail",
    category_ids: ["1"],
    tag_names: ["tag"],
    pay_roles: ["role"],
    post_push_time: { Time: fixedDate, Valid: true },
    post_expired_time: { Time: fixedDate, Valid: true },
}

// 字段值相等对象
const equalObj: UpsertPostForm = {
    id: "1",
    post_author: "1",
    post_content: "content",
    post_title: "title",
    post_status: PostStatusCode.Publish,
    post_password: "password",
    comment_status: CommentStatusCode.Open,
    price: "100",
    seo_title: "seo_title",
    seo_keywords: "seo_keywords",
    seo_description: "seo_description",
    slug: "slug",
    thumbnail: "thumbnail",
    category_ids: ["1"],
    tag_names: ["tag"],
    pay_roles: ["role"],
    post_push_time: { Time: fixedDate, Valid: true },
    post_expired_time: { Time: fixedDate, Valid: true },
}

// 字段值不相等对象
const noEqualObj: UpsertPostForm = {
    id: "1",
    post_author: "1",
    post_content: "content2",
    post_title: "title",
    post_status: PostStatusCode.Publish,
    post_password: "password",
    comment_status: CommentStatusCode.Open,
    price: "100",
    seo_title: "seo_title",
    seo_keywords: "seo_keywords",
    seo_description: "seo_description",
    slug: "slug",
    thumbnail: "thumbnail",
    category_ids: ["1"],
    tag_names: ["tag"],
    pay_roles: ["role"],
    post_push_time: { Time: fixedDate, Valid: true },
    post_expired_time: { Time: newFixedDate, Valid: false },
}

describe("getUpdatedFields", () => {
    it("sourceObj与equalObj相同即没有更新", () => {
        const updatedFields = getUpdatedFields(sourceObj, equalObj, "id")

        expect(updatedFields).toEqual({})
    })

    it("sourceObj与noEqualObj不相同即有更新", () => {
        const updatedFields = getUpdatedFields(sourceObj, noEqualObj, "id")

        expect(updatedFields).toEqual({
            post_content: "content2",
            post_expired_time: { Time: newFixedDate, Valid: false },
        })
    })
})

describe("deepClone", () => {
    it("克隆对象", () => {
        const clonedObj = deepClone(sourceObj)
        expect(clonedObj).toEqual(sourceObj) // 确保值相等
        expect(clonedObj).not.toBe(sourceObj) // 确保不是同一个引用
    })

    it("克隆数组对象", () => {
        const arr: UpsertPostForm[] = [sourceObj, equalObj, noEqualObj]
        const clonedArr = deepClone(arr)
        expect(clonedArr).toEqual(arr)
        expect(clonedArr).not.toBe(arr)
        expect(clonedArr[0]).not.toBe(arr[0])
    })
})

describe("deepEqual", () => {
    it("深度比较相等", () => {
        const obj2: UpsertPostForm = { ...sourceObj }
        expect(deepEqual(sourceObj, obj2)).toBe(true) // 确保值相等
    })

    it("更新字段后不相等", () => {
        const obj2: UpsertPostForm = {
            ...sourceObj,
            post_title: "different title",
        }
        expect(deepEqual(sourceObj, obj2)).toBe(false)
    })

    it("处理 null and undefined", () => {
        expect(deepEqual(null, null)).toBe(true)
        expect(deepEqual(undefined, undefined)).toBe(true)
        expect(deepEqual(null, undefined)).toBe(false)
        expect(deepEqual({ a: 1 }, null)).toBe(false)
    })
})

describe("deepClone", () => {
    it("克隆对象", () => {
        const clonedObj = deepClone(sourceObj)
        expect(clonedObj).toEqual(sourceObj) // 确保值相等
        expect(clonedObj).not.toBe(sourceObj) // 确保不是同一个引用
    })

    it("克隆数组对象", () => {
        const arr: UpsertPostForm[] = [sourceObj, equalObj, noEqualObj]
        const clonedArr = deepClone(arr)
        expect(clonedArr).toEqual(arr)
        expect(clonedArr).not.toBe(arr)
        expect(clonedArr[0]).not.toBe(arr[0])
    })

    it("克隆 Date 对象", () => {
        const date = new Date()
        const clonedDate = deepClone(date)
        expect(clonedDate).toEqual(date)
        expect(clonedDate).not.toBe(date)
    })

    it("克隆 RegExp 对象", () => {
        const regex = /test/i
        const clonedRegex = deepClone(regex)
        expect(clonedRegex).toEqual(regex)
        expect(clonedRegex).not.toBe(regex)
    })

    it("克隆 Map 对象", () => {
        const map = new Map<string, any>([
            ["key1", "value1"],
            ["key2", { a: 1, b: 2 }],
        ])
        const clonedMap = deepClone(map)
        expect(clonedMap).toEqual(map)
        expect(clonedMap).not.toBe(map)
    })

    it("克隆 Set 对象", () => {
        const set = new Set<any>(["value1", { a: 1, b: 2 }])
        const clonedSet = deepClone(set)
        expect(clonedSet).toEqual(set)
        expect(clonedSet).not.toBe(set)
    })
})

describe("getNumberKeys", () => {
    it("获取对象中的数字类型的key数组", () => {
        const obj = {
            a: 1,
            b: "string",
            c: 2,
            d: true,
            e: 3,
        }
        const numberKeys = getNumberKeyOfTops(obj)
        expect(numberKeys).toEqual(["a", "c", "e"])
    })

    it("对象中没有数字类型的key", () => {
        const obj = {
            a: "string",
            b: true,
            c: null,
            d: undefined,
        }
        const numberKeys = getNumberKeyOfTops(obj)
        expect(numberKeys).toEqual([])
    })

    it("对象为空", () => {
        const obj = {}
        const numberKeys = getNumberKeyOfTops(obj)
        expect(numberKeys).toEqual([])
    })

    it("对象中包含嵌套对象", () => {
        const obj = {
            a: 1,
            b: {
                c: 2,
                d: "string",
            },
            e: 3,
        }
        const numberKeys = getNumberKeyOfTops(obj)
        expect(numberKeys).toEqual(["a", "e"])
    })
})
