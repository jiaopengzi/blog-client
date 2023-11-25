<!-- eslint-disable vue/multi-word-component-names -->
<!--
 * @Author       : jiaopengzi
 * @Date         : 2023-11-05 11:39:40
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-11-22 21:55:51
 * @FilePath     : \blog-client\src\components\icons\Icon.vue
 * @Description  : 图标组件
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved. 
-->


<template>
    <svg class="icon" aria-hidden="true" :class="iconClass">
        <use :xlink:href="iconMap[props.name]" />
    </svg>
</template>

<script lang="ts" setup>
import { computed, withDefaults, reactive } from 'vue'
import '@/components/common/icons/iconfont.js'
import type { IconMap, IconProps, IconJson } from '@/components/common/icons/icon.d'
import iconFontJSON from '@/components/common/icons/iconfont.json' // 导入 iconfont.json

const iconMap: IconMap = reactive({})

/** 
 * 检查 iconFontJSON 是否符合 IconJson 类型
 * 读取 @/components/icons/iconfont.josn 中的数据 将 iconfont.josn 中的 glyphs 数组转换成 iconMap 对象
 * iconMap 对象的 key 为 glyphs 数组中的 font_class 字段，value 为 "#icon-" + glyph.font_class
*/
if (isIconJson(iconFontJSON)) {
    const prefix = iconFontJSON.css_prefix_text //前缀
    iconFontJSON.glyphs.forEach((glyph: { font_class: string; unicode: string }) => {
        // 如果 glyph.font_class 不存在 则打印错误信息
        if (!glyph.font_class) {
            console.error('font_class 不存在')
            return
        }
        iconMap[glyph.font_class] = "#" + prefix + glyph.font_class
    })
} else {
    console.error('iconFontJSON 不符合 IconJson 类型')
}

// props 为 IconProps 类型
const props = withDefaults(defineProps<IconProps>(), {
    customClass: '',
})

// iconClass 为 icon 的 class 属性
const iconClass = computed(() => {
    return [props.name, props.customClass]
})

// 图标 json 数据 类型守卫函数
function isIconJson(obj: any): obj is IconJson {
    return (
        obj &&
        typeof obj === 'object' &&
        'id' in obj &&
        'name' in obj &&
        'font_family' in obj &&
        'css_prefix_text' in obj &&
        'description' in obj &&
        'glyphs' in obj &&
        Array.isArray(obj.glyphs) &&
        obj.glyphs.every(
            (glyph: any) =>
                glyph &&
                typeof glyph === 'object' &&
                'icon_id' in glyph &&
                'name' in glyph &&
                'font_class' in glyph &&
                'unicode' in glyph &&
                'unicode_decimal' in glyph &&
                typeof glyph.icon_id === 'string' &&
                typeof glyph.name === 'string' &&
                typeof glyph.font_class === 'string' &&
                typeof glyph.unicode === 'string' &&
                typeof glyph.unicode_decimal === 'number'
        )
    )
}

</script>

<style scoped lang="scss">
.icon {
    width: 1em;
    height: 1em;
    overflow: hidden;
    // fill 填充色 需要在阿里图标库中设置批量去掉去色
}
</style>
  
  