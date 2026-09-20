/**
 * FilePath    : blog-client\server\drivers\swr-lru-cache.mjs
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : swr 页面缓存自定义 driver (bf-260919-02): 包装内置 lru-cache driver,
 *               携带空态标记头的缓存条目在写入时丢弃, 无效/无数据的 SSR 响应不进缓存.
 */

/**
 * 补充说明:
 * 本文件刻意用 .mjs 而非 .ts——nitro 构建期 createNitro/createStorage 会对 driver 路径
 * 做 node 原生 dynamic import (nitropack dist/core/index.mjs 的 createStorage), .ts 无法
 * 被 node 直接加载; .mjs 同时兼容运行时 bundle 的 rollup 静态 import, 三态(dev/build/生产)一致.
 * nitro cachedEventHandler 把页面 SSR 期间经 event.node.res.setHeader 设置的响应头
 * 原样捕获进缓存条目 (nitropack dist/runtime/internal/cache.mjs 的 resProxy 机制),
 * 页面据此埋标记头 x-swr-no-store 声明 "此响应不进 swr 缓存":
 * - src/pages/p/[id].vue: 空壳(私密文章匿名 2037/真不存在同码)埋点;
 * - src/components/layout/post-list-view/index.vue: 无数据列表(无效分类/标签/归档段,合法但暂无文章)埋点.
 * 本 driver 在 setItem 时识别该标记并丢弃条目——条目不落 lru, 下次请求 getItem 天然
 * miss, nitro 每次重新 SSR (缓存层 validate 只认 code >= 400, 自定义 validate/
 * shouldBypassCache 无法经 routeRules 注入函数, 故取 storage driver 层拦截.
 * 标记检查用序列化字符串的 includes 字面量匹配: 误判方向安全——即使页面正文意外含
 * 该字面量, 后果仅是那一条不缓存(每次重渲染), 无功能风险; 其余行为(max/ttl/键空间/
 * getKeys/removeItem 等)与内置 lru-cache driver 完全一致, 260916-02 的 OOM 治理参数与 cache-invalidate 失效接口的兼容性均不受影响.
 */

import { defineDriver } from "unstorage"
import lruCacheDriver from "unstorage/drivers/lru-cache"

// 标记头 JSON 序列化后的键形态: unstorage setItem 先 stringify 整个缓存条目
// {"value":{"code":200,"headers":{...},"body":"..."},"mtime":...,"expires":...},
// headers 键为小写原样保留, 故匹配带双引号的键名字面量即可; HTML 正文中出现该精确
// 字面量的概率可忽略, 且命中也只是多丢一条缓存(见文件头补充说明)
const NO_STORE_MARKER = '"x-swr-no-store"'

/**
 * 定义 swr 页面缓存 driver: 内部持有一个 lru-cache driver 实例, 全部方法透传,
 * 仅覆写 setItem 做空态标记拦截.
 * @param {object} opts - lru-cache driver 构造选项(nuxt.config.ts 传入 max/ttl, 语义不变).
 * @returns {object} unstorage driver 实例(getItem/hasItem/getKeys/removeItem/clear/dispose
 *                   等均由内部 lru driver 提供, setItem 为拦截版).
 */
export default defineDriver((opts = {}) => {
    const lru = lruCacheDriver(opts)

    return {
        ...lru,

        /**
         * 写入拦截: 携带空态标记头的条目直接丢弃(不落 lru), 其余原样透传.
         * @param {string} key - 缓存键(nitro 侧为 nitro/routes 分组前缀键, 无需区分).
         * @param {string} value - unstorage stringify 后的条目 JSON 字符串.
         * @param {object} [setOpts] - unstorage 事务选项(swr 条目写入不带 ttl, 原样透传;
         *                             Driver 接口的 setItem 为可选方法, 可选链调用保持
         *                             类型与运行时双安全).
         */
        setItem(key, value, setOpts) {
            if (typeof value === "string" && value.includes(NO_STORE_MARKER)) {
                return
            }
            return lru.setItem?.(key, value, setOpts ?? {})
        },
    }
})
