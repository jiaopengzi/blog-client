/**
 * @Author       : jiaopengzi
 * @Date         : 2024-01-11 12:37:13
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-11-06 15:03:26
 * @FilePath     : \blog-client\src\views\admin\index.ts
 * @Description  :
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

export { default } from "./index.vue"

import Dashboard from "@/views/admin/component/main/dashboard"
import PostWrite from "@/views/admin/component/main/post-write"
import PostTag from "@/views/admin/component/main/post-tag"
import PostCategory from "@/views/admin/component/main/post-category"
import Media from "@/views/admin/component/main/media"
import PermissionRole from "@/views/admin/component/main/permission-role"
import UserView from "@/views/admin/component/main/user-view"
import LoginLog from "@/views/admin/component/main/login-log"

// 将组件存放在一个对象内
export const components = {
    Dashboard,
    PostWrite,
    Media,
    PermissionRole,
    UserView,
    LoginLog,
    PostTag,
    PostCategory,
}
