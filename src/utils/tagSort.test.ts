/**
 * FilePath    : blog-client\src\utils\tagSort.test.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : tagSort 工具测试
 */

import { describe, expect, it } from "vitest"

import { type PostCategory } from "@/api/postCategory/view"
import { type PostTag } from "@/api/postTag/view"

import { comparePostTagName, comparePostTaxonomyName, sortPostTagsByCount, sortPostTaxonomiesByCount } from "./tagSort"

describe("comparePostTagName", () => {
    it("中英文混排时应先排英文, 再按中文拼音排序", () => {
        expect(comparePostTagName("Alpha", "beta")).toBeLessThan(0)
        expect(comparePostTagName("beta", "阿里")).toBeLessThan(0)
        expect(comparePostTagName("阿里", "北京")).toBeLessThan(0)
        expect(comparePostTagName("北京", "上海")).toBeLessThan(0)
    })
})

describe("comparePostTaxonomyName", () => {
    it("分类和标签共用同一套中英文混排规则", () => {
        expect(comparePostTaxonomyName("Alpha", "beta")).toBeLessThan(0)
        expect(comparePostTaxonomyName("beta", "阿里")).toBeLessThan(0)
        expect(comparePostTaxonomyName("阿里", "北京")).toBeLessThan(0)
        expect(comparePostTaxonomyName("北京", "上海")).toBeLessThan(0)
    })
})

describe("sortPostTagsByCount", () => {
    it("应先按数量降序排序", () => {
        const tags: PostTag[] = [
            {
                id: "1",
                created_at: "2026-06-08 10:00:00",
                name: "low-count",
                description: "",
                slug: "low-count",
                thumbnail: "",
                order: "0",
                post_count: "1",
                post_count_admin: "1",
                img: { url: "", width: 0, height: 0 },
            },
            {
                id: "2",
                created_at: "2026-06-08 10:00:00",
                name: "high-count",
                description: "",
                slug: "high-count",
                thumbnail: "",
                order: "0",
                post_count: "10",
                post_count_admin: "10",
                img: { url: "", width: 0, height: 0 },
            },
        ]

        expect(sortPostTagsByCount(tags, "post_count").map((item) => item.name)).toEqual(["high-count", "low-count"])
    })

    it("数量相同时应按中英文混排规则排序", () => {
        const tags: PostTag[] = [
            {
                id: "1",
                created_at: "2026-06-08 10:00:00",
                name: "上海",
                description: "",
                slug: "shanghai",
                thumbnail: "",
                order: "0",
                post_count: "8",
                post_count_admin: "8",
                img: { url: "", width: 0, height: 0 },
            },
            {
                id: "2",
                created_at: "2026-06-08 10:00:00",
                name: "beta",
                description: "",
                slug: "beta",
                thumbnail: "",
                order: "0",
                post_count: "8",
                post_count_admin: "8",
                img: { url: "", width: 0, height: 0 },
            },
            {
                id: "3",
                created_at: "2026-06-08 10:00:00",
                name: "阿里",
                description: "",
                slug: "ali",
                thumbnail: "",
                order: "0",
                post_count: "8",
                post_count_admin: "8",
                img: { url: "", width: 0, height: 0 },
            },
            {
                id: "4",
                created_at: "2026-06-08 10:00:00",
                name: "Alpha",
                description: "",
                slug: "alpha",
                thumbnail: "",
                order: "0",
                post_count: "8",
                post_count_admin: "8",
                img: { url: "", width: 0, height: 0 },
            },
            {
                id: "5",
                created_at: "2026-06-08 10:00:00",
                name: "北京",
                description: "",
                slug: "beijing",
                thumbnail: "",
                order: "0",
                post_count: "8",
                post_count_admin: "8",
                img: { url: "", width: 0, height: 0 },
            },
        ]

        expect(sortPostTagsByCount(tags, "post_count").map((item) => item.name)).toEqual(["Alpha", "beta", "阿里", "北京", "上海"])
    })
})

describe("sortPostTaxonomiesByCount", () => {
    it("分类数量相同时应按中英文混排规则排序", () => {
        const categories: PostCategory[] = [
            {
                id: "1",
                created_at: "2026-06-08 10:00:00",
                name: "上海",
                description: "",
                slug: "shanghai",
                thumbnail: "",
                order: "0",
                post_count: "8",
                post_count_admin: "8",
                parent: "0",
                img: { url: "", width: 0, height: 0 },
            },
            {
                id: "2",
                created_at: "2026-06-08 10:00:00",
                name: "beta",
                description: "",
                slug: "beta",
                thumbnail: "",
                order: "0",
                post_count: "8",
                post_count_admin: "8",
                parent: "0",
                img: { url: "", width: 0, height: 0 },
            },
            {
                id: "3",
                created_at: "2026-06-08 10:00:00",
                name: "阿里",
                description: "",
                slug: "ali",
                thumbnail: "",
                order: "0",
                post_count: "8",
                post_count_admin: "8",
                parent: "0",
                img: { url: "", width: 0, height: 0 },
            },
            {
                id: "4",
                created_at: "2026-06-08 10:00:00",
                name: "Alpha",
                description: "",
                slug: "alpha",
                thumbnail: "",
                order: "0",
                post_count: "8",
                post_count_admin: "8",
                parent: "0",
                img: { url: "", width: 0, height: 0 },
            },
            {
                id: "5",
                created_at: "2026-06-08 10:00:00",
                name: "北京",
                description: "",
                slug: "beijing",
                thumbnail: "",
                order: "0",
                post_count: "8",
                post_count_admin: "8",
                parent: "0",
                img: { url: "", width: 0, height: 0 },
            },
        ]

        expect(sortPostTaxonomiesByCount(categories, "post_count_admin").map((item) => item.name)).toEqual(["Alpha", "beta", "阿里", "北京", "上海"])
    })
})
