/**
 * @Author       : jiaopengzi
 * @Date         : 2024-01-11 12:37:13
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-11-11 18:17:56
 * @FilePath     : \blog-client\src\views\admin\index.ts
 * @Description  :
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

export { default } from "./index.vue"

import Dashboard from "./component/main/dashboard"
import PostWrite from "./component/main/post-write"
import PostTag from "./component/main/post-tag"
import PostCategory from "./component/main/post-category"
import Media from "./component/main/media"
import PermissionRole from "./component/main/permission-role"
import UserView from "./component/main/user-view"
import LoginLog from "./component/main/login-log"

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
