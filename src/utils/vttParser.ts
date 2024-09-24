/**
 * @Author       : jiaopengzi
 * @Date         : 2024-09-23 20:10:42
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-09-24 11:21:10
 * @FilePath     : \blog-client\src\utils\vttParser.ts
 * @Description  : 字幕解析器
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import { parseTimeSegments } from '@/utils/dateTime'

/**
 * @description: 解析vtt文件 得到字幕数组
 * @param url: 字幕文件地址
 * @return {Array<{ start: number; end: number; text: string }>} 字幕数组 start: 开始时间(秒) end: 结束时间(秒) text: 字幕文本
 */

export const parseVTT = (function () {
  // 正则表达式匹配字幕(vtt文件)
  const regex =
    /(\d{2}):(\d{2}):(\d{2})\.(\d{3}) --> (\d{2}):(\d{2}):(\d{2})\.(\d{3})\s+([\s\S]*?)(?=\r?\n\r?\n|\r?\n*$)/g

  return async function parseVTT(
    url: string,
  ): Promise<Array<{ start: number; end: number; text: string }>> {
    const response = await fetch(url)
    const vttText = await response.text()
    const cues = [] as Array<{ start: number; end: number; text: string }>

    let match
    while ((match = regex.exec(vttText)) !== null) {
      cues.push({
        start: parseTimeSegments(match[1], match[2], match[3], match[4]),
        end: parseTimeSegments(match[5], match[6], match[7], match[8]),
        text: match[9].trim(),
      })
    }

    return cues
  }
})()
