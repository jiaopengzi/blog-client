/**
 * FilePath    : blog-client\src\components\common\avatar-upload\avatarFileName.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 头像上传文件命名辅助
 */

import { renameFilePreservingMetadata, sanitizeFileNameSegment } from "@/utils/uploadFileName"

const DEFAULT_AVATAR_OWNER_NAME = "user"
const DEFAULT_AVATAR_EXTENSION = "png"

/**
 * sanitizeAvatarOwnerName 清理用户名中的非法文件名字符.
 * @param userName 原始用户名.
 * @returns 可安全用于文件名的用户名片段.
 */
export function sanitizeAvatarOwnerName(userName: string): string {
    return sanitizeFileNameSegment(userName, DEFAULT_AVATAR_OWNER_NAME)
}

/**
 * buildAvatarFileName 基于用户名生成头像上传文件名.
 * @param userName 当前头像所属用户名.
 * @returns 规范化后的头像文件名.
 */
export function buildAvatarFileName(userName: string): string {
    return `avatar-${sanitizeAvatarOwnerName(userName)}.${DEFAULT_AVATAR_EXTENSION}`
}

/**
 * prepareAvatarUploadFile 按头像命名规则准备上传文件.
 * @param file 原始裁剪结果文件.
 * @param userName 当前头像所属用户名.
 * @returns 已按业务规则重命名后的文件对象.
 */
export function prepareAvatarUploadFile(file: File, userName: string): File {
    return renameFilePreservingMetadata(file, buildAvatarFileName(userName))
}
