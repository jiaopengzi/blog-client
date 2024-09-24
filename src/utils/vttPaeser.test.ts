/**
 * @FilePath     : \blog-client\src\utils\vttPaeser.test.ts
 * @Description  : parseVTT测试文件
 */
import { expect, test, vi } from 'vitest'
import { parseVTT } from './vttParser'

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
        statusText: 'OK',
        headers: new Headers({ 'Content-Type': 'text/vtt' }),
      },
    ),
  ),
)

test('parseVTT should parse VTT file and return correct subtitles array', async () => {
  const url = 'http://example.com/subtitles.vtt'
  const result = await parseVTT(url)

  expect(result).toEqual([
    { start: 0, end: 5, text: '这是中文字幕' },
    { start: 5, end: 70, text: '我正在测试中文字幕2' },
    { start: 70, end: 130, text: '我正在测试中文字幕3' },
    { start: 130, end: 190, text: '我正在测试中文字幕4' },
    { start: 190, end: 250, text: '我正在测试中文字幕5' },
    { start: 250, end: 310, text: '我正在测试中文字幕6' },
  ])
})
