/**
 * @Author       : jiaopengzi
 * @Date         : 2024-01-11 12:37:13
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-09-04 22:08:46
 * @FilePath     : \blog-client\src\views\admin\index.ts
 * @Description  :
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

export { default } from './index.vue'
import { defineAsyncComponent } from 'vue'

// import Dashborad from '@/views/admin/component/main/dashborad'
// import PostWrite from '@/views/admin/component/main/post-write'
// import PostCategory from '@/views/admin/component/main/post-category'
// import Media from '@/views/admin/component/main/media'
// import PermissionRole from '@/views/admin/component/main/permission-role'
// import UserView from '@/views/admin/component/main/user-view'
// import LoginLog from '@/views/admin/component/main/login-log'

const Dashborad = defineAsyncComponent(() => import('@/views/admin/component/main/dashborad'))
const PostWrite = defineAsyncComponent(() => import('@/views/admin/component/main/post-write'))
const Media = defineAsyncComponent(() => import('@/views/admin/component/main/media'))
const PermissionRole = defineAsyncComponent(
  () => import('@/views/admin/component/main/permission-role'),
)
const UserView = defineAsyncComponent(() => import('@/views/admin/component/main/user-view'))
const LoginLog = defineAsyncComponent(() => import('@/views/admin/component/main/login-log'))

// 将组件存放在一个对象内
export const components = {
  Dashborad,
  PostWrite,
  Media,
  PermissionRole,
  UserView,
  LoginLog,
}
