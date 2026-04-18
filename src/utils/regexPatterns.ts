/**
 * @FilePath     : \blog-client\src\utils\regexPatterns.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 统一正则表达式
 */

export const RegexPatterns = {
    UserName: /^[a-z][a-z0-9]{5,19}$/, // 用户名长度:6-20的小写字母或数字
    NickName: /^.{1,20}$/, // 昵称长度1-20字符
    Email: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, // 邮箱地址
    Captcha: /^\d{6}$/, //验证码为6位的数字
    Password:
        /(^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,64}$)|(^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$)/, //大小写字母+数字,长度:6-64
    LoginName:
        /(^[a-z][a-z0-9]{5,19}$)|((^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,64}$)|(^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$))/, // 用户名或邮箱
    DisableSeconds: /^[1-9]\d*$/, // 正整数 禁用时间 秒
    Slug: /^(?:[a-zA-Z0-9-._~+]|%[0-9A-Fa-f]{2})+$/, // slug
    SeoKeyWords: /^([a-zA-Z0-9\u4e00-\u9fa5;-]+( [a-zA-Z0-9\u4e00-\u9fa5;-]+)*)(,([a-zA-Z0-9\u4e00-\u9fa5;-]+( [a-zA-Z0-9\u4e00-\u9fa5;-]+)*))*$/, // SEO关键字

    ImgURL: /^https?:\/\/(.+\/)+.+(\.(gif|png|jpg|jpeg|webp|svg|psd|bmp|tif|ico))([?!=!].*)?$/i, // 图片URL

    URL: /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/, // URL

    IsTrim: /^\s+|\s+$/, // 匹配首尾是否有空格
} as const

export type RegexPatterns = (typeof RegexPatterns)[keyof typeof RegexPatterns]
