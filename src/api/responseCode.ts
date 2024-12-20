/**
 * @Author       : jiaopengzi
 * @Date         : 2023-08-11 16:57:23
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-18 12:01:47
 * @FilePath     : \blog-client\src\api\responseCode.ts
 * @Description  : 响应码
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved.
 */

import type { AxiosResponse } from "axios"

// 统一响应结构
export interface Res<T> {
    code: number
    msg: string
    data: T // 可以根据实际返回的数据结构替换为更具体的类型
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
    UserNameExistExcludingUserID = 1035, //用户名已存在，排除指定用户ID
    EmailExistExcludingUserID = 1037, //用户邮箱已存在，排除指定用户ID
    EditUserInfoByAdminSuccess = 1039, //管理员编辑用户成功
    UserLogoutByAdminSuccess = 1040, //管理员登出用户成功
    UserForbidden = 1041, //用户禁用

    // 文章标签相关
    PostInsertSuccess = 2000, // 插入文章标签成功
    PostDeleteSuccess = 2001, // 插入文章标签成功
    PostUpdateSuccess = 2002, // 更新文章标签成功
    PostViewSuccess = 2003, // 查看文章标签成功
    PostCheckSlugNoExist = 2005, // 别名名称不存在
    PostCheckSlugNoExistExcludingID = 2007, // 别名名称不存在，排除指定ID
    PostViewByIDSuccess = 2008, // 根据ID查看文章成功
    PostViewByAdminSuccess = 2009, // 管理员查看文章成功
    PostViewByAdminIsNone = 2010, // 管理员查看文章无数据
    PostCountByMonthIsNone = 2011, // 无按照月份统计文章数量
    PostCountByMonthSuccess = 2012, // 按照月份统计文章数量成功
    PostCountByStatusIsNone = 2013, // 无按照文章状态统计文章数量
    PostCountByStatusSuccess = 2014, // 按照文章状态统计文章数量成功
    PostCountByAuthorIsNone = 2015, // 无按照作者统计文章数量
    PostCountByAuthorSuccess = 2016, // 按照作者统计文章数量成功
    PostStatusBatchOperationSuccess = 2017, // 批量操作文章状态成功
    PostViewHotSuccess = 2020, // 查看热门文章成功
    PostViewRecommendedSuccess = 2022, // 查看推荐文章成功
    PostCountByIsPinnedSuccess = 2024, // 按照是否置顶统计文章数量成功
    PostCountByIsRecommendedSuccess = 2026, // 按照是否推荐统计文章数量成功

    // 文章标签相关
    PostTagInsertSuccess = 2100, // 插入文章标签成功
    PostTagDeleteSuccess = 2101, // 删除文章标签成功
    PostTagUpdateSuccess = 2102, // 更新文章标签成功
    PostTagViewSuccess = 2103, // 查看文章标签成功
    PostTagCheckNameNoExist = 2105, // 标签名称不存在
    PostTagCheckSlugNoExist = 2107, // 别名名称不存在
    PostTagCheckNameNoExistExcludingID = 2109, // 标签名称不存在，排除指定ID
    PostTagCheckSlugNoExistExcludingID = 2111, // 别名名称不存在，排除指定ID
    PostTagViewTopNSuccess = 2112, // 查看文章标签TopN成功

    // 文章分类相关
    PostCategoryInsertSuccess = 2200, // 插入文章分类成功
    PostCategoryDeleteSuccess = 2201, // 删除文章分类成功
    PostCategoryUpdateSuccess = 2202, // 更新文章分类成功
    PostCategoryViewSuccess = 2203, // 查看文章分类成功
    PostCategoryCheckNameNoExist = 2205, // 分类名称不存在
    PostCategoryCheckSlugNoExist = 2207, // 别名名称不存在
    PostCategoryCheckNameNoExistExcludingID = 2209, // 分类名称不存在，排除指定ID
    PostCategoryCheckSlugNoExistExcludingID = 2211, // 别名名称不存在，排除指定ID
    PostCategoryViewListSuccess = 2212, // 查看文章分类列表成功

