/**
 * @Author       : jiaopengzi
 * @Date         : 2024-06-19 22:34:32
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-06-19 22:53:59
 * @FilePath     : \blog-client\src\utils\regexPatterns.ts
 * @Description  : 统一正则表达式
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

// 正则枚举常量 RegexPatterns
export enum RegexPatterns {
  UserName = '^[a-z0-9]{6,20}$', // 用户名长度:6-20的小写字母或数字
  NickName = '^.{1,20}$', // 昵称长度1-20字符
  Email = '^([a-z0-9._%+-]+)@[a-z0-9.-]+\\.[a-z]{2,}$', // 小写的邮箱地址
  Captcha = '^\\d{6}$', //验证码为6位的数字
  Password = '^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{6,64}$', //大小写字母+数字,长度:6-64
  LoginName = '^([a-z0-9._%+-]+)@[a-z0-9.-]+\\.[a-z]{2,}$|^[a-z0-9]{6,20}$', // 用户名或邮箱
  DisableSeconds = '^[1-9]\\d*$' // 正整数 禁用时间 秒
}
