/**
 * @FilePath     : \blog-client\src\utils\vttParse.test.ts
 * @Description  : parseVTT测试文件
 */
import { describe, it, expect, test, vi } from "vitest"
import { parseVTT, isWebvtt } from "./vttParse"

// Mock fetch to return the VTT content
global.fetch = vi.fn(() =>
    Promise.resolve(
        new Response(
            `\
WEBVTT

1
00:00:00.000 --> 00:00:05.000
这是中文字幕

2
00:00:05.000 --> 00:01:10.000
我正在测试中文字幕2

3
00:01:10.000 --> 00:02:10.000
我正在测试中文字幕3

4
00:02:10.000 --> 00:03:10.000
我正在测试中文字幕4

5
00:03:10.000 --> 00:04:10.000
我正在测试中文字幕5

6
00:04:10.000 --> 00:05:10.000
我正在测试中文字幕6`,
            {
                status: 200,
                statusText: "OK",
                headers: new Headers({ "Content-Type": "text/vtt" }),
            },
        ),
    ),
)

test("parseVTT should parse VTT file and return correct subtitles array", async () => {
    const url = "http://example.com/subtitles.vtt"
    const result = await parseVTT(url)

    expect(result).toEqual([
        { start: 0, end: 5, text: "这是中文字幕" },
        { start: 5, end: 70, text: "我正在测试中文字幕2" },
        { start: 70, end: 130, text: "我正在测试中文字幕3" },
        { start: 130, end: 190, text: "我正在测试中文字幕4" },
        { start: 190, end: 250, text: "我正在测试中文字幕5" },
        { start: 250, end: 310, text: "我正在测试中文字幕6" },
    ])
})

describe("isWebvtt", () => {
    const testCases = [
        {
            name: "基本的VTT内容",
            content: `WEBVTT

00:01.000 --> 00:04.000
- Never drink liquid nitrogen.

00:05.000 --> 00:09.000
- It will perforate your stomach.
- You could die.`,
            expected: [true, ""],
        },
        {
            name: "最简单的VTT内容",
            content: `WEBVTT `,
            expected: [true, ""],
        },
        {
            name: "只有WEBVTT头部和标题",
            content: `WEBVTT - This file has no cues.`,
            expected: [true, ""],
        },
        {
            name: "有文本标题和cue的通用WebVTT",
            content: `WEBVTT - This file has cues.

14
00:01:14.815 --> 00:01:18.114
- What?
- Where are we now?

15
00:01:18.171 --> 00:01:20.991
- This is big bat country.

16
00:01:21.058 --> 00:01:23.868
- [ Bats Screeching ]
- They won't get in your hair. They're after the bugs.`,
            expected: [true, ""],
        },
        {
            name: "通用注释用法",
            content: `WEBVTT - Translation of that film I like

NOTE
This translation was done by Kyle so that
some friends can watch it with their parents.

1
00:02:15.000 --> 00:02:20.000
- Ta en kopp varmt te.
- Det är inte varmt.

2
00:02:20.000 --> 00:02:25.000
- Har en kopp te.
- Det smakar som te.

NOTE This last line may not translate well.

3
00:02:25.000 --> 00:02:30.000
- Ta en kopp`,
            expected: [true, ""],
        },
        {
            name: "WebVTT文件自身中定义样式",
            content: `WEBVTT

STYLE
::cue {
  background-image: linear-gradient(to bottom, dimgray, lightgray);
  color: papayawhip;
}
/* Style blocks cannot use blank lines nor "dash dash greater than" */

NOTE comment blocks can be used between style blocks.

STYLE
::cue(b) {
  color: peachpuff;
}

00:00:00.000 --> 00:00:10.000
- Hello <b>world</b>.

NOTE style blocks cannot appear after the first cue.`,
            expected: [true, ""],
        },
        {
            name: "无任何VTT格式的随机文本",
            content: `Some random text
without any VTT format`,
            expected: [false, "字幕需要以 WEBVTT 开头"],
        },
        {
            name: "空字符串",
            content: ``,
            expected: [false, "字幕内容不能为空"],
        },
        {
            name: "不正确的时间分割符号",
            content: `WEBVTT

00:01.000 -- 00:04.000
- Never drink liquid nitrogen.

00:05.000 -- 00:09.000
- It will perforate your stomach.
- You could die.`,
            expected: [false, "时间表达式中需要 --> 分隔符"],
        },
        {
            name: "不正确的时间表达式",
            content: `WEBVTT

00:01.000 --> 00:04
- Never drink liquid nitrogen.

00:05 --> 00:09.000
- It will perforate your stomach.
- You could die.`,
            expected: [false, "时间格式错误，支持 hh:mm:ss.mmm, mm:ss.mmm, ss.mmm"],
        },
        {
            name: "中文VTT",
            content: `WEBVTT

1
00:00:00.000 --> 00:00:05.000
这是中文字幕

2
00:00:05.000 --> 00:01:10.000
我正在测试中文字幕2

3
00:01:10.000 --> 00:02:10.000
我正在测试中文字幕3

4
00:02:10.000 --> 00:03:10.000
我正在测试中文字幕4

5
00:03:10.000 --> 00:04:10.000
我正在测试中文字幕5

6
00:04:10.000 -- 00:05:10.000
我正在测试中文字幕6`,
            expected: [false, "时间表达式中需要 --> 分隔符"],
        },
        {
            name: "空字幕",
            content: `WEBVTT

1
00:00:00.000 --> 00:00:05.000
这是中文字幕

2
00:00:05.000 --> 00:01:10.000


`,
            expected: [false, "时间表达式后需要有字幕内容,不能为空"],
        },
    ]

    testCases.forEach(({ name, content, expected }) => {
        it(name, () => {
            const result = isWebvtt(content)
            expect(result).toEqual(expected)
        })
    })
})
