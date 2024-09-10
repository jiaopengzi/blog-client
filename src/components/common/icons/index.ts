/**
 * @Author       : jiaopengzi
 * @Date         : 2023-12-21 15:05:09
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-09-10 18:11:00
 * @FilePath     : \blog-client\src\components\common\icons\index.ts
 * @Description  : 图标组件
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved.
 */

export { default } from './index.vue'

import { kebabToPascalCase } from '@/utils/namingConversion'
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
export const iconMap: IconMap = getIconMap(iconFontJSON)

// 枚举值使用小横线命名法 例如: 'wechat-official-account'
export enum IconKeys {
  Announcement = 'announcement',
  Archive = 'archive',
  Article = 'article',
  Backup = 'backup',
  Bill = 'bill',
  Bold = 'bold',
  Chart = 'chart',
  Clear = 'clear',
  Close = 'close',
  CodeBlock = 'code-block',
  CodeInline = 'code-inline',
  Collapse = 'collapse',
  Comment = 'comment',
  Copy = 'copy',
  Dashborad = 'dashborad',
  Data = 'data',
  DataAnalysis = 'data-analysis',
  Demo = 'demo',
  Desktop = 'desktop',
  Divider = 'divider',
  Doc = 'doc',
  Edit = 'edit',
  Editor = 'editor',
  Emoji = 'emoji',
  Excel = 'excel',
  ExitFullscreen = 'exit-fullscreen',
  Favorite = 'favorite',
  Follow = 'follow',
  Footnote = 'footnote',
  Fullscreen = 'fullscreen',
  H1 = 'h1',
  H2 = 'h2',
  H3 = 'h3',
  H4 = 'h4',
  H5 = 'h5',
  H6 = 'h6',
  Help = 'help',
  Hot = 'hot',
  Hr = 'hr',
  Html = 'html',
  Image = 'image',
  Info = 'info',
  Italic = 'italic',
  Label = 'label',
  Link = 'link',
  Login = 'login',
  Mark = 'mark',
  Markdown = 'markdown',
  MathBlock = 'math-block',
  MathInline = 'math-inline',
  Media = 'media',
  Menu = 'menu',
  Mobile = 'mobile',
  Model = 'model',
  Money = 'money',
  New = 'new',
  Notification = 'notification',
  Ol = 'ol',
  Overview = 'overview',
  Page = 'page',
  PayContent = 'pay-content',
  Pdf = 'pdf',
  Permission = 'permission',
  Post = 'post',
  Preview = 'preview',
  Publish = 'publish',
  Qq = 'qq',
  Quote = 'quote',
  Random = 'random',
  Recommended = 'recommended',
  Redo = 'redo',
  Register = 'register',
  Save = 'save',
  Scroll = 'scroll',
  Search = 'search',
  Shop = 'shop',
  ShortLink = 'short-link',
  Strikethrough = 'strikethrough',
  Subscript = 'subscript',
  Superscript = 'superscript',
  Table = 'table',
  TaskList = 'task-list',
  Test = 'test',
  Toc = 'toc',
  Tool = 'tool',
  Ul = 'ul',
  Undo = 'undo',
  UploadFilled = 'upload-filled',
  User = 'user',
  Video = 'video',
  Vip = 'vip',
  VipRed = 'vip-red',
  Wechat = 'wechat',
  WechatOfficialAccount = 'wechat-official-account',
  Welfare = 'welfare',
  Zip = 'zip',
  WebFullscreen = 'web-fullscreen',
  PictureInPicture = 'picture-in-picture',
  Play = 'play',
  Mute = 'mute',
  Loading = 'loading',
  Unmute = 'unmute',
  Pause = 'pause',
  Setting = 'setting',
}

// 开发模式下运行 历遍 iconMap 对象中的 key 校验是否符合 IconKeys 类型约束
export const devCheckIconKeys = (iconMap: IconMap): void => {
  let newIconKeys = ''
  Object.keys(iconMap).forEach((key) => {
    const keyPascalCase = kebabToPascalCase(key)
    if (!(keyPascalCase in IconKeys)) {
      // 如果 key 中包含 - 则添加
      const _enum = `${keyPascalCase} = '${key}',`
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
