/**
 * @FilePath     : \blog-client\src\utils\style.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 样式工具类
 */

import { type ImgFit } from "@/components/common"

import { removeCommentsSafe } from "./cssValidator"

/**
 * @description: 设置主题
 * @param theme  主题名称
 */
export function setTheme(theme: string) {
    document.documentElement.setAttribute("data-theme", theme)
}

/**
 * @description:   获取元素的样式值
 * @param element  目标元素
 * @param property 样式属性
 * @return         样式值
 */
export function getComputedStyleValue(element: HTMLElement, property: string): number {
    return parseFloat(getComputedStyle(element).getPropertyValue(property))
}

/**
 * @description: 设置css变量
 * @param element 目标元素
 * @param variableName 变量名称
 * @param value 变量值
 */
export function setCSSVariable(element: HTMLElement, variableName: string, value: string): void {
    element.style.setProperty(variableName, value)
}

/**
 * @description: 获取css变量值
 * @param element 目标元素
 * @param variableName 变量名称
 * @return 变量值
 */
export function getCSSVariableValue(element: HTMLElement, variableName: string): string {
    return getComputedStyle(element).getPropertyValue(variableName)
}

/**
 * @description: 图片样式
 * @param width 宽度 默认50px
 * @param height 高度 默认50px
 * @param imgFit 图片填充方式 默认cover
 * @return    图片样式
 */
export function imgStyle(width: number | undefined, height: number | undefined, imgFit: ImgFit | undefined): Record<string, string> {
    return {
        width: width ? `${width}px` : "50px", // 宽度
        height: height ? `${height}px` : "50px", // 高度
        "object-fit": imgFit ? imgFit : "cover", // 图片填充方式
    }
}

/**
 * @description: 图标样式
 * @param fontSize 字体大小 默认40px
 * @return 图标样式
 */
export function iconStyle(fontSize: number | undefined): Record<string, string> {
    return {
        "font-size": fontSize ? `${fontSize}px` : "40px", // 字体大小
    }
}

/**
 * @description: 设置自定义样式
 * @param cssId 样式ID
 * @param cssContent 样式内容
 */
export const setCustomStyle = (cssId: string, cssContent: string) => {
    // 移除旧的自定义样式
    const oldStyle = document.getElementById(cssId)
    if (oldStyle) {
        oldStyle.remove()
    }

    // 移除注释并修剪空白
    cssContent = removeCommentsSafe(cssContent).trim()

    // 如果为空则不添加
    if (!cssContent) return

    // 添加新的自定义样式
    const style = document.createElement("style")
    style.id = cssId
    style.textContent = cssContent
    document.head.appendChild(style)
}
