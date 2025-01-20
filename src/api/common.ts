/**
 * @Author       : jiaopengzi
 * @Date         : 2024-11-08 12:51:21
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2025-01-20 16:07:04
 * @FilePath     : \blog-client\src\api\common.ts
 * @Description  : 公用
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

// postgresql 日期时间 格式
export interface PgSqlDateTime {
    Time: Date | null // 禁用到期时间
    Valid: boolean
}

// 使用ID列表删除请求参数
export interface DeleteByIDsRequest {
    id_list: string[]
}

// 发送测试邮件请求
export interface SendTestEmailRequest {
    email: string
}

// 验证码用途
export enum CaptchaPurpose {
    Register = "Register", // 验证码用途：注册
    ResetPassword = "ResetPassword", // 验证码用途：重置密码
    BindEmail = "BindEmail", // 验证码用途：绑定邮箱
}

// 社交登录方式
export enum SocialLoginType {
    WeChat = "WeChat",
    QQ = "QQ",
    Phone = "Phone",
}

// 社交登录方式显示
export const SocialLoginDisplay = {
    [SocialLoginType.QQ]: "QQ",
    [SocialLoginType.WeChat]: "微信",
    [SocialLoginType.Phone]: "手机号",
}
