/**
 * @Author       : jiaopengzi
 * @Date         : 2024-03-07 14:24:11
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-09-30 16:02:07
 * @FilePath     : \blog-client\src\utils\permissionRole.ts
 * @Description  : 权限工具类
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

// 从 API 获取权限列表
import type { Directive, DirectiveBinding } from "vue"
import { getPermissionsByJson } from "@/api/permissionRole/getPermissions"
import { getRolesByJson, type RoleWithLimit } from "@/api/permissionRole/role"
import { ResponseCode, LocalStorageKey } from "@/api/responseCode"
import { kebabToPascalCase } from "@/utils/namingConversion"
import { hasPermissionAPI } from "@/api/permissionRole/hasPermission"
import { useUserStore } from "@/stores/user"

// 权限枚举
export enum PermissionNames {
    AddMediaByPost = "AddMediaByPost",
    AddAvatar = "AddAvatar",
    AddMedia = "AddMedia",
    EditMedia = "EditMedia",
    DeleteMedia = "DeleteMedia",
    ViewMedia = "ViewMedia",
    AddPost = "AddPost",
    EditPost = "EditPost",
    DeletePost = "DeletePost",
    ViewPost = "ViewPost",
    LoginAdmin = "LoginAdmin",
    Backup = "Backup",
    PermissionRole = "PermissionRole",
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

// 请求参数
interface GetRolesListParams {
    useCache?: boolean
}

// import { getRolesList, getPermissionList, PermissionNames, type Permission } from '@/utils/permissionRole'

/**
 * @description: 获取角色列表
 * @param {GetRolesListParams} params - 参数
 * @return {Promise<RoleWithLimit>}
 */
export async function getRolesList(params: GetRolesListParams = {}): Promise<RoleWithLimit> {
    const { useCache = true } = params // 默认使用缓存

    if (useCache) {
        const cachedData = localStorage.getItem(LocalStorageKey.RolesList)
        if (cachedData) {
            return JSON.parse(cachedData)
        }
    }

    const res = await getRolesByJson()
    if (res.data.code === ResponseCode.GetRoleSuccess) {
        const data = res.data.data
        localStorage.setItem(LocalStorageKey.RolesList, JSON.stringify(data))
        return data
    }

    return { roles: [], permission_role: {} }
}

// 请求参数
interface GetPermissionListParams {
    useCache?: boolean
}

/**
 * @description: 获取权限列表
 * @param {GetPermissionListParams} params - 参数
 * @return {Promise<Permission[]>}
 */
export async function getPermissionList(
    params: GetPermissionListParams = {},
): Promise<Permission[]> {
    const { useCache = true } = params // 默认使用缓存

    if (useCache) {
        const cachedData = localStorage.getItem(LocalStorageKey.PermissionList)
        if (cachedData) {
            return JSON.parse(cachedData)
        }
    }

    const res = await getPermissionsByJson()
    if (res.data.code === ResponseCode.GetPermissionSuccess) {
        const data = res.data.data
        localStorage.setItem(LocalStorageKey.PermissionList, JSON.stringify(data))
        return data
    }

    return []
}

// 判断是否有权限
export async function hasPermissionByServer(permission: PermissionNames): Promise<boolean> {
    const res = await hasPermissionAPI({ permission_name: permission })
    return res.data.code === ResponseCode.HasPermission
}

// 权限指令,如果没有权限则移除元素.
export const permissionDirective: Directive = {
    mounted(el: HTMLElement, binding: DirectiveBinding<PermissionNames>) {
        // 获取用户信息
        const userStore = useUserStore()
        const permission = binding.value
        const hasPerm = userStore.hasPermission(permission)
        if (!hasPerm) {
            el.parentNode?.removeChild(el)
        }
    },
}

// 开发环境下检查权限枚举是否有遗漏
export async function devPermissionNames() {
    let newPermissionNames = ""
    const res = await getPermissionsByJson()
    if (res.data.code === ResponseCode.GetPermissionSuccess) {
        const permissions = res.data.data
        for (let i = 0; i < permissions.length; i++) {
            const keyPascalCase = kebabToPascalCase(permissions[i].permission_name)
            if (!(keyPascalCase in PermissionNames)) {
                // 如果 key 中包含 - 则添加
                const _enum = `${keyPascalCase} = '${keyPascalCase}',`
                newPermissionNames += _enum + "\n"
            }
        }
        if (newPermissionNames) {
            console.error(
                "前端权限和后端权限有差异:\n 请将如下内容添加到枚举 enum PermissionNames 中\n" +
                    newPermissionNames,
            )
        }
    }
}
