/**
 * @FilePath     : \blog-client\src\pkg\hls\hls.d.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 将自定义的KeyLoaderContext接口导出
 */

declare module "custom-hls" {
    import type { Fragment, KeyLoadedData, LevelKey, Loader, LoaderContext, MediaKeySessionContext } from "hls.js"

    export interface KeyLoaderContext extends LoaderContext {
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
