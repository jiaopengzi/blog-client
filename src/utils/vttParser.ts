/**
 * @Author       : jiaopengzi
 * @Date         : 2024-09-23 20:10:42
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-10-08 18:10:05
 * @FilePath     : \blog-client\src\utils\vttParser.ts
 * @Description  : 字幕解析器
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import { parseTimeSegments } from '@/utils/dateTime'
import { getSubtitlesURL } from '@/api/video/getSubtitles'
import { Language, type Subtitles, type SubtitlesItem } from '@/stores/player'

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
    url: string
  ): Promise<Array<{ start: number; end: number; text: string }>> {
    const response = await fetch(url)
    const vttText = await response.text()
    const cues = [] as Array<{ start: number; end: number; text: string }>

    let match
    while ((match = regex.exec(vttText)) !== null) {
      cues.push({
        start: parseTimeSegments(match[1], match[2], match[3], match[4]),
        end: parseTimeSegments(match[5], match[6], match[7], match[8]),
        text: match[9].trim()
      })
    }

    return cues
  }
})()

/**
 * 校验给定的字符串是否符合 WebVTT 格式。
 *
 * @param {string} content - 要校验的字符串内容。
 * @returns {[boolean, string]} - 返回一个元组，包含校验结果和错误信息。
 *   - 第一个元素是布尔值，表示是否符合 WebVTT 格式。
 *   - 第二个元素是字符串，包含错误信息，如果符合格式则为空字符串。
 *
 * 校验规则：
 * 1. 内容不能为空。
 * 2. 如果只有一行，必须以 "WEBVTT" 开头。
 * 3. 如果有多行，第一行必须以 "WEBVTT" 开头。
 * 4. 去掉 NOTE 和 STYLE 块后，内容必须包含时间表达式。
 * 5. 时间表达式必须包含 "-->"，并且时间格式必须为 hh:mm:ss.mmm、mm:ss.mmm 或 ss.mmm。
 * 6. 每个时间表达式后必须有字幕内容，不能为空。
 */
export const isWebvtt = (function () {
  // 匹配 NOTE 和 STYLE 块
  const reNoteStyle = /(NOTE[\s\S]*?(\r?\n){2}|STYLE[\s\S]*?(\r?\n){2})/g

  // 匹配时间表达式,中间符号 --> 在后续判断 支持的时间格式包括 hh:mm:ss.mmm, mm:ss.mmm, ss.mmm
  const reTimeExpression =
    /\b(?:\d{2}:)?(?:\d{2}:)?\d{2}\.\d{3}.*(?:\d{2}:)?(?:\d{2}:)?\d{2}\.\d{3}\b|.*-->.*/g

  // 匹配时间格式 hh:mm:ss.mmm, mm:ss.mmm, ss.mmm
  const reTimeFormat = /^(?:\d{2}:)?(?:\d{2}:)?\d{2}\.\d{3}$/

  return function isWebvtt(content: string): [boolean, string] {
    // 判断是否为空
    if (content === '') {
      return [false, '字幕内容不能为空']
    }

    // 如果只有一行，则判断是否为 WEBVTT 开头
    if (content.split('\n').length === 1) {
      if (content.startsWith('WEBVTT')) {
        return [true, '']
      }
      return [false, '字幕需要以 WEBVTT 开头']
    }

    // 判断第一行是否为 WEBVTT 开头
    if (!content.startsWith('WEBVTT')) {
      return [false, '字幕需要以 WEBVTT 开头']
    }

    // 去掉 NOTE 和 STYLE 块
    content = content.replace(reNoteStyle, '\n')

    // 判断是否有时间表达式
    const matches = content.match(reTimeExpression)
    if (!matches) {
      return [false, '需要包含时间表达式 hh:mm:ss.mmm, mm:ss.mmm, ss.mmm']
    }

    // 判断时间表达式是否正确(是否包含 -->)
    for (const match of matches) {
      const time = match.split(' --> ')
      if (time.length !== 2) {
        return [false, '时间表达式中需要 --> 分隔符']
      }
      const startTime = time[0].trim()
      const endTime = time[1].trim()

      // 判断时间是否符合 hh:mm:ss.mmm, mm:ss.mmm, ss.mmm
      if (!reTimeFormat.test(startTime) || !reTimeFormat.test(endTime)) {
        return [false, '时间格式错误，支持 hh:mm:ss.mmm, mm:ss.mmm, ss.mmm']
      }
    }

    // 对空字幕的校验
    const lines = content.split('\n')
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      if (reTimeExpression.test(line)) {
        // 检查时间表达式后是否有字幕内容
        if (i + 1 < lines.length && lines[i + 1].trim() === '') {
          return [false, '时间表达式后需要有字幕内容,不能为空']
        }
      }
    }

    return [true, '']
  }
})()

/**
 * 根据视频的哈希 ID 创建字幕对象。
 *
 * @param {string} videoHashId - 视频的哈希 ID。
 * @param {string[]} languages - 字幕语言列表。
 * @returns {Subtitles} - 返回字幕对象。
 */
export const createSubtitlesByVideoHashId = (
  videoHashId: string,
  languages: string[] | null
): Subtitles => {
  // 如果没有指定字幕语言列表，则返回空字幕对象
  if (!languages || languages.length === 0) {
    return {}
  }

  // 初始化 availableSubtitles
  const subtitles: Subtitles = {
    availableSubtitles: {},
    selectedSubtitlesLanguage: Language.disabled
  }

  for (const subtitlesLanguage of languages) {
    // 获取字幕 URL
    const subtitlesURL = getSubtitlesURL(videoHashId, subtitlesLanguage)

    const item: SubtitlesItem = {
      label: Language[subtitlesLanguage as keyof typeof Language], // 字幕标签，例如 'English', '中文', 'Español' 等
      src: subtitlesURL // 字幕文件的URL
    }

    // 将字幕项添加到 availableSubtitles 中
    subtitles.availableSubtitles![subtitlesLanguage as keyof typeof Language] = item
  }

  return subtitles
}
