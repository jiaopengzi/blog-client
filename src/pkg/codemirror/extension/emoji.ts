/**
 * @Author       : jiaopengzi
 * @Date         : 2023-12-21 23:01:55
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-12-21 23:34:22
 * @FilePath     : \blog-client\src\pkg\codemirror\extension\emoji.ts
 * @Description  :
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved.
 */

import { EditorState, Compartment } from '@codemirror/state'
import { htmlLanguage, html } from '@codemirror/lang-html'
import { language } from '@codemirror/language'
import { javascript } from '@codemirror/lang-javascript'
type Emoji = {
  label: string
  detail: string
}

const emojiList: Emoji[] = [
  { label: '😀', detail: ':grinning:' },
  { label: '😃', detail: ':smiley:' },
  // ... 省略其他表情
]

export const languageConf = new Compartment()

export const autoLanguage = EditorState.transactionExtender.of((tr) => {
  if (!tr.docChanged) return null
  const docIsHTML = /^\s*</.test(tr.newDoc.sliceString(0, 100))
  const stateIsHTML = tr.startState.facet(language) == htmlLanguage
  if (docIsHTML == stateIsHTML) return null
  return {
    effects: languageConf.reconfigure(docIsHTML ? html() : javascript()),
  }
})
