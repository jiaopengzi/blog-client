/**
 * @Author       : jiaopengzi
 * @Date         : 2023-11-28 11:19:47
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-11-28 11:35:01
 * @FilePath     : \blog-client\typings\marked-extended-tables.d.ts
 * @Description  : 手动编写的marked-extended-tables.d.ts文件
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved. 
 */

declare module 'marked-extended-tables' {
    import { MarkedExtension } from 'marked';
  
    /**
     * Configures a marked extension to apply extended table functionality.
     *
     * @return A MarkedExtension to be passed to `marked.use()`
     */
    export default function markedExtendedTables(): MarkedExtension;
  }
  