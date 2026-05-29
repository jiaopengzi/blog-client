import { describe, expect, it } from "vitest"

import { sortPostCountByMonthDesc, type PostCountByMonth } from "./getPostCountByMonth"

describe("sortPostCountByMonthDesc", () => {
    it("按年月倒序排列月度统计", () => {
        const input: PostCountByMonth[] = [
            { year: 2024, month: 12, count: 1 },
            { year: 2026, month: 1, count: 2 },
            { year: 2025, month: 11, count: 3 },
            { year: 2026, month: 5, count: 4 },
        ]

        const result = sortPostCountByMonthDesc(input)

        expect(result.map((item) => `${item.year}-${item.month}`)).toEqual(["2026-5", "2026-1", "2025-11", "2024-12"])
    })

    it("不修改原数组顺序", () => {
        const input: PostCountByMonth[] = [
            { year: 2024, month: 12, count: 1 },
            { year: 2026, month: 5, count: 4 },
        ]

        sortPostCountByMonthDesc(input)

        expect(input.map((item) => `${item.year}-${item.month}`)).toEqual(["2024-12", "2026-5"])
    })
})
