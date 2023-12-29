/**
 * @Author       : jiaopengzi
 * @Date         : 2023-12-27 14:36:50
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-12-28 18:31:07
 * @FilePath     : \blog-client\src\utils\style.ts
 * @Description  : 样式工具类
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved.
 */

import juice from 'juice'

/**
 * @description: 设置主题
 * @param theme  主题名称
 */
export function setTheme(theme: string) {
  document.documentElement.setAttribute('data-theme', theme)
}

/**
 * @description:   获取元素的样式值
 * @param element  目标元素
 * @param property 样式属性
 * @return         样式值
 */
export function getComputedStyleValue(element: HTMLElement, property: string): any {
  return parseFloat(getComputedStyle(element).getPropertyValue(property))
}

/**
 * @description: 设置css变量
 * @param element 目标元素
 * @param variableName 变量名称
 * @param value 变量值
 */
export function setCSSVariable(element: HTMLElement, variableName: string, value: any): void {
  element.style.setProperty(variableName, value)
}

/**
 * @description: 获取css变量值
 * @param element 目标元素
 * @param variableName 变量名称
 * @return 变量值
 */
export function getCSSVariableValue(element: HTMLElement, variableName: string): any {
  return getComputedStyle(element).getPropertyValue(variableName)
}

/**
 * @description: 通过juice将css内联到html中
 * @param html 目标html
 * @return 内联后的html
 */
export function cssToInline(html: string) {
  return juice(html, {
    // inlinePseudoElements: true, // 是否内联伪元素
    // preserveImportant: true, // 是否保留!important
    // removeStyleTags: false, // 是否移除style标签
    // preserveMediaQueries: true, // 是否保留媒体查询
    // preserveFontFaces: true, // 是否保留字体
    // preserveKeyFrames: true, // 是否保留关键帧
    // preservePseudos: true, // 是否保留伪类
    // applyWidthAttributes: true, // 是否应用宽度属性
    // applyHeightAttributes: true, // 是否应用高度属性
    // applyAttributesTableElements: true, // 是否应用表元素的属性
    // xmlMode: true, // 是否启用xml模式
    // applyStyleTags: true, // 是否应用style标签
    // insertPreservedExtraCss: true, // 是否插入保留的额外css
  })
}
