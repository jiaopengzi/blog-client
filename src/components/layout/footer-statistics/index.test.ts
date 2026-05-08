/**
 * FilePath    : blog-client\src\components\layout\footer-statistics\index.test.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 公开页统计脚本挂载器单元测试
 */

import { flushPromises, mount } from "@vue/test-utils"
import { createPinia, setActivePinia } from "pinia"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { useOptionsStore } from "@/stores/options"

import FooterStatistics from "./index.vue"

const { enableFooterStatisticsScriptMock, disableFooterStatisticsScriptMock } = vi.hoisted(() => ({
    enableFooterStatisticsScriptMock: vi.fn(),
    disableFooterStatisticsScriptMock: vi.fn(),
}))

vi.mock("@/utils/footerStatistics", () => ({
    enableFooterStatisticsScript: enableFooterStatisticsScriptMock,
    disableFooterStatisticsScript: disableFooterStatisticsScriptMock,
}))

describe("FooterStatistics", () => {
    let pinia: ReturnType<typeof createPinia>

    beforeEach(() => {
        pinia = createPinia()
        setActivePinia(pinia)
        enableFooterStatisticsScriptMock.mockReset()
        disableFooterStatisticsScriptMock.mockReset()
    })

    afterEach(() => {
        vi.restoreAllMocks()
    })

    it("公开页组件卸载时不会主动禁用统计脚本, 避免公开页切换重复加载", async () => {
        const optionsStore = useOptionsStore()
        optionsStore.footer_statistics_code = "<script>console.log('analytics')</script>"

        const wrapper = mount(FooterStatistics, {
            global: {
                plugins: [pinia],
            },
        })

        await flushPromises()

        expect(enableFooterStatisticsScriptMock).toHaveBeenCalledTimes(1)
        expect(enableFooterStatisticsScriptMock).toHaveBeenCalledWith(optionsStore.footer_statistics_code)

        wrapper.unmount()

        expect(disableFooterStatisticsScriptMock).not.toHaveBeenCalled()
    })

    it("统计脚本为空时不会触发加载逻辑", async () => {
        const optionsStore = useOptionsStore()
        optionsStore.footer_statistics_code = "   "

        mount(FooterStatistics, {
            global: {
                plugins: [pinia],
            },
        })

        await flushPromises()

        expect(enableFooterStatisticsScriptMock).not.toHaveBeenCalled()
        expect(disableFooterStatisticsScriptMock).not.toHaveBeenCalled()
    })
})
