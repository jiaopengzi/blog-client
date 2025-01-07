/**
 * @Author       : jiaopengzi
 * @Date         : 2024-09-10 15:14:31
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-10-15 14:17:29
 * @FilePath     : \blog-client\src\pkg\hls\hls.d.ts
 * @Description  : 将自定义的KeyLoaderContext接口导出
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */
declare module "custom-hls" {
    import type {
        Fragment,
        KeyLoadedData,
        LevelKey,
        Loader,
        LoaderContext,
        MediaKeySessionContext,
    } from "hls.js"

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
