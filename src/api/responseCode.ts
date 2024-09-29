/**
 * @Author       : jiaopengzi
 * @Date         : 2023-08-11 16:57:23
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-09-27 11:18:56
 * @FilePath     : \blog-client\src\api\responseCode.ts
 * @Description  : 响应码
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved.
 */

// 统一响应结构
export interface Res {
  code: number
  msg: string
  data: any // 可以根据实际返回的数据结构替换为更具体的类型
}

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
  // 用户相关
  UserRegisterSuccess = 1000, //用户注册成功
  UserNameExist = 1001, //用户名已存在
  UserEmailExist = 1002, //用户邮箱已存在
  UserLoginSuccess = 1008, //用户登录成功
  UserLoginNameExist = 1010, //用户登录名已存在
  UserResetPasswordFailed = 1022, //重置密码失败
  UserResetPasswordSuccess = 1023, //重置密码成功
  UserGetInfoSuccess = 1024, //获取用户信息成功
  UserBindEmailSuccess = 1026, //绑定邮箱成功
  UserEditUserInfoSuccess = 1027, //修改用户信息成功
  UserGetAllSuccess = 1029, //查询所有用户成功
  NoUsersFound = 1030, //查询所有用户成功
  GetUserCountGroupByRolesSuccess = 1031, //查询用户统计成功
  DeleteUserSuccess = 1032, //删除用户成功
  UserAddUserSuccess = 1034, //添加用户成功
  UserEditUserSuccess = 1035, //编辑用户成功
  UserNameExistExcludingUserID = 1035, //用户名已存在，排除指定用户ID
  EmailExistExcludingUserID = 1037, //用户邮箱已存在，排除指定用户ID
  EditUserInfoByAdminSuccess = 1039, //管理员编辑用户成功
  UserLogoutByAdminSuccess = 1040, //管理员登出用户成功
  UserForbidden = 1041, //用户禁用

  // 验证码相关
  CaptchaSendSuccess = 8000, //验证码发送成功
  CaptchaCheckSuccess = 8002, //验证码发送成功

  // 社交登录相关
  SocialLoginQQSuccess = 8200, //重定向QQ登录成功
  SocialLoginQQUnLogin = 8201, //QQ未登录
  SocialLoginQQCallbackSuccess = 8202, //QQ登录成功回调
  SocialBindQQCallbackSuccess = 8203, //QQ绑定成功回调
  SocialUnBindQQSuccess = 8204, //QQ解绑成功

  SocialLoginWeChatSuccess = 8205, //重定向微信登录成功
  SocialLoginWeChatUnLogin = 8206, //微信未登录
  SocialLoginWeChatCallbackSuccess = 8207, //微信登录成功回调
  SocialBindWeChatCallbackSuccess = 8208, //微信绑定成功回调
  SocialUnBindWeChatSuccess = 8209, //微信解绑成功

  GetPermissionSuccess = 8300, //获取权限列表成功
  HasPermission = 8305, //判断是否有权限成功
  GetRoleSuccess = 8400, //获取角色列表成功
  UpdateRoleSuccess = 8403, //更新角色成功
  UpsertPermissionRoleSuccess = 8404, //更新角色权限成功
  DeletePermissionRoleSuccess = 8405, //删除角色权限成功
  GetPermissionRoleSuccess = 8407, //获取角色权限成功

  GetLoginLogsSuccess = 8500, //获取登录日志成功
  LoginLogDeleteByIDsSuccess = 8502, //通过ID删除登录日志成功
  LoginLogDeleteByDaySuccess = 8503, //通过天数删除登录日志成功
  VideoNotFound = 8600, // 视频不存在
  GetVideoMainM3u8Success = 8601, // 获取视频主M3u8成功
  GetVideoM3u8Success = 8602, // 获取视频M3u8成功
  GetVdideoKeySuccess = 8603, // 获取视频解密密钥成功

  ClientIPTooManyRequests = 9006, //客户端IP请求次数过多
  ClientIDTooManyRequests = 9007, //客户端ID请求次数过多
}

// 验证码用途
export enum CaptchaPurpose {
  Register = 'Register', // 验证码用途：注册
  ResetPassword = 'ResetPassword', // 验证码用途：重置密码
  BindEmail = 'BindEmail', // 验证码用途：绑定邮箱
}

// token名称
export enum LocalStorageKey {
  AccessToken = 'access_token', // token名称：访问令牌
}

// 用户信息
export enum UploadCode {
  Success = 8100, // 上传头像成功
  NotAllow = 8101, // 上传不被允许
  GetUploadFileRequirementsSuccess = 8102, // 获取允许上传的文件信息成功
  ConfirmBeforeUploadSuccess = 8104, // 确认上传前成功
  UploadFileSuccess = 8105, // 上传文件成功
  ConfirmAfterUploadBySignedUrlSuccess = 8107, // 使用签名URL上传文件后确认成功
  GetFileCountGroupByTypeSuccess = 8108, // 获取文件统计成功
  GetAllSuccess = 8110, // 获取媒体信息成功
  FileDeleteSuccess = 8111, // 删除文件成功
  GetUploadFileUrlSuccess = 8113, // 获取上传文件URL成功
  SetAvatarSuccess = 8114, // 设置头像成功
}

// 社交登录
export enum Social {
  QQ = 'qq',
  QQDisplay = 'QQ',
  WeChat = 'wechat',
  WeChatDisplay = '微信',
}
