/**
 * @FilePath     : \blog-client\src\event\events.ts
 * @Description  : 事件类型(参考mitt：https://github.com/developit/mitt)
 */

// 事件名称枚举
export enum Events {
    SetupAlready = "setup-already", // 已经安装数据库
    SetupNotCompleted = "setup-not-completed", // 数据库未安装
}
