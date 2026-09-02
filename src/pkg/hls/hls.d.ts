/**
 * @FilePath     : \blog-client\src\pkg\hls\hls.d.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 导出兼容 hls.js 上下文判别字段的 KeyLoaderContext 接口
 */

declare module "custom-hls" {
    import type { Fragment, KeyLoadedData, LevelKey, Loader, LoaderContext, LoaderContextType, MediaKeySessionContext } from "hls.js"

    export interface KeyLoaderContext extends LoaderContext {
        type: LoaderContextType.KEY
        keyInfo: KeyLoaderInfo
        frag: Fragment
    }

    export interface KeyLoaderInfo {
        decryptdata: LevelKey // 保持 decryptdata 的写法，不能写为 decryptData
        keyLoadPromise: Promise<KeyLoadedData> | null
        loader: Loader<KeyLoaderContext> | null
        mediaKeySessionContext: MediaKeySessionContext | null
    }
}
