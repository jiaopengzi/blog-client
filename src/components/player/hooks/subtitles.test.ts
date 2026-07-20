/**
 * FilePath    : blog-client\src\components\player\hooks\subtitles.test.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 字幕 hook 单元测试
 */

import { describe, expect, it } from "vitest"

import { applyDefaultSubtitleCueSettings, getSubtitleCueStyle } from "./subtitles"

interface TestCue {
    align: AlignSetting
    line: LineAndPositionSetting
    position: LineAndPositionSetting
    snapToLines: boolean
    text: string
}

/**
 * 创建用于验证字幕默认布局的 WebVTT cue 替身.
 * @param overrides 需要覆盖的 cue 布局属性.
 * @returns 可供字幕布局函数处理的 cue.
 */
function createCue(overrides: Partial<TestCue> = {}): TestCue {
    return {
        align: "center",
        line: "auto",
        position: "auto",
        snapToLines: true,
        text: "字幕文本",
        ...overrides,
    }
}

/**
 * 创建包含指定 cue 的文本轨道替身.
 * @param cues 字幕 cue 列表.
 * @returns 可供字幕布局函数处理的文本轨道.
 */
function createTextTrack(cues: TestCue[]): TextTrack {
    return { cues } as unknown as TextTrack
}

describe("applyDefaultSubtitleCueSettings", () => {
    it("为未声明布局的字幕应用 88% 居中默认设置", () => {
        const cue = createCue()

        applyDefaultSubtitleCueSettings(createTextTrack([cue]))

        expect(cue).toEqual({
            align: "center",
            line: 88,
            position: 50,
            snapToLines: false,
            text: "字幕文本",
        })
    })

    it("保留字幕文件已有的自定义布局", () => {
        const cue = createCue({
            align: "start",
            line: 72,
            position: 20,
            snapToLines: false,
        })

        applyDefaultSubtitleCueSettings(createTextTrack([cue]))

        expect(cue).toEqual({
            align: "start",
            line: 72,
            position: 20,
            snapToLines: false,
            text: "字幕文本",
        })
    })

    it("保持多行字幕和内联标记文本不变", () => {
        const cue = createCue({ text: "第一行\n<b>第二行</b>" })
        const textTrack = createTextTrack([cue])

        applyDefaultSubtitleCueSettings(textTrack)

        expect(cue.text).toBe("第一行\n<b>第二行</b>")
    })
})

describe("getSubtitleCueStyle", () => {
    it("在浏览器未提供锚点属性时按 88% 和 50% 居中定位", () => {
        const cue = {
            ...createCue({ line: 88, position: 50, snapToLines: false }),
            size: 100,
            vertical: "",
        } as VTTCue

        expect(getSubtitleCueStyle(cue)).toEqual({
            left: "50%",
            top: "88%",
            maxWidth: "100%",
            textAlign: "center",
            transform: "translate(-50%, -50%)",
            writingMode: "horizontal-tb",
        })
    })

    it("保留用户自定义的行锚点和水平锚点", () => {
        const cue = {
            ...createCue({ align: "end", line: 72, position: 80, snapToLines: false }),
            lineAlign: "end",
            positionAlign: "line-right",
            size: 60,
            vertical: "",
        } as VTTCue

        expect(getSubtitleCueStyle(cue)).toMatchObject({
            left: "80%",
            top: "72%",
            maxWidth: "60%",
            textAlign: "end",
            transform: "translate(-100%, -100%)",
        })
    })
})
