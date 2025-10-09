/*
 * FilePath    : blog-client\src\customElements\registerCustomElements.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 注册自定义元素
 */

// 自定义元素名称
export enum Names {
    PayDownload = "pay-download", // 付费下载
    PayRead = "pay-read", // 付费阅读
    PayKey = "pay-key", // 付费密钥
    PayMembership = "pay-membership", // 付费会员
    PayVideo = "pay-video", // 付费视频
    VideoPlayer = "video-player", // 视频播放器
}

import { BaseCustomElement } from "./base"

/**
 * 为给定的自定义元素名创建一个动态的 Custom Element 类, 该类继承自 BaseCustomElement。
 *
 * 这个工厂函数返回一个运行时创建的类(extends BaseCustomElement), 适合用于后续调用
 * customElements.define 注册或直接实例化。返回的类会额外设置一个便于调试的静态
 * "name" 属性, 形式为 "CustomElement" + 将 elementName 转为 PascalCase(并移除连字符)。
 *
 * 说明：
 * - 不会在函数内部自动注册到 customElements registry; 需自行调用 customElements.define。
 * - 该函数不会对 elementName 做严格的规范校验(例如是否包含连字符); 建议调用者在传入前, 确保遵循 Custom Elements 命名规范。
 *
 * @param elementName - 要创建类的自定义元素标签名(例如 "my-widget")。推荐遵循 Custom Elements 的命名规范(通常包含连字符)。
 * @returns 一个继承自 BaseCustomElement 的构造函数(类), 可用于 customElements.define 或 new 来创建元素实例。
 *
 * @remarks
 * - 返回的类在构造器内调用了 super(), 因此应保证 BaseCustomElement 的构造器可被安全调用。
 * - 静态 name 的生成规则：将 elementName 的首字母大写并移除所有连字符, 再在前面加上 "CustomElement"。
 *
 * @example
 * // 创建类并注册
 * const MyWidget = createCustomElementClass('my-widget');
 * customElements.define('my-widget', MyWidget);
 *
 * @example
 * // 直接实例化(通常在注册后由浏览器创建)
 * const instance = new (createCustomElementClass('demo-item'))();
 */
function createCustomElementClass(elementName: string): typeof BaseCustomElement {
    // 做一些基本的 elementName 校验, 确保符合自定义元素命名规范
    if (!checkCustomElementTagName(elementName)) {
        console.warn(`Creating custom element with non-standard name: "${elementName}". Proceeding anyway.`)
    }

    class DynamicCustomElement extends BaseCustomElement {
        constructor() {
            super()
            // 自定义扩展, 比如根据 elementName 做不同的初始化
        }
    }

    // // 可以给类加一个静态名称, 便于调试
    // Object.defineProperty(DynamicCustomElement, "name", {
    //     value: `CustomElement${elementName.charAt(0).toUpperCase() + elementName.slice(1).replace(/-/g, "")}`,
    //     configurable: true,
    // })

    return DynamicCustomElement
}

/**
 * 检查自定义元素名称是否符合规范
 * @param elementName - 自定义元素名称
 * @returns 是否符合规范
 */
function checkCustomElementTagName(elementName: string): boolean {
    // 校验 elementName 是否符合自定义元素命名规范(包含连字符)
    if (!elementName.includes("-")) {
        console.warn(
            `⚠️ Warning: Custom element name "${elementName}" does not contain a hyphen. ` +
                `It's recommended to follow the Custom Elements naming convention by including a hyphen.`,
        )
        return false
    }

    // 不能包含空格
    if (/\s/.test(elementName)) {
        throw new Error(`Invalid custom element name "${elementName}": must not contain spaces.`)
    }
    // 不能以数字开头
    if (/^[0-9]/.test(elementName)) {
        throw new Error(`Invalid custom element name "${elementName}": must not start with a digit.`)
    }
    // 不能包含大写字母
    if (/[A-Z]/.test(elementName)) {
        console.warn(`⚠️ Warning: Custom element name "${elementName}" contains uppercase letters. ` + `It's recommended to use lowercase letters only.`)
        return false
    }

    return true
}

/**
 * 批量注册自定义元素
 */
export function registerAllCustomElements() {
    // 遍历所有名称, 注册自定义元素
    for (const name of Object.values(Names) as string[]) {
        // 避免重复定义
        if (!customElements.get(name)) {
            const CustomElementClass = createCustomElementClass(name)
            customElements.define(name, CustomElementClass)
            // console.info(`✅ Registered custom element: <${name}>`)
        } else {
            console.warn(`ℹ️ Custom element already defined: <${name}>`)
        }
    }
}

// 自动注册所有自定义元素
registerAllCustomElements()
