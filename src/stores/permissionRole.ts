/*
 * FilePath    : blog-client\src\stores\permissionRole.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 权限角色
 */

import { acceptHMRUpdate, defineStore } from "pinia"

import { getPermissionsAPI } from "@/api/permissionRole/getPermissions"
import { hasPermissionAPI } from "@/api/permissionRole/hasPermission"
import { getRolesAPI, type RoleWithLimit } from "@/api/permissionRole/role"
import { ResponseCode } from "@/api/response"
import { kebabToPascalCase } from "@/utils/namingConversion"

// 权限枚举
export enum PermissionNames {
    AddMediaByPost = "AddMediaByPost",
    AddAvatar = "AddAvatar",
    AddMedia = "AddMedia",
    EditMedia = "EditMedia",
    DeleteMedia = "DeleteMedia",
    ViewMedia = "ViewMedia",
    AddCategory = "AddCategory",
    EditCategory = "EditCategory",
    DeleteCategory = "DeleteCategory",
    ViewCategory = "ViewCategory",
    AddTag = "AddTag",
    EditTag = "EditTag",
    DeleteTag = "DeleteTag",
    ViewTag = "ViewTag",
    AddPost = "AddPost",
    EditPost = "EditPost",
    DeletePost = "DeletePost",
    ViewPost = "ViewPost",
    LoginAdmin = "LoginAdmin",
    Backup = "Backup",
    PermissionRole = "PermissionRole",
    AppOption = "AppOption",
    UserAdd = "UserAdd",
    UserDelete = "UserDelete",
    UserEdit = "UserEdit",
    UserView = "UserView",
    LoginLogView = "LoginLogView",
    LoginLogDelete = "LoginLogDelete",
}

// 定义权限接口
export interface Permission {
    permission_name: PermissionNames // 权限名称
    description: string // 权限描述
}

export interface PermissionRoleStore {
    roles: RoleWithLimit
    permissionList: Permission[]
    isLoadedPermissionRole: boolean
}

// 创建一个空的权限角色存储
function createEmptyPermissionRoleStore(): PermissionRoleStore {
    return {
        roles: {} as RoleWithLimit,
        permissionList: [],
        isLoadedPermissionRole: false,
    }
}

export const usePermissionRoleStore = defineStore("permissionRole", {
    state: () => createEmptyPermissionRoleStore(),

    getters: {
        // 获取网站配置
        getRoleList(): RoleWithLimit {
            return this.roles
        },

        // 权限列表
        getPermissionList(): Permission[] {
            return this.permissionList
        },

        // 是否已加载
        getIsLoaded(): boolean {
            return this.isLoadedPermissionRole
        },
    },

    actions: {
        // 获取网站配置, 参数为是否强制从服务器获取, 默认为false
        async update(is_get_from_server: boolean = false): Promise<void> {
            if (is_get_from_server) {
                await this.updateFromServer()
            }
        },

        // 从服务器更新权限角色
        async updateFromServer(): Promise<void> {
            // 获取角色列表
            const resRole = await getRolesAPI()
            // 获取权限列表
            const resPermission = await getPermissionsAPI()

            if (resRole.data.code === ResponseCode.GetRoleSuccess && resPermission.data.code === ResponseCode.GetPermissionSuccess) {
                this.roles = resRole.data.data
                this.permissionList = resPermission.data.data

                this.isLoadedPermissionRole = true
            }
        },

        // 判断是否有权限
        async hasPermissionByServer(permission: PermissionNames): Promise<boolean> {
            const res = await hasPermissionAPI({ permission_name: permission })
            return res.data.code === ResponseCode.HasPermission
        },

        // 开发环境下检查权限枚举是否有遗漏
        devCheckPermissionNames(): void {
            let newPermissionNames = ""
            const permissions = this.permissionList
            for (let i = 0; i < permissions.length; i++) {
                const keyPascalCase = kebabToPascalCase(permissions[i].permission_name)
                if (!(keyPascalCase in PermissionNames)) {
                    // 如果 key 中包含 - 则添加
                    const _enum = `${keyPascalCase} = '${keyPascalCase}',`
                    newPermissionNames += _enum + "\n"
                }
            }
            if (newPermissionNames) {
                console.error("前端权限和后端权限有差异:\n 请将如下内容添加到枚举 enum PermissionNames 中\n" + newPermissionNames)
            }
        },
    },
})

// 允许开发环境下进行热更新 HMR(Hot Module Replacement)
if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(usePermissionRoleStore, import.meta.hot))
}
