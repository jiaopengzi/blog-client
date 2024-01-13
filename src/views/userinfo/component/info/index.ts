/**
 * @Author       : jiaopengzi
 * @Date         : 2024-01-12 20:58:08
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-01-12 21:02:11
 * @FilePath     : \blog-client\src\components\layout\content\userinfo\info\index.ts
 * @Description  :
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

export { default } from './index.vue'

// info 表单数据
export interface EditForm {
  userName: string
  nickName: string
  sex: string
  description: string
}
