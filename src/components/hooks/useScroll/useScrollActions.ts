/**
 * @Author       : jiaopengzi
 * @Date         : 2023-08-04 10:54:19
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-01-12 19:25:43
 * @FilePath     : \blog-client\src\components\hooks\useScrollActions.ts
 * @Description  : 滚动事件
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved.
 */

import { ref } from 'vue'
import type { Ref } from 'vue'
import type { ScrollData } from '@/components/hooks/useScroll'
import { useScroll } from './useScroll'

/**
 * @description:  滚动事件
 * @param actionUp 向上滚动事件
 * @param actionDown 向下滚动事件
 * @return {Ref<ScrollData>} 滚动数据 ref 对象  position 滚动位置 direction 滚动方向
 */
export function useScrollActions(actionUp: () => void, actionDown: () => void): Ref<ScrollData> {
  const scrollData = ref<ScrollData>({
    position: 0,
    direction: 'up',
    speed: 0,
  })

  const handleScroll = (data: ScrollData) => {
    scrollData.value = data

    if (data.direction === 'up') {
      actionUp() // 向上滚动事件
    } else {
      actionDown() // 向下滚动事件
    }
  }
  useScroll(handleScroll) // 滚动事件

  return scrollData
}

// 示例代码

// import { ref } from 'vue';
// import type { Ref } from 'vue';
// import type { ScrollData } from '@/hooks/useScroll.types';
// import { useScrollActions } from '@/hooks/useScrollActions';

// const scrollUpAction = () => {
//     console.log(`===>Up, 位置：${scrollData.value.position.toFixed(2)}, 速度：${scrollData.value.speed.toFixed(2)} px/s`);
// };

// const scrollDownAction = () => {
//     console.log(`===>Down, 位置：${scrollData.value.position.toFixed(2)}, 速度：${scrollData.value.speed.toFixed(2)} px/s`);
// };

// const scrollData: Ref<ScrollData> = useScrollActions(scrollUpAction, scrollDownAction);
