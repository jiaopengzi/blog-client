/**
 * @Author       : jiaopengzi
 * @Date         : 2024-09-16 16:49:05
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-09-16 17:26:35
 * @FilePath     : \blog-client\src\utils\parser.ts
 * @Description  : 内容解析
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

export interface Position {
  type: 'percent' | 'pixel'
  value: number
}

/**
 * @description: 解析位置值 css 内容
 * @param value 位置值，可以是百分比（如 "50%"），像素（如 "50px"）, 其他值返回零值百分比.
 * @return Position 解析后的值，如果是百分比则返回小数，如果是像素则返回像素值，其他情况返回零值百分比.
 */
export function parsePosition(value: string | undefined): Position {
  // 如果是 undefined，返回 0
  if (value === undefined) {
    return { type: 'percent', value: 0 }
  }

  // 去掉两边的空格
  value = value.trim()

  // 匹配百分比值
  const percentMatch = value.match(/^(\d+(\.\d+)?)%$/)
  if (percentMatch) {
    const percentValue = parseFloat(percentMatch[1])
    return { type: 'percent', value: percentValue / 100 }
  }

  // 匹配像素值
  const pixelMatch = value.match(/^(\d+(\.\d+)?)px$/)
  if (pixelMatch) {
    return { type: 'pixel', value: parseFloat(pixelMatch[1]) }
  }

  // 其他情况返回 0
  return { type: 'percent', value: 0 }
}
