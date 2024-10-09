/**
 * @Author       : jiaopengzi
 * @Date         : 2023-12-27 16:55:44
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-04-01 19:38:16
 * @FilePath     : \blog-client\src\utils\preview.ts
 * @Description  : 处理预览html
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved.
 */
import html2canvas from 'html2canvas'
import { ShowMsgTip } from '@/utils/message'
import { HasParentByClass } from '@/utils/getParentByClass'
/**
 * @description:  处理 utf-8 编码问题
 * @param htmlSrc html 源码
 * @return 替换后的 html 源码
 */
export function htmlHandleUtf8(htmlSrc: string) {
  // 处理 utf-8 编码问题
  return htmlSrc.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n') // 去除 BOM 头 和 windows 换行符
}

/**
 * @description: 匹配所有 class 中有 copy-button 的按钮元素 替换掉
 * @param htmlSrc html 源码
 * @return  替换后的 html 源码
 */
export function htmlHandleCopyBtns(htmlSrc: string) {
  // 匹配所有 class 中有 copy-button 的按钮元素 替换掉
  const reg = /<button\s+class="[^"]*\bcopy-button\b[^"]*">([^<]*)<\/button>/g
  // 将所有按钮替换为空
  return htmlSrc.replace(reg, '')
}

/**
 * @description: 将 div 替换为 section
 * @param htmlSrc html 源码
 * @return  替换后的 html 源码
 */
export function htmlHandleDivToSection(htmlSrc: string) {
  const reg = /div/g
  // 将所有按钮替换为空
  return htmlSrc.replace(reg, 'section')
}

/**
 * @description: 将 katex 公式转成图片 为了微信预览
 * @param container 预览容器
 * @param calssName katex 公式的类名
 */
export async function katexToImage(container: HTMLElement, className: string = 'katex-html') {
  // 获取所有 katex 公式
  const katexsArray = Array.from(container.getElementsByClassName(className))
  if (katexsArray) {
    // 遍历所有 katex 公式
    for (let i = 0; i < katexsArray.length; i++) {
      const katex = katexsArray[i] as HTMLElement // 当前 katex 公式
      // 判断 katex 是否有父元素 的类名为 katex-display
      const isKatexDisplay = HasParentByClass(katex, 'katex-display')

      // 获取 katex 滚动宽度
      const katexScrollWidth = katex.scrollWidth // katex 滚动宽度
      const katexOffsetWidth = katex.offsetWidth * 1 // katex 宽度
      const katexOffsetHeight = katex.offsetHeight * 1.05 // katex 高度

      // 获取 canvas 宽度 如果是行内公式则使用 katex 的宽度 如果是行间公式则使用 katex 的滚动宽度
      const getCanvasWidth = () => (isKatexDisplay ? katexScrollWidth : katexOffsetWidth)

      // 使用 canvas 将 katex 转成图片 scale 为 3 是为了提高图片清晰度
      const canvas = await html2canvas(katex, {
        scale: 3,
        backgroundColor: '#ffffff80',
        logging: false,
        width: getCanvasWidth(),
        height: katexOffsetHeight
      })
      const imageDataURL = canvas.toDataURL('image/png') // 转成图片的 base64
      const img = document.createElement('img') // 创建 img 元素
      img.src = imageDataURL // 设置图片的 src

      // 根据是否行内公式设置 img 元素的属性
      if (isKatexDisplay) {
        img.style.width = `100%` // 设置图片的宽度
      } else {
        // 需要单独一个添加 不能用 setAttribute 会被覆盖
        img.style.width = `${getCanvasWidth()}px` // 设置图片的宽度
        img.style.display = 'inline-block' // 设置 img 元素的 display 为 inline-block 行内显示
        img.style.verticalAlign = 'text-top' // 设置 img 元素的 vertical-align 为 text-top 使其与文字对齐
      }

      katex.parentNode?.replaceChild(img, katex) // 替换 katex 公式
    }
  }
}

/**
 * @description: html 处理微信预览
 * @param htmlSrc html 源码
 * @return  替换后的 html 源码
 */
export function htmlHandleWeChat(htmlSrc: string) {
  htmlSrc = htmlHandleCopyBtns(htmlSrc)
  htmlSrc = htmlHandleDivToSection(htmlSrc)
  return htmlSrc
}

/**
 * @description: 获取所有外部样式表并按照它们在 document.styleSheets 中的位置进行排序
 * @return 已排序的外部样式表列表和索引
 */
function getSortedStyleSheets(): [CSSStyleSheet, number][] {
  const styleSheets = Array.from(document.styleSheets).map((styleSheet, index) => [
    styleSheet as CSSStyleSheet,
    index
  ]) as [CSSStyleSheet, number][]

  // 对样式表按照它们在 document.styleSheets 中的位置进行排序
  return styleSheets.sort((a, b) => a[1] - b[1])
}

/**
 * @description: 指定类名的 sapn 元素是否应该保留其行内样式
 * @param sapnElement sapn元素
 * @param className 类名
 * @return boolean 是否应该保留其行内样式
 */
