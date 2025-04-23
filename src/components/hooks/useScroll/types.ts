/*
 * FilePath    : blog-client\src\components\hooks\useScroll\types.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 类型
 */

/**
 * @description 滚动方向 up 向上滚动 down 向下滚动
 */
export type Direction = "up" | "down"

/**
 * @description 滚动数据 position 位置 direction 滚动方向 speed 滚动速度
*/
export interface ScrollData {
    position: number
    direction: Direction
    speed: number
}

/**
 * @description: 滚动事件
 */
export interface ScrollHandler {
    (data: ScrollData): void // 滚动事件回调函数
}
