/**
 * @Author       : jiaopengzi
 * @Date         : 2023-12-27 14:36:50
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-09-25 12:16:30
 * @FilePath     : \blog-client\src\utils\style.ts
 * @Description  : 样式工具类
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved.
 */

import { type ImgFit } from '@/components/common'

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
 * @description: 图片样式
 * @param width 宽度 默认50px
 * @param height 高度 默认50px
 * @param imgFit 图片填充方式 默认cover
 * @return    图片样式
 */
export function imgStyle(
  width: number | undefined,
  height: number | undefined,
  imgFit: ImgFit | undefined
): Record<string, string> {
  return {
    width: width ? `${width}px` : '50px', // 宽度
    height: height ? `${height}px` : '50px', // 高度
    'object-fit': imgFit ? imgFit : 'cover' // 图片填充方式
  }
}

/**
 * @description: 图标样式
 * @param fontSize 字体大小 默认40px
 * @return 图标样式
 */
export function iconStyle(fontSize: number | undefined): Record<string, string> {
  return {
    'font-size': fontSize ? `${fontSize}px` : '40px' // 字体大小
  }
}
