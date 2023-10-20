/**
 * @Author       : jiaopengzi
 * @Date         : 2023-08-11 16:57:23
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-10-20 22:33:29
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
  UserGetInfoSuccess = 1024, //重置密码成功

  CaptchaSendSuccess = 8000, //验证码发送成功
  CaptchaCheckSuccess = 8002, //验证码发送成功

  SocialLoginQQSuccess = 8200, //重定向QQ登录成功
  SocialLoginQQUnLogin = 8201, //QQ未登录
  SocialLoginQQCallbackSuccess = 8202, //QQ登录成功回调
  SocialBindQQCallbackSuccess = 8203, //QQ绑定成功回调

  SocialLoginWechatSuccess = 8204, //重定向微信登录成功
  SocialLoginWechatUnLogin = 8205, //微信未登录
  SocialLoginWechatCallbackSuccess = 8206, //微信登录成功回调
}
export enum CaptchaPurpose {
  Register = 'Register', // 验证码用途：注册
  ResetPassword = 'ResetPassword', // 验证码用途：重置密码
}

export enum LocalStorageKey {
  AccessToken = 'access_token', // 验证码用途：注册
}

export enum UploadCode {
  AvatarSuccess = 8100, // 上传头像成功
  AvatarTooLarge = 8101, // 上传头像失败：文件过大
}
