/**
 * @Author       : jiaopengzi
 * @Date         : 2024-03-07 11:14:21
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-03-07 11:17:46
 * @FilePath     : \blog-client\src\dev.ts
 * @Description  : 开发环境下需要运行的函数
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import { devCheckIconKeys, iconMap } from '@/components/common/icons'

/**
 * @description: 开发环境运行的函数，主要在控制台输出一些信息便于开发调试
 * @return
 */
export function devRun() {
  devCheckIconKeys(iconMap) // 校验 iconMap
}
