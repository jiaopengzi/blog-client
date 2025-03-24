/**
 * @FilePath     : \blog-client\src\components\common\icons\utils.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 工具函数
 */

import iconFontJSON from "@/components/common/icons/assets/iconfont.json" // 导入 iconfont.json 数据
import { kebabToPascalCase } from "@/utils/namingConversion"

import { type IconJSON, IconKeys, type IconMap } from "./types"

// 图标 json 数据 类型守卫函数
export function isIconJSON(obj: unknown): IconJSON {
    return (obj &&
        typeof obj === "object" &&
        "id" in obj &&
        "name" in obj &&
        "font_family" in obj &&
        "css_prefix_text" in obj &&
        "description" in obj &&
        "glyphs" in obj &&
        Array.isArray(obj.glyphs) &&
        obj.glyphs.every(
            (glyph: unknown) =>
                glyph &&
                typeof glyph === "object" &&
                "icon_id" in glyph &&
                "name" in glyph &&
                "font_class" in glyph &&
                "unicode" in glyph &&
                "unicode_decimal" in glyph &&
                typeof glyph.icon_id === "string" &&
                typeof glyph.name === "string" &&
                typeof glyph.font_class === "string" &&
                typeof glyph.unicode === "string" &&
                typeof glyph.unicode_decimal === "number",
        )) as IconJSON
}

/**
 * @description: 通过 iconfont.json 数据获取 iconMap 对象
 * 检查 iconFontJSON 是否符合 IconJSON 类型
 * 读取 @/components/icons/iconfont.json 中的数据 将 iconfont.json 中的 glyphs 数组转换成 iconMap 对象
 * iconMap 对象的 key 为 glyphs 数组中的 font_class 字段，value 为 "#icon-" + glyph.font_class
 * @param iconFontJSON iconfont.json 数据
 * @return {IconMap} iconMap 对象
 */
export function getIconMap(iconFontJSON: IconJSON): IconMap {
    const iconMap: IconMap = {}
    if (isIconJSON(iconFontJSON)) {
        const prefix = iconFontJSON.css_prefix_text //前缀
        iconFontJSON.glyphs.forEach((glyph: { font_class: string; unicode: string }) => {
            // 如果 glyph.font_class 不存在 则打印错误信息
            if (!glyph.font_class) {
                console.error("font_class 不存在")
                return
            }
            iconMap[glyph.font_class] = "#" + prefix + glyph.font_class
        })
    } else {
        // 打印堆栈信息
        console.error("iconFontJSON 不符合 IconJSON 类型")
    }
    // 将 iconMap key 升序排序

    // Object.keys(iconMap)
    //   .sort()
    //   .forEach((key) => {
    //     const value = iconMap[key]
    //     delete iconMap[key]
    //     iconMap[key] = value
    //   })
    return iconMap
}

// 通过 iconMap 对象 得到 对应的 key 作为 icon 类型约束
export const iconMap: IconMap = getIconMap(iconFontJSON as IconJSON)

// 开发模式下运行 历遍 iconMap 对象中的 key 校验是否符合 IconKeys 类型约束
export const devCheckIconKeys = (iconMap: IconMap): void => {
    let newIconKeys = ""
    Object.keys(iconMap).forEach((key) => {
        const keyPascalCase = kebabToPascalCase(key)
        if (!(keyPascalCase in IconKeys)) {
            // 如果 key 中包含 - 则添加
            const _enum = `${keyPascalCase} = '${key}',`
            newIconKeys += _enum + "\n"
        }
    })
    if (newIconKeys) {
        console.error("iconMap 对象中的 key 有不符合 IconKeys 类型的值:\n 请将如下内容添加到枚举 enum IconKeys 中\n" + newIconKeys)
    }
}

/**
 * 检查 iconKeys 是否符合 IconKeys 中的值
 * @param iconKey icon 名称
 * @return {boolean} 是否符合 IconKeys 类型约束
 */
export const checkIconKeys = (iconKey: string): boolean => {
    const keyPascalCase = kebabToPascalCase(iconKey)
    return keyPascalCase in IconKeys
}
