/**
 * @Author       : jiaopengzi
 * @Date         : 2024-01-12 19:26:52
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-01-12 19:31:08
 * @FilePath     : \blog-client\src\components\hooks\useScroll\useScroll.ts
 * @Description  :
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */
/**
 * @Author       : jiaopengzi
 * @Date         : 2023-08-04 10:54:19
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-01-12 19:26:51
 * @FilePath     : \blog-client\src\components\hooks\useScroll.ts
 * @Description  : 滚动条监听
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved.
 */

import { onMounted, onUnmounted } from 'vue'
import type { ScrollHandler, Direction } from '@/components/hooks/useScroll'

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
    window.addEventListener('scroll', handleScroll, { passive: true })
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
  })
}
