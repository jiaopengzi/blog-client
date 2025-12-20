/**
 * FilePath    : blog-client-dev\src\api\user\common.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 共用
 */

// 获取访问令牌
export interface AccessTokenResponse {
    access_token: string // 访问令牌
    login_name: string // 登录名(用户名/邮箱)
    disable_expires_at: string // 禁用过期时间 单位秒, 0 未被禁用
}
