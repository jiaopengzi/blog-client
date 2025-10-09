/*
 * FilePath    : blog-client\src\customElementsMount\utils.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 工具函数
 */

/**
 * 转换事件名格式（从 onEventName 到 onEvent-name）
 * @param eventName 原始事件名（必须以'on'开头，驼峰格式）
 * @returns 转换后的事件名
 */
export const convertEventName = (eventName: string): string => {
    if (!eventName.startsWith("on")) return eventName

    // 先从 onEventName 转换到 Event-name
    return (
        "on" +
        eventName
            .slice(2) // 去掉 on 前缀
            .replace(/([A-Z])/g, "-$1") // 将驼峰转为短横线格式
            .toLowerCase() // 转为小写
            .replace(/^-/, "") // 去除开头的短横线
            .replace(/^\w/, (c) => c.toUpperCase())
    ) // 首字母大写
}

/**
 * 转换 emits 对象中的事件名
 * @param emits 原始 emits 对象
 * @returns 转换后的事件对象
 */
export const convertEmits = <T>(emits: Record<string, (val: T) => void>): Record<string, (val: T) => void> => {
    return Object.entries(emits).reduce(
        (acc, [key, fn]) => {
            if (typeof fn === "function" && key.startsWith("on")) {
                acc[convertEventName(key)] = fn // 将事件名转换为 Vue 事件格式
            }
            return acc
        },
        {} as Record<string, (val: T) => void>,
    )
}
