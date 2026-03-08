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
