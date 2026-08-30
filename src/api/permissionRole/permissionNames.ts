/*
 * FilePath    : blog-client-nuxt\src\api\permissionRole\permissionNames.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 权限名枚举 (feature01 260829-08: 自 stores/permissionRole.ts 抽出)
 */

/*
 * 补充说明:
 * 权限名是后端 has-permission 接口的参数契约(与 ResponseCode 同性质的纯常量),
 * 抽为独立零依赖纯枚举文件后, Nitro server 边界(server/routes/internal/cache-invalidate.post.ts)
 * 可直接 import, 不再拉入 pinia store 链; stores/permissionRole.ts 经 re-export 保持既有引用不变.
 */

// 权限枚举
export enum PermissionNames {
    LoginAdmin = "LoginAdmin",
    ViewDashboard = "ViewDashboard",
    AddMediaByPost = "AddMediaByPost",
    AddAvatar = "AddAvatar",
    PermissionRole = "PermissionRole",
    AddPost = "AddPost",
    EditPost = "EditPost",
    DeletePost = "DeletePost",
    ViewPost = "ViewPost",
    AddCategory = "AddCategory",
    EditCategory = "EditCategory",
    DeleteCategory = "DeleteCategory",
    ViewCategory = "ViewCategory",
    AddTag = "AddTag",
    EditTag = "EditTag",
    DeleteTag = "DeleteTag",
    ViewTag = "ViewTag",
    AddMedia = "AddMedia",
    EditMedia = "EditMedia",
    DeleteMedia = "DeleteMedia",
    ViewMedia = "ViewMedia",
    AddLink = "AddLink",
    EditLink = "EditLink",
    DeleteLink = "DeleteLink",
    ViewLink = "ViewLink",
    AddComment = "AddComment",
    EditComment = "EditComment",
    DeleteComment = "DeleteComment",
    ViewComment = "ViewComment",
    UserAdd = "UserAdd",
    UserDelete = "UserDelete",
    UserEdit = "UserEdit",
    UserView = "UserView",
    LoginLogView = "LoginLogView",
    LoginLogDelete = "LoginLogDelete",
    Shop = "Shop",
    AppOption = "AppOption",
    Notification = "Notification",
}
