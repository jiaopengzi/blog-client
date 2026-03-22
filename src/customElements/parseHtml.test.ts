import { describe, expect, it, vi } from "vitest"

vi.mock("@/components/hooks/useVideoWatermark", () => ({
    useVideoWatermark: vi.fn(),
}))

import { parseHtmlToContentParts } from "./parseHtml"
import { Names } from "./registerCustomElements"

describe("parseHtmlToContentParts", () => {
    it("管理员视频预览会将 isAdmin 透传给播放器状态", () => {
        const parts = parseHtmlToContentParts('<video-player video-type="hls" id="m-13-8e72860c"></video-player>', "post-1", true)

        expect(parts).toHaveLength(1)
        expect(parts[0]?.type).toBe(Names.VideoPlayer)
        expect(parts[0]?.content).toMatchObject({
            isAdmin: true,
            postId: "post-1",
            videoID: "m-13-8e72860c",
        })
    })

    it("非管理员预览默认不启用管理员视频接口", () => {
        const parts = parseHtmlToContentParts('<video-player video-type="hls" id="m-13-8e72860c"></video-player>', "post-1")

        expect(parts[0]?.content).toMatchObject({
            isAdmin: false,
            postId: "post-1",
        })
    })
})

describe("power-bi 自定义元素解析", () => {
    it("解析单个 power-bi 元素，包含有效的 src 属性", () => {
        const html = '<power-bi src="https://app.powerbi.com/reportEmbed?reportId=abc123" maskcolor="#ffffff"></power-bi>'
        const parts = parseHtmlToContentParts(html, "post-1")

        expect(parts).toHaveLength(1)
        expect(parts[0]?.type).toBe("power-bi")
        expect(parts[0]?.content).toMatchObject({
            src: "https://app.powerbi.com/reportEmbed?reportId=abc123",
            maskcolor: "#ffffff",
        })
    })

    it("解析多个内容混合的 power-bi 元素", () => {
        const html = '<p>前置文本</p><power-bi src="https://app.powerbi.com/reportEmbed?reportId=xyz789" maskcolor="#abc"></power-bi><p>后置文本</p>'
        const parts = parseHtmlToContentParts(html, "post-1")

        expect(parts).toHaveLength(3)
        expect(parts[1]?.type).toBe("power-bi")
        expect(parts[1]?.content).toMatchObject({
            src: "https://app.powerbi.com/reportEmbed?reportId=xyz789",
            maskcolor: "#abc",
        })
    })

    it("解析 power-bi 元素，空 src 属性", () => {
        const html = '<power-bi src="" maskcolor=""></power-bi>'
        const parts = parseHtmlToContentParts(html, "post-1")

        expect(parts).toHaveLength(1)
        expect(parts[0]?.type).toBe("power-bi")
        expect(parts[0]?.content).toMatchObject({
            src: "",
            maskcolor: "",
        })
    })

    it("解析缺省 maskcolor 属性时保持属性不存在", () => {
        const html = '<power-bi src="https://app.powerbi.com/reportEmbed?reportId=maskless"></power-bi>'
        const parts = parseHtmlToContentParts(html, "post-1")
        const content = parts[0]?.content as { src: string; maskcolor?: string } | undefined

        expect(content).toMatchObject({
            src: "https://app.powerbi.com/reportEmbed?reportId=maskless",
        })
        expect(content?.maskcolor).toBeUndefined()
    })
})
