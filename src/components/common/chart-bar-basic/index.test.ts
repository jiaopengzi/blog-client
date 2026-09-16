/**
 * FilePath    : blog-client\src\components\common\chart-bar-basic\index.test.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 柱状图基础组件自适应测试
 */

import { mount } from "@vue/test-utils"
import { nextTick } from "vue"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import ChartBarBasic from "."

const resizeObserverCallbacks: Array<() => void> = []

vi.mock("@vueuse/core", async (importOriginal) => {
    const actual = await importOriginal<typeof import("@vueuse/core")>()

    return {
        ...actual,
        useResizeObserver: (_target: unknown, callback: () => void) => {
            resizeObserverCallbacks.push(callback)

            return {
                stop: vi.fn(),
            }
        },
    }
})

/**
 * 等待图表完成一次布局更新.
 */
const waitForChartLayout = async () => {
    await nextTick()
    await nextTick()
}

describe("ChartBarBasic", () => {
    beforeEach(() => {
        resizeObserverCallbacks.length = 0

        vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
            callback(0)
            return 1
        })
        vi.stubGlobal("cancelAnimationFrame", vi.fn())
    })

    afterEach(() => {
        vi.unstubAllGlobals()
    })

    it("容器宽度变化后会重新计算柱状图区宽度", async () => {
        const wrapper = mount(ChartBarBasic, {
            props: {
                title: "测试趋势",
                data: [
                    { label: "01", value: 80 },
                    { label: "02", value: 40 },
                ],
                width: 600,
                height: 200,
            },
        })

        const chartContainer = wrapper.get(".chart-container").element as HTMLDivElement
        const bars = wrapper.get(".bars").element as HTMLDivElement

        let containerWidth = 600
        Object.defineProperty(chartContainer, "clientWidth", {
            configurable: true,
            get: () => containerWidth,
        })

        await waitForChartLayout()
        expect(bars.style.width).toBe("600px")

        containerWidth = 900
        resizeObserverCallbacks.at(-1)?.()

        await waitForChartLayout()
        expect(bars.style.width).toBe("900px")
    })
})
