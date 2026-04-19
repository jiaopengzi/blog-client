import { ref } from "vue"
import { describe, expect, it, vi } from "vitest"

vi.mock("@/components/hooks/useVideoWatermark", () => ({
    useVideoWatermark: vi.fn(),
}))

vi.mock("@/api/video/getVideosIsFree", () => ({
    getVideosIsFreeAPI: vi.fn().mockResolvedValue({
        data: {
            code: 1322,
            data: [],
        },
    }),
}))

vi.mock("@/api/video/getUserPostVideoProgress", () => ({
    getUserPostVideoProgressAPI: vi.fn().mockResolvedValue({
        data: {
            code: 0,
        },
    }),
}))

vi.mock("@/api/video/getUserVideoProgress", () => ({
    getUserVideoProgressAPI: vi.fn().mockResolvedValue({
        data: {
            code: 0,
        },
    }),
}))

vi.mock("@/api/video/upsertUserPostVideoProgress", () => ({
    upsertUserPostVideoProgressAPI: vi.fn(),
}))

vi.mock("@/stores/user", () => ({
    useUserStore: () => ({
        isLogin: false,
    }),
}))

import { usePayVideo } from "./hooks"

describe("usePayVideo", () => {
    it("管理员视频预览会将 isAdmin 写入播放器状态", () => {
        const { state } = usePayVideo(ref([]), ref("post-1"), ref(true))

        expect(state.isAdmin).toBe(true)
        expect(state.postId).toBe("post-1")
    })

    it("非管理员视频预览默认不启用管理员接口", () => {
        const { state } = usePayVideo(ref([]), ref("post-1"), ref(false))

        expect(state.isAdmin).toBe(false)
        expect(state.postId).toBe("post-1")
    })

    it("postId 为空时也会默认选中首个视频", async () => {
        const treeList = ref([
            {
                id: 1,
                label: "章节",
                is_chapter: true,
                children: [
                    {
                        id: 2,
                        label: "第一集",
                        is_chapter: false,
                        file_id_hash: "m-13-8e72860c",
                        video_order: 1,
                    },
                ],
            },
        ])

        const { state, fetchData } = usePayVideo(treeList, ref(""), ref(true))

        await fetchData()

        expect(state.videoID).toBe("m-13-8e72860c")
        expect(state.playStatus).toBe("paused")
    })
})
