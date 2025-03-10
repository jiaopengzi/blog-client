/**
 * @FilePath     : \blog-client\src\stores\local.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 本地存储键名
 */

export enum LocalStorageKey {
    AccessToken = "access_token", // token名称：访问令牌
    RolesList = "roles_list", // 角色列表
    PermissionList = "permission_list", // 权限列表
    IsCollapse = "is_collapse", // 侧边栏是否折叠
    IsShowListOrGridAtMedia = "is_show_list_or_grid_at_media", // 媒体列表是否显示为列表或网格
    IsShowSeoAtPostWrite = "is_show_seo_at_post_write", // 文章写作是否显示SEO设置
}
