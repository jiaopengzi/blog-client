export interface ViewPostByAdminRequest {
    post_author?: string // 文章作者
    post_status?: number // 文章状态
    year?: number // 文章年份
    month?: number // 文章月份
}

// 获取对象中的值为 number 或 number | undefined 类型的键名
export type NumberKeys<T> = {
    [K in keyof T]: K extends string
        ? undefined extends T[K]
            ? Exclude<T[K], undefined> extends number
                ? K
                : never
            : T[K] extends number
              ? K
              : never
        : never
}[keyof T]

const queryNumberParams: NumberKeys<ViewPostByAdminRequest>[] = ["post_status", "year", "month"]