export function shouldPreserveInlineStyles(
  element: HTMLElement | SVGElement,
  className: string
): boolean {
  let currentElement: Element | null = element
  while (currentElement) {
    if (currentElement instanceof HTMLSpanElement && currentElement.classList.contains(className)) {
      return true
    }
    currentElement = currentElement.parentElement
  }
  return false
}

/**
 * @description: 递归处理元素将外部样式应用为内联样式
 * @param el 元素
 */
function applyInlineStyles(el: HTMLElement | SVGElement) {
  const cssStyleSheets = getSortedStyleSheets() // 样式表列表
  const isKatex = shouldPreserveInlineStyles(el, 'katex') // 是否为 katex 的 span 元素
  if (!isKatex) {
    cssStyleSheets.forEach(([styleSheet]) => {
      try {
        Array.from(styleSheet.cssRules).forEach((rule: CSSRule) => {
          if (rule instanceof CSSStyleRule) {
            // 检查选择器是否匹配当前元素
            if (el.matches(rule.selectorText)) {
              for (let i = 0; i < rule.style.length; i++) {
                const property = rule.style[i] // 属性名

                const cssStyplevalue = rule.style.getPropertyValue(property) // 样式表的属性值

                // 如果属性值不为空且不为默认值 或者 不是 katex 的 span 元素
                if (cssStyplevalue.startsWith('var(--')) {
                  // 如果值为 CSS 变量，获取计算后的具体值
                  el.style.setProperty(property, getComputedStyle(el).getPropertyValue(property))
                } else {
                  el.style.setProperty(property, cssStyplevalue)
                }
              }
            }
          }
        })
      } catch (error) {
        console.warn('Error accessing rules in stylesheet:', styleSheet, error)
      }
    })
  }

  // 递归处理子元素
  Array.from(el.children).forEach((child) => {
    if (child instanceof HTMLElement || child instanceof SVGElement) {
      applyInlineStyles(child as HTMLElement | SVGElement)
    }
  })
}

/**
 * @description: 复制带有自定义样式的内容
 * @param element 要复制的元素
 */
// export async function copyWithCustomStyle(element: HTMLElement): Promise<void> {
//   try {
//     // 将 katex 公式转成图片
//     await katexToImage(element)
//     // 将外部样式应用为内联样式
//     applyInlineStyles(element)

//     // 获取带有内联样式的 HTML 字符串
//     const html = element.innerHTML
//     // console.log('html', html)

//     if (typeof ClipboardItem !== 'undefined') {
//       // 创建一个包含要复制 HTML 的 blob
//       const contentNoStyle = new Blob([html], { type: 'text/plain' })
//       const contentWithStyle = new Blob([html], { type: 'text/html' })

//       // 使用 clipboardItem 设置格式和数据
//       const clipboardItemInput = new ClipboardItem({
//         'text/plain': contentNoStyle,
//         'text/html': contentWithStyle,
//       })

//       // 写入剪贴板
//       await navigator.clipboard.write([clipboardItemInput])
//       ShowMsgTip(ShowMsgTip.MsgType.success, '内容已复制到剪贴板')
//     } else {
//       ShowMsgTip(ShowMsgTip.MsgType.warning, '请升级你的浏览器以获得更好的复制功能支持')
//     }
//   } catch (err) {
//     console.error('无法复制内容', err)
//     ShowMsgTip(ShowMsgTip.MsgType.error, '无法复制内容')
//   }
// }

export async function copyWithCustomStyle(element: HTMLElement): Promise<void> {
  try {
    // 将 katex 公式转成图片
    await katexToImage(element)
    // 将外部样式应用为内联样式
    applyInlineStyles(element)

    // 获取带有内联样式的 HTML 字符串
    const html = element.innerHTML

    // if (window.location.protocol === 'https:' && typeof ClipboardItem !== 'undefined') {
    if (typeof ClipboardItem !== 'undefined') {
      // 创建一个包含要复制 HTML 的 blob
      console.log('新复制api')
      const contentNoStyle = new Blob([html], { type: 'text/plain' })
      const contentWithStyle = new Blob([html], { type: 'text/html' })

      // 使用 clipboardItem 设置格式和数据
      const clipboardItemInput = new ClipboardItem({
        'text/plain': contentNoStyle,
        'text/html': contentWithStyle
      })

      // 写入剪贴板
      await navigator.clipboard.write([clipboardItemInput])
      ShowMsgTip(ShowMsgTip.MsgType.success, '内容已复制到剪贴板')
    } else {
      console.log('老复制api')
      const textArea = document.createElement('textarea')
      textArea.style.position = 'fixed'
      textArea.style.top = '0'
      textArea.style.left = '0'
      textArea.value = html
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      try {
        const successful = document.execCommand('copy')
        const msg = successful ? '内容已复制到剪贴板' : '无法复制内容'
        ShowMsgTip(successful ? ShowMsgTip.MsgType.success : ShowMsgTip.MsgType.error, msg)
      } catch (err) {
        console.error('无法复制内容', err)
        ShowMsgTip(ShowMsgTip.MsgType.error, '无法复制内容')
      } finally {
        document.body.removeChild(textArea)
      }
    }
  } catch (err) {
    console.error('无法复制内容', err)
    ShowMsgTip(ShowMsgTip.MsgType.error, '无法复制内容')
  }
}
