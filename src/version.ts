/**
 * @Author       : jiaopengzi
 * @Date         : 2024-01-03 12:48:46
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-09-28 15:39:22
 * @FilePath     : \blog-client\src\version.ts
 * @Description  : 版本信息
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import pkg from '../package.json'

// 项目信息
const INFO = {
  name: pkg.name,
  version: pkg.version,
  description: pkg.description,
  author: pkg.author,
  license: pkg.license,
  homepage: pkg.homepage,
  repository: pkg.repository.url,
}

// 获取项目信息
export function getInfo() {
  return INFO
}

// 控制台输出项目信息
export function consoleInfoFormat() {
  const info = getInfo() // 获取项目信息
  const stypleName = [
    'color: #1E2858; background-color:#c89828; font-size: 24px; font-weight: bold; border-radius: 4px;',
  ] // name 样式
  const stypleOther = Array(6).fill('font-size: 14px;') // 其他字段样式
  const stypleList = [...stypleName, ...stypleOther] // 样式列表

  // 将 info 对象转换为数组 计算最长的字段名
  const infoList = Object.entries(info)

  // 计算最长的字段名
  const longestKeyLength =
    infoList.reduce((acc, [key]) => {
      return Math.max(acc, key.length)
    }, 0) + 1

  // 通过 infoList 使用 padEnd() 方法填充空格以使冒号右对齐
  const logContent = infoList.reduce((acc, [key, value]) => {
    // 如果key是name 不拼接Key 和冒号
    if (key === 'name') {
      return `${acc}%c${value}\n`
    }
    return `${acc}%c${key.padEnd(longestKeyLength)}: ${value}\n`
  }, '')

  console.info(logContent, ...stypleList)
}
