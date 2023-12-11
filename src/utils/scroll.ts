/**
 * @Author       : jiaopengzi
 * @Date         : 2023-12-11 15:32:10
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-12-11 15:45:14
 * @FilePath     : \blog-client\src\utils\scroll.ts
 * @Description  : 滚动条工具类
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved.
 */

/**
 * @description: 平滑滚动到指定元素
 * @param element 目标元素
 * @param container 容器元素
 */
export function scrollToElementSmoothly(element: HTMLElement, container: HTMLElement): void {
  const targetScrollTop = element.offsetTop - container.offsetTop
  const observer = new IntersectionObserver(
    (entries) => {
      // 检查目标元素是否与视口相交
      if (entries[0].isIntersecting) {
        container.scrollTop = targetScrollTop
        observer.disconnect() // 停止观察
      } else {
        container.scrollTop += (targetScrollTop - container.scrollTop) * 0.1 // 滚动到目标元素
        requestAnimationFrame(() => {
          scrollToElementSmoothly(element, container) // 继续观察
        })
      }
    },
    { root: container }, // 观察 container
  )

  observer.observe(element) // 开始观察
}

