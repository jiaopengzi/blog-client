import { mount } from "@vue/test-utils"
import { defineComponent, reactive, ref } from "vue"
import { describe, expect, it, vi } from "vitest"

import { IconKeys } from "@/components/common/icons"

import Controls from "."
import { createDefaultPlayerState } from "../../utils"

vi.mock("@vueuse/core", async (importOriginal) => {
    const actual = await importOriginal<typeof import("@vueuse/core")>()

    return {
        ...actual,
        useMagicKeys: () =>
            new Proxy(
                {},
                {
                    get: () => ref(false),
                },
            ),
    }
})

vi.mock("@/components/hooks/useDelayedToggle", () => ({
    useDelayedToggle: () => ({
        isVisible: ref(false),
        show: vi.fn(),
        hide: vi.fn(),
        toggle: vi.fn(),
        destroy: vi.fn(),
    }),
}))

const JIconStub = defineComponent({
    name: "JIcon",
    props: {
        name: {
            type: String,
            required: true,
        },
        customClass: {
            type: String,
            default: "",
        },
    },
    template: '<span class="j-icon-stub" :data-name="name" :data-custom-class="customClass"></span>',
})

describe("VideoControls", () => {
    it("仅播放器全屏按钮会根据 isFullScreen 状态切换退出全屏图标, 网页全屏按钮保持不变", async () => {
        const playerState = reactive(createDefaultPlayerState())
        const wrapper = mount(Controls, {
            props: {
                playerState,
            },
            global: {
                stubs: {
                    ProgressBar: true,
                    VolumeBar: true,
                    VideoSetting: true,
                    JIcon: JIconStub,
                },
            },
        })

        const getIcons = () => wrapper.findAll(".j-icon-stub").map((item) => item.attributes("data-name"))

        expect(getIcons()).toContain(IconKeys.WebFullscreen)
        expect(getIcons()).toContain(IconKeys.Fullscreen)
        expect(getIcons()).not.toContain(IconKeys.FullscreenExit)

        playerState.isFullScreen = true
        await wrapper.vm.$nextTick()

        expect(getIcons()).toContain(IconKeys.WebFullscreen)
        expect(getIcons()).toContain(IconKeys.FullscreenExit)
        expect(getIcons()).not.toContain(IconKeys.Fullscreen)
    })
})
