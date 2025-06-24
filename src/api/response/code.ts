/**
 * @FilePath     : \blog-client\src\api\response\code.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 响应状态码
 */

export enum ResponseCode {
    // 常规响应码
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
    UserNotForbidden = 1042, // 用户正常
    UserUnSubscribeSuccess = 1043, // 用户取消订阅成功
    UserUnSubscribeInvalid = 1044, // 用户取消订阅失败，token 无效
    UserUnSubscribeTypeWrong = 1045, // 用户取消订阅失败，token 类型错误

    // 文章相关
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
    PostLikeSuccess = 2027, // 文章点赞成功
    PostLikeCancelSuccess = 2028, // 文章取消点赞成功
    PostLikeRepeat = 2029, // 文章点赞或者取消点赞重复操作
    PostStarSuccess = 2030, // 文章收藏成功
    PostStarRepeat = 2031, // 文章收藏或者取消收藏重复操作
    PostStarCancelSuccess = 2032, // 文章取消收藏成功
    PostInteractionStatusSuccess = 2033, // 获取文章交互状态成功
    PostPrevNextSuccess = 2034, // 获取文章上一篇下一篇成功

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

    // 设置相关
    GetDBsSuccess = 2300, // 获取数据库信息成功
    DBsNoUpdated = 2301, // 数据库信息未更新
    DBsUpdateOnlyPassword = 2302, // 数据库信息只允许更新密码
    DBsUpdateSuccess = 2303, // 数据库信息更新成功
    GetEmailSuccess = 2304, // 获取邮箱信息成功
    EmailNoUpdate = 2305, // 邮箱信息未更新
    EmailUpdateSuccess = 2306, // 邮箱信息更新成功
    EmailTestSendSuccess = 2307, // 测试邮件发送成功，请查阅接收邮箱
    EmailTestSendError = 2308, // 测试邮件发送失败，请检查邮箱配置
    GetSocialLoginSuccess = 2309, // 获取社交登录信息成功
    SocialLoginNoUpdate = 2310, // 社交登录信息未更新
    SocialLoginUpdateSuccess = 2311, // 社交登录信息更新成功
    GetSocialLoginStatusSuccess = 2312, // 获取社交登录状态成功
    GetUploadSuccess = 2313, // 获取上传配置成功
    UploadNoUpdate = 2314, // 上传配置未更新
    UploadUpdateSuccess = 2315, // 上传配置更新成功
    UploadConfigError = 2316, // 上传配置错误
    GetAPPOptionSuccess = 2317, // 获取网站配置成功
    UpdateAPPOptionSuccess = 2318, // 更新网站配置成功

    // 评论相关
    CommentStatusClose = 2400, // 评论关闭
    CommentInsertSuccess = 2401, // 插入评论成功
    CommentDeleteSuccess = 2402, // 删除评论成功
    CommentUpdateSuccess = 2403, // 更新评论成功
    CommentViewSuccess = 2404, // 查看评论成功
    CommentNotOwn = 2405, // 非本人评论
    CommentNotExist = 2406, // 评论不存在
    CommentStatusBatchOperationSuccess = 2407, // 批量操作评论状态成功
    CommentViewIsNone = 2408, // 查看评论无数据
    CommentCountByStatusIsNone = 2409, // 获取按照评论状态统计评论数量无数据
    CommentCountByStatusSuccess = 2410, // 获取按照评论状态统计评论数量成功

    // 链接相关
    LinkInsertSuccess = 2500, // 插入链接成功
    LinkDeleteSuccess = 2501, // 删除链接成功
    LinkUpdateSuccess = 2502, // 更新链接成功
    LinkViewSuccess = 2503, // 查看链接成功
    LinkCheckURLExist = 2504, // 链接已经存在
    LinkCheckURLNotExist = 2505, // 链接不存在
    LinkCheckURLTooLong = 2506, // 链接过长
    LinkCheckURLExistExcludingID = 2507, // 链接已经存在(排除ID)
    LinkCheckURLNotExistExcludingID = 2508, // 链接不存在(排除ID)
    LinkViewNoData = 2509, // 查看链接无数据

