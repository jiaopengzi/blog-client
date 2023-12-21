/**
 * @Author       : jiaopengzi
 * @Date         : 2023-12-01 22:04:48
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-12-21 15:03:35
 * @FilePath     : \blog-client\src\components\common\icons\type.ts
 * @Description  : 图标类型定义
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved.
 */

// 图标字典
export interface IconMap {
  [key: string]: string
}

// 图标属性
export interface IconProps {
  name: string
  customClass?: string
}

// 图标 json 数据 格式
export interface IconJson {
  id: string
  name: string
  font_family: string
  css_prefix_text: string
  description: string
  glyphs: [
    {
      icon_id: string
      name: string
      font_class: string
      unicode: string
      unicode_decimal: number
    },
  ]
}

// 举例
// const iconMap: IconMap = {
//   wechat: '#icon-wechat',
//   qq: '#icon-qq',
//   vip: '#icon-vip-red',
// }
