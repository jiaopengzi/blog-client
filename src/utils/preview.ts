/**
 * @Author       : jiaopengzi
 * @Date         : 2023-12-27 16:55:44
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-12-28 23:53:42
 * @FilePath     : \blog-client\src\utils\preview.ts
 * @Description  : 处理预览html
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved.
 */
import { ShowMsgTip } from '@/utils/message'
// import { cssToInline } from '@/utils/style'
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

// function applyComputedStyle(srcElement: HTMLElement, targetElement: HTMLElement) {
//   const styleSheets = Array.from(document.styleSheets)

//   // 遍历文档中的所有样式表
//   styleSheets.forEach((sheet) => {
//     const cssRules = sheet.cssRules ? Array.from(sheet.cssRules) : []

//     // 遍历每个样式表中的规则
//     cssRules.forEach((rule) => {
//       if (rule instanceof CSSStyleRule) {
//         const selector = rule.selectorText

//         // 检查规则是否适用于 srcElement
//         if (srcElement.matches(selector)) {
//           for (let i = 0; i < rule.style.length; i++) {
//             const property = rule.style[i] as string
//             targetElement.style[property] = getComputedStyle(srcElement).getPropertyValue(property)
//           }
//         }
//       }
//     })
//   })
// }

// // 克隆给定元素，并将计算后的样式应用为内联样式
// /**
//  * @description: 克隆给定元素，并将计算后的样式应用为内联样式
//  * @param srcElement 要克隆的元素
//  * @return        克隆的元素
//  */
// function cloneWithInlineStyles(srcElement: HTMLElement): HTMLElement {
//   const clonedElement = srcElement.cloneNode(true) as HTMLElement // 深度克隆
//   applyComputedStyle(srcElement, clonedElement) // 将计算后的样式从源元素复制到克隆元素

//   // 遍历子元素并复制其样式
//   const children = srcElement.querySelectorAll('*') // 获取所有子元素
//   const clonedChildren = clonedElement.querySelectorAll('*') // 获取所有子元素

//   children.forEach((child, index) => {
//     applyComputedStyle(child as HTMLElement, clonedChildren[index] as HTMLElement) // 将计算后的样式从源元素复制到克隆元素
//   })

//   return clonedElement // 返回克隆的元素
// }

// /**
//  * @description: 复制带样式的html
//  * @param element 要复制的元素
//  * @return promise void
//  */
// export async function copyWithCustomStyle(element: HTMLElement): Promise<void> {
//   // 使用计算后的样式克隆元素，将其应用为内联样式
//   // const clonedElement = cloneWithInlineStyles(element)

//   // 获取纯文本和 HTML 字符串
//   const text = element.innerText
//   const html = element.innerHTML

//   try {
//     // 创建一个包含要复制 HTML 的 blob
//     const blob = new Blob([html], { type: 'text/html' })

//     // 使用 clipboardItem 设置格式和数据
//     const clipboardItemInput = new ClipboardItem({
//       'text/plain': new Blob([text], { type: 'text/plain' }),
//       'text/html': blob,
//     })

//     // 写入剪贴板
//     await navigator.clipboard.write([clipboardItemInput])

//     ShowMsgTip(ShowMsgTip.MsgType.success, '内容已复制到剪贴板')
//   } catch (err) {
//     console.error('无法复制内容', err)
//     ShowMsgTip(ShowMsgTip.MsgType.error, '无法复制内容')
//   }
// }

function applyInlineStyles(element: HTMLElement): void {
  const computedStyles = getComputedStyle(element)
  const defaultElement = document.createElement(element.tagName)

  // 将默认元素添加到 DOM 中以计算其样式
  element.parentElement.appendChild(defaultElement)
  const defaultStyles = getComputedStyle(defaultElement)

  // 比较计算样式与默认元素的计算样式
  for (let i = 0; i < computedStyles.length; i++) {
    const property = computedStyles[i]
    const elementStyleValue = computedStyles.getPropertyValue(property)
    const defaultStyleValue = defaultStyles.getPropertyValue(property)

    if (elementStyleValue !== defaultStyleValue) {
      // console.log(property, elementStyleValue, defaultStyleValue);
      element.style.setProperty(property, elementStyleValue)
    }
  }

  // 从 DOM 中移除默认元素
  element.parentElement.removeChild(defaultElement)

  Array.from(element.children).forEach((child: Element) => {
    if (child instanceof HTMLElement) {
      applyInlineStyles(child)
    }
  })
}

// export async function copyWithCustomStyle(element: HTMLElement): Promise<void> {
//   try {
//     // 将外部样式应用为内联样式
//     // const clonedElement = element.cloneNode(true) as HTMLElement // 深度克隆
//     applyInlineStyles(element)

//     // 获取带有内联样式的 HTML 字符串
//     const html = element.outerHTML

//     // 创建一个包含要复制 HTML 的 blob
//     const blob = new Blob([html], { type: 'text/html' })

//     // 使用 clipboardItem 设置格式和数据
//     const clipboardItemInput = new ClipboardItem({
//       'text/plain': new Blob([html], { type: 'text/plain' }),
//       'text/html': blob,
//     })

//     // 写入剪贴板
//     await navigator.clipboard.write([clipboardItemInput])

//     ShowMsgTip(ShowMsgTip.MsgType.success, '内容已复制到剪贴板')
//   } catch (err) {
//     console.error('无法复制内容', err)
//     ShowMsgTip(ShowMsgTip.MsgType.error, '无法复制内容')
//   }
// }

export async function copyWithCustomStyle(element: HTMLElement): Promise<void> {
  // 创建一个点击事件监听器
  // const handleClick = async () => {
  //   const htmlContent = element.innerHTML

  //   try {
  //     // 创建一个包含HTML内容的Blob对象
  //     const blob = new Blob([htmlContent], { type: 'text/html' })

  //     // 使用Blob对象创建ClipboardItem并写入剪贴板
  //     const clipboardItem = new ClipboardItem({ 'text/html': blob })
  //     await navigator.clipboard.write([clipboardItem])

  //     alert('已复制好，可贴粘。')
  //   } catch (err) {
  //     console.warn('复制失败', err)
  //   }
  // }

  // document.addEventListener('click', handleClick)

  // 在组件销毁时移除事件监听器（假设组件支持生命周期）
  // onUnmounted(() => {
  //     document.removeEventListener('click', handleClick);
  // });
}
