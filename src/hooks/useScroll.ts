/**
 * @Author       : jiaopengzi
 * @Date         : 2023-07-10 15:56:41
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-07-10 22:17:38
 * @FilePath     : \vuestudy\src\hooks\useScroll.ts
 * @Description  :
 * @blog: https://jiaopengzi.com
 * @Copyright (c) 2023 by jiaopengzi, All Rights Reserved.
 */

// useScroll.ts
import { onMounted, onUnmounted } from 'vue'
import type { ScrollHandler, Direction } from './useScroll.types'

export function useScroll(handler: ScrollHandler) {
  let lastPosition = window.scrollY || document.documentElement.scrollTop
  let lastTimestamp = performance.now() // 上一次滚动时间戳

  const handleScroll = () => {
    const currentPosition = window.scrollY || document.documentElement.scrollTop
    const currentTimestamp = performance.now() // 当前滚动时间戳
    const direction: Direction = currentPosition > lastPosition ? 'down' : 'up'

    const deltaTime = currentTimestamp - lastTimestamp // 时间间隔（毫秒）
    const deltaPosition = Math.abs(currentPosition - lastPosition) // 滚动距离
    const speed = (deltaPosition / deltaTime) * 1000 // 计算滚动速度（像素/秒）

    handler({
      position: currentPosition,
      direction,
      speed,
    })

    lastPosition = currentPosition
    lastTimestamp = currentTimestamp // 更新滚动时间戳
  }

  onMounted(() => {
    window.addEventListener('scroll', handleScroll)
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
  })
}