    // 验证码相关
    CaptchaSendSuccess = 8000, //验证码发送成功
    CaptchaCheckSuccess = 8002, //验证码发送成功

    // 上传相关
    UploadFileSuccess = 8100, // 上传文件成功
    UploadFileNotAllow = 8101, // 上传不被允许
    GetUploadFileRequirementsSuccess = 8102, // 获取允许上传的文件信息成功
    ConfirmBeforeUploadSuccess = 8104, // 确认上传前成功
    FileHashError = 8105, // 上传文件成功
    ConfirmAfterUploadBySignedUrlSuccess = 8107, // 使用签名URL上传文件后确认成功
    GetFileCountGroupByTypeSuccess = 8108, // 获取文件统计成功
    GetFilesSuccess = 8110, // 获取媒体信息成功
    FileDeleteSuccess = 8111, // 删除文件成功
    GetUploadFileUrlSuccess = 8113, // 获取上传文件URL成功
    SetAvatarSuccess = 8114, // 设置头像成功
    CheckSlugAvailable = 8115, // 检查别名是否可用
    UpdateFileSuccess = 8117, // 更新文件成功

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
    GetVideoKeySuccess = 8603, // 获取视频解密密钥成功
    GetVideoSubtitlesSuccess = 8605, // 获取视频字幕成功
    SubtitlesUpsertSuccess = 8607, // 更新字幕成功
    SubtitlesDeleteSuccess = 8608, // 删除字幕成功
    GetVideoSubtitlesLanguagesSuccess = 8609, // 获取视频字幕语言列表成功

    ClientIPTooManyRequests = 9006, //客户端IP请求次数过多
    ClientIDTooManyRequests = 9007, //客户端ID请求次数过多
}

// 验证码用途
export enum CaptchaPurpose {
    Register = "Register", // 验证码用途：注册
    ResetPassword = "ResetPassword", // 验证码用途：重置密码
    BindEmail = "BindEmail", // 验证码用途：绑定邮箱
}

// 本地存储键
export enum LocalStorageKey {
    AccessToken = "access_token", // token名称：访问令牌
    RolesList = "roles_list", // 角色列表
    PermissionList = "permission_list", // 权限列表
    IsCollapse = "is_collapse", // 侧边栏是否折叠
    IsShowListOrGridAtMedia = "is_show_list_or_grid_at_media", // 媒体列表是否显示为列表或网格
    IsShowSeoAtPostWrite = "is_show_seo_at_post_write", // 文章写作是否显示SEO
}

// 社交登录
export enum Social {
    QQ = "qq",
    QQDisplay = "QQ",
    WeChat = "wechat",
    WeChatDisplay = "微信",
}

/**
 * @description: 处理错误信息
 * @param res 返回结果
 * @param msgTitle 根据不同的接口传入不同的标题 默认为空
 * @return {string} 返回错误信息
 */
export const handleErrInfo = <T>(
    res: AxiosResponse<Res<T>, unknown> | Res<T>,
    msgTitle: string = "",
): string => {
    // 处理响应数据
    const resAc = "data" in res ? (res as AxiosResponse<Res<T>>).data : (res as Res<T>)

    // 错误信息
    let errMsg = resAc.msg || msgTitle

    const resData = resAc.data

    // 如果data不为空且不是对象
    if (resData !== null && typeof resData !== "object") {
        return (errMsg += "：" + resData)
    }

    // 如果data不为空且是对象
    if (resData !== null && typeof resData === "object") {
        // 历遍对象取出错误信息，不需要key
        const errData: string[] = []

        const data = resData as Record<string, string>
        for (const key in data) {
            errData.push(data[key])
        }

        // 拼接错误信息
        return (errMsg += "：" + errData.join(","))
    }

    return errMsg
}
