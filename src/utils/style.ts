/**
 * @Author       : jiaopengzi
 * @Date         : 2023-12-27 14:36:50
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-01-02 14:03:12
 * @FilePath     : \blog-client\src\utils\style.ts
 * @Description  : 样式工具类
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved.
 */

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
