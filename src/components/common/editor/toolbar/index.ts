/**
 * @Author       : jiaopengzi
 * @Date         : 2023-12-19 17:56:15
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-12-19 19:21:18
 * @FilePath     : \blog-client\src\components\common\editor\toolbar\index.ts
 * @Description  :
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved.
 */

export interface ToolbarProps {
  toobarBtns: Array<{ name: string; display: string; icon: string }> // 预览内容
  iconNumberPerLine?: number // iconNumberPerLine 可选 每行显示的图标个数 默认 20
}
