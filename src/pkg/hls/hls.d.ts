/**
 * @Author       : jiaopengzi
 * @Date         : 2024-09-10 15:14:31
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-09-22 11:13:44
 * @FilePath     : \blog-client\src\pkg\hls\hls.d.ts
 * @Description  : 将自定义的KeyLoaderContext接口导出
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */
declare module 'custom-hls' {
  import type {
    LoaderContext,
    Fragment,
    LevelKey,
    Loader,
    MediaKeySessionContext,
    KeyLoadedData
  } from 'hls.js'

  export interface KeyLoaderContext extends LoaderContext {
    keyInfo: KeyLoaderInfo
    frag: Fragment
  }

  export interface KeyLoaderInfo {
    decryptdata: LevelKey
    keyLoadPromise: Promise<KeyLoadedData> | null
    loader: Loader<KeyLoaderContext> | null
    mediaKeySessionContext: MediaKeySessionContext | null
  }
}
