/*
 * FilePath    : blog-client\src\stores\permissionRole.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 权限角色
 */

import { acceptHMRUpdate, defineStore } from "pinia"

import { getMembershipRolesAPI } from "@/api/membership/getRoles"
import { getPermissionsAPI } from "@/api/permissionRole/getPermissions"
import { hasPermissionAPI } from "@/api/permissionRole/hasPermission"
import { getRolesAPI, type RoleWithLimit } from "@/api/permissionRole/role"
import { ResponseCode } from "@/api/response"
import { kebabToPascalCase } from "@/utils/namingConversion"

import { LocalStorageKey } from "./local"

/**
 * PostDetailEditCacheScope 文章详情编辑权限缓存作用域枚举。
 * 用于区分匿名态与已认证态的本地权限缓存, 避免不同登录态之间互相污染。
 */
export enum PostDetailEditCacheScope {
    Anonymous = "anonymous",
    Authenticated = "authenticated",
}

/**
 * PostDetailEditCachePayload 文章详情编辑权限缓存结构。
 * 用于持久化当前缓存作用域及对应的编辑权限值。
 */
interface PostDetailEditCachePayload {
    scope: PostDetailEditCacheScope
    enabled: boolean
}

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

// 定义权限接口
export interface Permission {
    permission_name: PermissionNames // 权限名称
    description: string // 权限描述
}

export interface PermissionRoleStore {
    roles: RoleWithLimit
    permissionList: Permission[]
    membershipRoles: string[] // 会员角色列表
    isLoadedPermissionRole: boolean
}

// 创建一个空的权限角色存储
function createEmptyPermissionRoleStore(): PermissionRoleStore {
    return {
        roles: {} as RoleWithLimit,
        permissionList: [],
        membershipRoles: [],
        isLoadedPermissionRole: false,
    }
}

export const usePermissionRoleStore = defineStore("permissionRole", {
    state: () => createEmptyPermissionRoleStore(),

    getters: {
        // 获取系统角色列表
        getSystemRoles(): RoleWithLimit {
            return this.roles
        },

        // 权限列表
        getPermissionList(): Permission[] {
            return this.permissionList
        },

        // 获取会员角色列表
        getMembershipRoles(): string[] {
            return this.membershipRoles
        },

        // 是否已加载
        getIsLoaded(): boolean {
            return this.isLoadedPermissionRole
        },
    },

    actions: {
        /**
         * readPostDetailEditCache 读取文章详情编辑权限缓存。
         * 仅当缓存作用域与当前登录态一致时才返回缓存值。
         * @param scope - 当前权限缓存作用域。
         * @returns 命中缓存时返回权限值, 否则返回 null。
         */
        readPostDetailEditCache(scope: PostDetailEditCacheScope): boolean | null {
            const localStorageData = localStorage.getItem(LocalStorageKey.PostDetailEditEnable)

            if (!localStorageData) {
                return null
            }

            try {
                const payload = JSON.parse(localStorageData) as boolean | PostDetailEditCachePayload

                if (typeof payload === "boolean") {
                    return scope === PostDetailEditCacheScope.Anonymous ? payload : null
                }

                if (payload?.scope !== scope || typeof payload.enabled !== "boolean") {
                    return null
                }

                return payload.enabled
            } catch {
                return null
            }
        },

        /**
         * writePostDetailEditCache 写入文章详情编辑权限缓存。
         * 会同时记录当前登录态作用域, 以便后续按作用域读取。
         * @param scope - 当前权限缓存作用域。
         * @param enabled - 当前权限值。
         * @returns 无返回值。
         */
        writePostDetailEditCache(scope: PostDetailEditCacheScope, enabled: boolean): void {
            const payload: PostDetailEditCachePayload = {
                scope,
                enabled,
            }

            localStorage.setItem(LocalStorageKey.PostDetailEditEnable, JSON.stringify(payload))
        },

        /**
         * update 按需更新权限角色相关数据。
         * 仅当明确要求强制从服务器获取时, 才会触发远端更新。
         * @param is_get_from_server - 是否强制从服务器刷新权限角色数据, 默认为 false。
         * @returns Promise 在更新流程结束后完成。
         */
        async update(is_get_from_server: boolean = false): Promise<void> {
            if (is_get_from_server) {
                await this.updateFromServer()
            }
        },

        /**
         * updateFromServer 从服务器更新权限角色与会员角色数据。
         * 会依次请求角色列表, 权限列表和会员角色列表, 并在成功后更新 store。
         * @returns Promise 在全部请求处理完成后结束。
         */
        async updateFromServer(): Promise<void> {
            // 获取角色列表
            const resRole = await getRolesAPI()
            if (resRole.data.code === ResponseCode.GetRoleSuccess) {
                this.roles = resRole.data.data
            }

            // 获取权限列表
            const resPermission = await getPermissionsAPI()
            if (resPermission.data.code === ResponseCode.GetPermissionSuccess) {
                this.permissionList = resPermission.data.data
            }

            // 获取会员角色列表
            const resRoleMembership = await getMembershipRolesAPI()
            if (resRoleMembership.data.code === ResponseCode.MembershipGetRolesSuccess) {
                this.membershipRoles = resRoleMembership.data.data
            }

            this.isLoadedPermissionRole = true
        },

        /**
         * hasPermissionByServer 通过服务端接口判断当前用户是否具备指定权限。
         * @param permission - 待校验的权限名称。
         * @returns Promise 解析为布尔值, true 表示具备权限。
         */
        async hasPermissionByServer(permission: PermissionNames): Promise<boolean> {
            const res = await hasPermissionAPI({ permission_name: permission })
            return res.data.code === ResponseCode.HasPermission
        },

        /**
         * postDetailEditEnable 获取文章详情编辑权限。
         * 优先读取与当前登录态匹配的本地缓存, 未命中时再请求服务端并回写缓存。
         * @param scope - 当前权限缓存作用域, 默认为匿名态。
         * @param isFromServer - 是否跳过缓存并强制从服务器获取, 默认为 false。
         * @returns Promise 解析为是否允许在文章详情页展示编辑入口。
         */
        async postDetailEditEnable(scope: PostDetailEditCacheScope = PostDetailEditCacheScope.Anonymous, isFromServer = false): Promise<boolean> {
            if (!isFromServer) {
                const cachedFlag = this.readPostDetailEditCache(scope)
                if (cachedFlag !== null) {
                    return cachedFlag
                }
            }

            // 如果没有, 则从服务器获取权限, 并存入本地
            const flag = await this.hasPermissionByServer(PermissionNames.LoginAdmin)

            this.writePostDetailEditCache(scope, flag)

            return flag
        },

        // 开发环境下检查权限枚举是否有遗漏
        async devCheckPermissionNames(): Promise<void> {
            await this.updateFromServer()
            let newPermissionNames = ""
            const permissions = this.permissionList
            for (let i = 0; i < permissions.length; i++) {
                const keyPascalCase = kebabToPascalCase(permissions[i]!.permission_name)
                if (!(keyPascalCase in PermissionNames)) {
                    // 如果 key 中包含 - 则添加
                    const enumEntry = `${keyPascalCase} = '${keyPascalCase}',`
                    newPermissionNames += enumEntry + "\n"
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
