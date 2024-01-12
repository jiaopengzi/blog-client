/**
 * @Author       : jiaopengzi
 * @Date         : 2024-01-11 20:51:22
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-01-11 22:06:43
 * @FilePath     : \blog-client\src\components\layout\header-nav\index.ts
 * @Description  :
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import { IconKeys } from '@/components/common/icons'

export interface HeaderNavPropsItem {
  path: string
  iconKey?: IconKeys
  title?: string
  customClass?: string
}

export { default } from './index.vue'
