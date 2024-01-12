/**
 * @Author       : jiaopengzi
 * @Date         : 2024-01-12 19:26:45
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-01-12 19:29:06
 * @FilePath     : \blog-client\src\components\hooks\useScroll\index.ts
 * @Description  : 监控滚动条
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import { useScroll } from './useScroll'
import { useScrollActions } from './useScrollActions'

export { useScroll, useScrollActions }

/**
 * @description:  滚动方向
 * @return  {Direction} up 向上滚动 down 向下滚动
 */
export type Direction = 'up' | 'down'

/**
 * @description: 滚动数据
 * @return  {ScrollData} position 滚动位置 direction 滚动方向 speed 滚动速度
 */
export interface ScrollData {
  position: number
  direction: Direction
  speed: number
}

/**
 * @description: 滚动事件
 * @return  {ScrollHandler} 滚动事件
 */
export interface ScrollHandler {
  (data: ScrollData): void
}
