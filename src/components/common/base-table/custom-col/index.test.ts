/**
 * FilePath    : blog-client\src\components\common\base-table\custom-col\index.test.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : CustomCol 分类与标签渲染测试
 */

import { mount } from "@vue/test-utils"
import { defineComponent, h } from "vue"
import { describe, expect, it, vi } from "vitest"

import type { PostTag } from "@/api/postTag/view"
import { sortPostTaxonomiesByCount } from "@/utils/tagSort"

vi.mock("@/components/common/comment-markdown-preview", () => ({
    default: {
        name: "CommentMarkdownPreview",
        render: () => null,
    },
}))

import CustomCol from "./index.vue"

let currentRow: Record<string, unknown> = {}

const ElTableColumnStub = defineComponent({
    name: "ElTableColumn",
    /**
     * 提供带 row scope 的最小列桩组件.
     * @param _props - 组件属性.
     * @param context - setup 上下文.
     * @returns 渲染函数.
     */
    setup(_props, { slots }) {
        return () => h("div", { class: "el-table-column-stub" }, slots.default?.({ row: currentRow }))
    },
})

const TagItemStub = defineComponent({
    name: "TagItem",
    props: {
        tagData: {
            type: Object,
            required: true,
        },
    },
    /**
     * 渲染最小标签桩, 便于断言输出顺序.
     * @param props - 组件属性.
     * @returns 渲染函数.
     */
    setup(props) {
        return () => h("span", { class: "tag-item-stub" }, (props.tagData as PostTag).name)
    },
})

/**
 * 生成用于排序渲染测试的标签数据.
 * @returns 未排序的标签数组.
 */
function createTags(): PostTag[] {
    return [
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
    ]
}

describe("CustomCol", () => {
    it("分类或标签列存在排序钩子时应按排序结果渲染", () => {
        currentRow = {
            tags: createTags(),
        }

        const wrapper = mount(CustomCol, {
            props: {
                col: {
                    prop: "tags",
                    label: "标签",
                    isTags: true,
                    itemSorter: (items: Array<PostTag>) => sortPostTaxonomiesByCount(items, "post_count_admin"),
                },
            },
            global: {
                stubs: {
                    ElTableColumn: ElTableColumnStub,
                    TagItem: TagItemStub,
                },
            },
        })

        expect(wrapper.findAll(".tag-item-stub").map((item) => item.text())).toEqual(["Alpha", "beta", "阿里", "上海"])
    })
})
