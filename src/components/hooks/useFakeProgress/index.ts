/**
 * @Author       : jiaopengzi
 * @Date         : 2024-02-22 14:05:54
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-02-22 14:37:07
 * @FilePath     : \blog-client\src\components\hooks\useFakeProgress\index.ts
 * @Description  : 参考：https://liubing.me/article/vue/vue3-use-fake-progress.html#%E5%B0%81%E8%A3%85%E6%88%90-hook
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */
import { ref, computed, onBeforeUnmount, type Ref } from 'vue'
import FakeProgress from 'fake-progress'

interface IUseFakeProgress {
  progress: Ref<number>
  percentage: Ref<number>
  start: () => void
  end: () => void
}

/**
 * useFakeProgress Hook
 *
 * @param {number} [timeConstant=5000] - 默认timeConstant为5000，单位毫秒
 * @param {boolean} [autoStart=false] - 是否自动开始，默认为false
 * @return {IUseFakeProgress}
 */
export function useFakeProgress(timeConstant?: number, autoStart?: boolean): IUseFakeProgress {
  const fake = new FakeProgress({
    timeConstant: timeConstant || 5000,
    autoStart
  })
  const progress = ref(fake.progress)
  const percentage = computed(() => parseInt(progress.value * 100 + ''))
  let timerInterval: ReturnType<typeof setInterval> | null
  if (autoStart) {
    setTimerInterval()
  }

  onBeforeUnmount(() => {
    clearTimerInterval()
  })

  function start() {
    if (!percentage.value || percentage.value === 100) {
      fake.start()
      setTimerInterval()
    }
  }

  function end() {
    fake.end()
    progress.value = fake.progress
  }

  function setTimerInterval() {
    clearTimerInterval()
    timerInterval = setInterval(() => {
      progress.value = fake.progress
    }, 100)
  }

  function clearTimerInterval() {
    if (timerInterval) clearInterval(timerInterval)
    timerInterval = null
  }

  return {
    progress,
    percentage,
    start,
    end
  }
}
