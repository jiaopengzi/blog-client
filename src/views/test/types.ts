// 自定义字段
export enum CustomFields {
    Price = "price", // 价格
    ViewCount = "view_count", // 浏览次数
    CommentCount = "comment_count", // 评论次数
    LikeCount = "like_count", // 点赞次数
    CollectCount = "collect_count", // 收藏次数
    WordsCount = "words_count", // 字数
}

export interface Request1 {
    post_author?: string // 文章作者
    post_status?: number // 文章状态
    year?: number // 文章年份
    month?: number // 文章月份
}

export interface Request2 {
    post_author?: string // 文章作者
    post_status?: number // 文章状态
    year?: number // 文章年份
    month?: number // 文章月份
    post_category_id?: string // 文章分类ID
    post_tag_id?: string // 文章标签ID
    custom_filed?: CustomFields // 自定义字段
    custom_filed_min?: string // 自定义字段最小值
    custom_filed_max?: string // 自定义字段最大值
    is_pinned?: boolean // 是否置顶
    is_recommended?: boolean // 是否推荐
}
