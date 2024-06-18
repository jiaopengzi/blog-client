/**
 * @Author       : jiaopengzi
 * @Date         : 2024-06-18 08:46:52
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-06-18 13:55:56
 * @FilePath     : \blog-client\src\views\admin\component\main\user-view\component\edit-user\index.ts
 * @Description  : 编辑用户
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */
export { default } from './index.vue'

export interface EditUserByAdminForm {
  excludingUserID: string
  userName: string
  email: string
  status: string
  password: string
  roleName: string
  nickName: string
  sex: string
  description: string
}