    // 通知相关
    NotificationInsertSuccess = 2600, // 插入通知成功
    NotificationDeleteSuccess = 2601, // 删除通知成功
    NotificationUpdateSuccess = 2602, // 更新通知成功
    NotificationViewSuccess = 2603, // 查看通知成功
    NotificationStatusBatchOperationSuccess = 2604, // 批量操作通知状态成功
    NotificationViewIsNone = 2605, // 查看通知无数据
    NotificationCountByStatusIsNone = 2606, // 获取按照通知状态统计通知数量无数据
    NotificationCountByStatusSuccess = 2607, // 获取按照通知状态统计通知数量成功
    NotificationSendTestFailed = 2608, // 发送测试通知失败
    NotificationSendTestSuccess = 2609, // 发送测试通知成功
    NotificationSendTestIsNone = 2610, // 发送测试通知无数据

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
    SocialLoginNoLoginType = 8200, // 未传递社交登录登录方式,请传递正确的登录方式
    SocialLoginLoginTypeError = 8201, // 社交登录登录方式错误,请传递正确的登录方式
    SocialLoginSuccess = 8202, // 重定向社交登录成功
    SocialLoginUnLogin = 8203, // 社交登录未登录
    SocialLoginCallbackSuccess = 8204, // 社交登录回调成功
    SocialBindCallbackSuccess = 8205, // 社交登录绑定回调成功
    SocialUnBindSuccess = 8206, // 社交登录解绑成功

    // 权限相关
    GetPermissionSuccess = 8300, //获取权限列表成功
    HasPermission = 8305, //判断是否有权限成功
    GetRoleSuccess = 8400, //获取角色列表成功
    UpdateRoleSuccess = 8403, //更新角色成功
    UpsertPermissionRoleSuccess = 8404, //更新角色权限成功
    DeletePermissionRoleSuccess = 8405, //删除角色权限成功
    GetPermissionRoleSuccess = 8407, //获取角色权限成功

    // 登录日志相关
    GetLoginLogsSuccess = 8500, //获取登录日志成功
    LoginLogDeleteByIDsSuccess = 8502, //通过ID删除登录日志成功
    LoginLogDeleteByDaySuccess = 8503, //通过天数删除登录日志成功

    // 视频相关
    VideoNotFound = 8600, // 视频不存在
    GetVideoMainM3u8Success = 8601, // 获取视频主M3u8成功
    GetVideoM3u8Success = 8602, // 获取视频M3u8成功
    GetVideoKeySuccess = 8603, // 获取视频解密密钥成功
    GetVideoSubtitlesSuccess = 8605, // 获取视频字幕成功
    SubtitlesUpsertSuccess = 8607, // 更新字幕成功
    SubtitlesDeleteSuccess = 8608, // 删除字幕成功
    GetVideoSubtitlesLanguagesSuccess = 8609, // 获取视频字幕语言列表成功

    // 系统相关
    ClientIPTooManyRequests = 9006, //客户端IP请求次数过多
    ClientIDTooManyRequests = 9007, //客户端ID请求次数过多
    SetupSuccess = 9011, // 项目初始化成功
    SetupError = 9012, // 项目初始化失败
    SetupAlready = 9013, // 项目已经初始化完毕
    SetupNotCompleted = 9014, // 项目未初始化
    ConnectionPgsqlError = 9015, // 连接 pgsql 数据库失败
    ConnectionRedisError = 9016, // 连接 redis 数据库失败
    RedisNodeCountError = 9017, // redis 节点数量错误
    ConnectionESError = 9018, // 连接 ES 失败
    HasAdmin = 9019, // 已经存在管理员
    NoAdmin = 9020, // 不存在管理员
    GetStreamIDStatusSuccess = 9021, // 获取streamID状态成功
}
