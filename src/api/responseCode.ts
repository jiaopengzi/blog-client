/**
 * @Author       : jiaopengzi
 * @Date         : 2023-08-11 16:57:23
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-10-01 14:16:28
 * @FilePath     : \blog-client\src\api\responseCode.ts
 * @Description  : 响应码
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved.
 */

export enum ResponseCode {
  SUCCESS = 200,
  ERROR = 500,
  NOT_FOUND = 404,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  BAD_REQUEST = 400,
  CREATED = 201,
  ACCEPTED = 202,
  NO_CONTENT = 204,
  RESET_CONTENT = 205,
  PARTIAL_CONTENT = 206,
  MOVED_PERMANENTLY = 301,
  FOUND = 302,
  SEE_OTHER = 303,
  NOT_MODIFIED = 304,
  USE_PROXY = 305,
  TEMPORARY_REDIRECT = 307,
  PERMANENT_REDIRECT = 308,
  BAD_GATEWAY = 502,
  SERVICE_UNAVAILABLE = 503,
  GATEWAY_TIMEOUT = 504,
  HTTP_VERSION_NOT_SUPPORTED = 505,
  NETWORK_AUTHENTICATION_REQUIRED = 511,

  // 自定义

  UserRegisterSuccess = 1000, //用户注册成功
  UserNameExist = 1001, //用户名已存在
  UserEmailExist = 1002, //用户邮箱已存在
  UserLoginSuccess = 1008, //用户登录成功
  UserLoginNameExist = 1010, //用户登录名已存在
  UserResetPasswordFailed = 1022, //重置密码失败
  UserResetPasswordSuccess = 1023, //重置密码成功

  CaptchaSendSuccess = 8000, //验证码发送成功
  CaptchaCheckSuccess = 8002, //验证码发送成功
}
export enum CaptchaPurpose {
  Register = 'Register', // 验证码用途：注册
  ResetPassword = 'ResetPassword', // 验证码用途：重置密码
}
