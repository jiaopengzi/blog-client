/**
 * @Author       : jiaopengzi
 * @Date         : 2023-12-21 15:05:09
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-12-28 13:08:06
 * @FilePath     : \blog-client\src\components\common\icons\index.ts
 * @Description  : 图标组件
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved.
 */

export { default } from './index.vue'
import iconFontJSON from '@/components/common/icons/assets/iconfont.json' // 导入 iconfont.json 数据

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

// 图标 json 数据 类型守卫函数
export function isIconJson(obj: any): IconJson {
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
        typeof glyph.unicode_decimal === 'number',
    )
  )
}

/**
 * @description: 通过 iconfont.json 数据获取 iconMap 对象
 * 检查 iconFontJSON 是否符合 IconJson 类型
 * 读取 @/components/icons/iconfont.josn 中的数据 将 iconfont.josn 中的 glyphs 数组转换成 iconMap 对象
 * iconMap 对象的 key 为 glyphs 数组中的 font_class 字段，value 为 "#icon-" + glyph.font_class
 * @param iconFontJSON iconfont.json 数据
 * @return {IconMap} iconMap 对象
 */
export function getIconMap(iconFontJSON: any): IconMap {
  const iconMap: IconMap = {}
  if (isIconJson(iconFontJSON)) {
    const prefix = iconFontJSON.css_prefix_text //前缀
    iconFontJSON.glyphs.forEach((glyph: { font_class: string; unicode: string }) => {
      // 如果 glyph.font_class 不存在 则打印错误信息
      if (!glyph.font_class) {
        console.error('font_class 不存在')
        return
      }
      iconMap[glyph.font_class] = '#' + prefix + glyph.font_class
    })
  } else {
    // 打印堆栈信息
    console.error('iconFontJSON 不符合 IconJson 类型')
  }
  return iconMap
}

// 通过 iconMap 对象 得到 对应的 key 作为 icon 类型约束
export const iconMap: IconMap = getIconMap(iconFontJSON)

export enum IconKeys {
  Recommended = 'Recommended',
  WeChatOfficialAccount = 'WeChatOfficialAccount',
  archive = 'archive',
  article = 'article',
  bill = 'bill',
  bold = 'bold',
  chart = 'chart',
  clear = 'clear',
  close = 'close',
  codeBlock = 'codeBlock',
  codeInline = 'codeInline',
  copy = 'copy',
  data = 'data',
  database = 'database',
  demo = 'demo',
  desktop = 'desktop',
  divider = 'divider',
  doc = 'doc',
  edit = 'edit',
  editor = 'editor',
  emoji = 'emoji',
  excel = 'excel',
  exitFullscreen = 'exitFullscreen',
  favorite = 'favorite',
  follow = 'follow',
  footnote = 'footnote',
  fullscreen = 'fullscreen',
  h1 = 'h1',
  h2 = 'h2',
  h3 = 'h3',
  h4 = 'h4',
  h5 = 'h5',
  h6 = 'h6',
  help = 'help',
  hot = 'hot',
  hr = 'hr',
  html = 'html',
  image = 'image',
  info = 'info',
  italic = 'italic',
  label = 'label',
  link = 'link',
  login = 'login',
  mark = 'mark',
  markdown = 'markdown',
  mathBlock = 'mathBlock',
  mathInline = 'mathInline',
  menu = 'menu',
  mobile = 'mobile',
  model = 'model',
  money = 'money',
  new = 'new',
  office = 'office',
  ol = 'ol',
  overview = 'overview',
  payContent = 'payContent',
  pdf = 'pdf',
  preview = 'preview',
  publish = 'publish',
  qq = 'qq',
  quote = 'quote',
  random = 'random',
  redo = 'redo',
  register = 'register',
  save = 'save',
  scroll = 'scroll',
  search = 'search',
  strikethrough = 'strikethrough',
  subscript = 'subscript',
  superscript = 'superscript',
  table = 'table',
  taskList = 'taskList',
  test = 'test',
  toc = 'toc',
  tool = 'tool',
  ul = 'ul',
  undo = 'undo',
  user = 'user',
  video = 'video',
  vip = 'vip',
  'vip-red' = 'vip-red',
  wechat = 'wechat',
  welfare = 'welfare',
}

// 历遍 iconMap 对象中的 key 校验是否符合 IconKeys 类型约束
const checkIconKeys = (iconMap: IconMap): void => {
  let newIconKeys = ''
  Object.keys(iconMap).forEach((key) => {
    if (!(key in IconKeys)) {
      const _enum = key + " = '" + key + "',"
      newIconKeys += _enum + '\n'
    }
  })
  if (newIconKeys) {
    console.error(
      'iconMap 对象中的 key 有不符合 IconKeys 类型的值:\n 请将如下内容添加到枚举 enum IconKeys 中\n' +
        newIconKeys,
    )
  }
}

// 校验 iconMap
checkIconKeys(iconMap)
