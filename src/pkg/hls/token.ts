/**
 * @Author       : jiaopengzi
 * @Date         : 2024-09-21 20:08:35
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-09-21 20:08:35
 * @FilePath     : \blog-client\src\pkg\hls\token.ts
 * @Description  : 
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
 */
// @FilePath     : \blog-client\src\pkg\hls\TokenLoader.ts
import Hls from 'hls.js';
import type {
  Loader,
  LoaderConfiguration,
  LoaderCallbacks,
  LoaderContext,
  LoaderStats,
  LoaderResponse
} from 'hls.js';

export class TokenLoader implements Loader<LoaderContext> {
  private loader: Loader<LoaderContext>;

  constructor(config: LoaderConfiguration) {
    this.loader = new Hls.DefaultConfig.loader(config);
  }

  load(context: LoaderContext, config: LoaderConfiguration, callbacks: LoaderCallbacks<LoaderContext>): void {
    const token = localStorage.getItem('token'); // 获取存储在 localStorage 中的 token

    const modifiedContext = {
      ...context,
      headers: {
        ...context.headers,
        'Authorization': `Bearer ${token}`
      }
    };

    this.loader.load(modifiedContext, config, callbacks);
  }

  abort(): void {
    this.loader.abort();
  }

  destroy(): void {
    this.loader.destroy();
  }

  getStats(): LoaderStats {
    return this.loader.getStats();
  }

  getResponseHeader(name: string): string | null {
    return this.loader.getResponseHeader(name);
  }
}
