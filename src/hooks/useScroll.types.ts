/**
 * @Author       : jiaopengzi
 * @Date         : 2023-08-04 10:54:19
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-08-12 10:51:12
 * @FilePath     : \blog-client\src\hooks\useScroll.types.ts
 * @Description  : 滚动条监听 types
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved.
 */

// useScroll.types.ts

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
