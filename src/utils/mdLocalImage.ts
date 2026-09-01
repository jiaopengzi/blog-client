/*
 * FilePath    : blog-client-nuxt\src\utils\mdLocalImage.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : /md 页本地图片存储与渲染引用工具 (IndexedDB + blob URL + 存储配额策略)
 */

/*
 * 补充说明:
 * 方案选型: 用户截图粘贴的图片不走服务器, 存储选用 IndexedDB 而非 LocalStorage ——
 * LocalStorage 配额约 5MB 且 base64 膨胀 33% 同步 IO 阻塞主线程, 几张截图即触顶并挤占草稿空间;
 * IndexedDB 可直存 Blob(无膨胀), 配额通常数百 MB 且异步写入.
 * markdown 中以 ![](md-img:<uuid>) 稳定引用, 避免直接存 blob: URL(刷新即失效);
 * 渲染管线(utils/markdownRenderer) sanitize 后经 applyLocalImageRefs 同步替换为内存注册表中的
 * blob URL, 页面加载时 hydrateLocalImagesForMarkdown 重建注册表并按当前草稿做未引用垃圾回收.
 * 存储边界策略(防无限膨胀): 单图 / 数量 / 总量三重上限, 粘贴超限时先按当前内容强制回收
 * 未引用图片再复查, 仍超限则拒绝并提示; 清理入口在 /md 自定义面板的图片配置区.
 * 本模块被 markdownRenderer 引用参与 SSR 共用渲染管线, 顶层不得出现浏览器 API 调用.
 */

import type { ImageUploadHandler } from "@/pkg/codemirror/options"

import { MessageUtil } from "./message"

/** 本地图片引用协议前缀, markdown 中以 ![](md-img:<uuid>) 形式引用 */
export const LOCAL_IMAGE_URL_PREFIX = "md-img:"

/** uuid 形态的图片 id (8-4-4-4-12 小写十六进制) */
const LOCAL_IMAGE_ID_REGEX = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/g

/** 从渲染后 html 中匹配本地图片 src 的正则 (捕获 id) */
const LOCAL_IMAGE_SRC_REGEX = /src="md-img:([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})"/g

/** markdown 中本地图片引用整体 (含可选 alt 文本) */
const LOCAL_IMAGE_MARKDOWN_REGEX = /!\[[^\]]*\]\(md-img:[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\)/g

/** 独占一行的本地图片引用 (整行删除用) */
const LOCAL_IMAGE_WHOLE_LINE_REGEX = /^[ \t]*!\[[^\]]*\]\(md-img:[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\)[ \t]*$/gm

// 存储配额: 单图 5MB (截图通常远小于此), 数量 200 张, 总量 100MB (低于浏览器 IDB 配额, 防滥用)
export const MAX_LOCAL_IMAGE_SINGLE_BYTES = 5 * 1024 * 1024
export const MAX_LOCAL_IMAGE_COUNT = 200
export const MAX_LOCAL_IMAGE_TOTAL_BYTES = 100 * 1024 * 1024

/** 1x1 透明 gif 占位: 注册表未就绪(如刷新首帧)时避免显示破图图标, hydrate 后重渲染替换 */
const TRANSPARENT_PIXEL_DATA_URL = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"

const DB_NAME = "jpz-md-local-images"
const DB_VERSION = 1
const STORE_NAME = "images"

/** IndexedDB 记录结构: id 为主键, blob 为图片二进制 */
interface LocalImageRecord {
    id: string
    blob: Blob
    type: string
    createdAt: number
}

/** 本地图片库用量统计 */
export interface LocalImageUsage {
    count: number
    totalBytes: number
}

/** 清理动作结果统计 */
export interface LocalImageCleanupResult {
    removedCount: number
    removedBytes: number
}

// 内存注册表: 图片 id → blob URL; 渲染时同步查询, 页面加载后由 hydrate 重建
const localImageUrlMap = new Map<string, string>()

/**
 * formatLocalImageBytes 把字节数格式化为人类可读的 KB / MB 文本.
 * @param bytes - 字节数.
 * @returns 形如 "512.0 KB" / "5.0 MB" 的文本.
 */
export function formatLocalImageBytes(bytes: number): string {
    if (bytes >= 1024 * 1024) {
        return `${(bytes / 1024 / 1024).toFixed(1)} MB`
    }
    return `${(bytes / 1024).toFixed(1)} KB`
}

/**
 * createLocalImageId 生成图片 id.
 * 优先 crypto.randomUUID (secure context), 降级 getRandomValues 手拼 uuid v4 形态.
 * @returns 36 位 uuid 字符串.
 */
function createLocalImageId(): string {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
        return crypto.randomUUID()
    }

    const bytes = new Uint8Array(16)
    crypto.getRandomValues(bytes)
    bytes[6] = (bytes[6] & 0x0f) | 0x40
    bytes[8] = (bytes[8] & 0x3f) | 0x80
    const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0"))
    return `${hex.slice(0, 4).join("")}-${hex.slice(4, 6).join("")}-${hex.slice(6, 8).join("")}-${hex.slice(8, 10).join("")}-${hex.slice(10, 16).join("")}`
}

// IndexedDB 连接缓存; 打开失败时清空缓存, 允许下次重试
let dbPromise: Promise<IDBDatabase> | null = null

/**
 * openDatabase 懒打开本地图片库.
 * @returns IndexedDB 连接 Promise.
 */
function openDatabase(): Promise<IDBDatabase> {
    if (dbPromise) {
        return dbPromise
    }

    dbPromise = new Promise<IDBDatabase>((resolve, reject) => {
        if (typeof indexedDB === "undefined") {
            reject(new Error("当前环境不支持 IndexedDB"))
            return
        }

        const request = indexedDB.open(DB_NAME, DB_VERSION)

        request.addEventListener("upgradeneeded", () => {
            const db = request.result
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: "id" })
            }
        })
        request.addEventListener("success", () => {
            resolve(request.result)
        })
        request.addEventListener("error", () => {
            reject(request.error ?? new Error("IndexedDB 打开失败"))
        })
    })

    // 失败不缓存 rejected promise, 后续调用可重试
    dbPromise.catch(() => {
        dbPromise = null
    })

    return dbPromise
}

/**
 * withStore 在单个事务中执行存储操作, 统一包装成 Promise.
 * @param mode - 事务模式 (readonly / readwrite).
 * @param action - 接收 IDBObjectStore 并返回 IDBRequest 的操作.
 * @returns 操作结果 Promise.
 */
function withStore<T>(mode: IDBTransactionMode, action: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
    return openDatabase().then(
        (db) =>
            new Promise<T>((resolve, reject) => {
                const transaction = db.transaction(STORE_NAME, mode)
                const request = action(transaction.objectStore(STORE_NAME))
                request.addEventListener("success", () => {
                    resolve(request.result)
                })
                request.addEventListener("error", () => {
                    reject(request.error ?? new Error("IndexedDB 操作失败"))
                })
            }),
    )
}

/**
 * putLocalImage 将图片写入本地图片库.
 * @param file - 用户粘贴/拖拽的图片文件.
 * @returns 图片 id.
 */
export async function putLocalImage(file: File): Promise<string> {
    const record: LocalImageRecord = {
        id: createLocalImageId(),
        blob: file,
        type: file.type,
        createdAt: Date.now(),
    }
    await withStore("readwrite", (store) => store.put(record))
    return record.id
}

/**
 * getAllLocalImages 读取本地图片库全部记录.
 * @returns 记录数组, 读取失败时抛出异常.
 */
export function getAllLocalImages(): Promise<LocalImageRecord[]> {
    return withStore("readonly", (store) => store.getAll() as IDBRequest<LocalImageRecord[]>)
}

/**
 * deleteLocalImage 删除单条本地图片记录.
 * @param id - 图片 id.
 * @returns 无返回值 Promise.
 */
export function deleteLocalImage(id: string): Promise<undefined> {
    return withStore("readwrite", (store) => store.delete(id))
}

/**
 * getLocalImageUsage 统计本地图片库当前用量.
 * @returns 数量与总字节数, 读取失败时返回零值 (存储不可用时按空库处理, 不阻塞粘贴路径).
 */
export async function getLocalImageUsage(): Promise<LocalImageUsage> {
    try {
        const records = await getAllLocalImages()
        return {
            count: records.length,
            totalBytes: records.reduce((sum, record) => sum + (record.blob.size || 0), 0),
        }
    } catch (error) {
        console.warn("统计本地图片用量失败", error)
        return { count: 0, totalBytes: 0 }
    }
}

/**
 * checkLocalImagePolicy 校验待存图片是否满足存储配额策略 (纯函数, 便于单测).
 * @param fileSize - 待存图片字节数.
 * @param usage - 当前库用量.
 * @returns 拒绝原因文案, 满足策略时返回 null.
 */
export function checkLocalImagePolicy(fileSize: number, usage: LocalImageUsage): string | null {
    if (fileSize > MAX_LOCAL_IMAGE_SINGLE_BYTES) {
        return `单张图片不能超过 ${formatLocalImageBytes(MAX_LOCAL_IMAGE_SINGLE_BYTES)}, 请压缩后再粘贴`
    }
    if (usage.count + 1 > MAX_LOCAL_IMAGE_COUNT) {
        return `本地图片数量已达上限 (${MAX_LOCAL_IMAGE_COUNT} 张), 请先清理不再使用的图片`
    }
    if (usage.totalBytes + fileSize > MAX_LOCAL_IMAGE_TOTAL_BYTES) {
        return `本地图片总大小已达上限 (${formatLocalImageBytes(MAX_LOCAL_IMAGE_TOTAL_BYTES)}), 请先清理不再使用的图片`
    }
    return null
}

/**
 * registerLocalImageUrl 注册图片 id 对应的 blob URL 供渲染替换.
 * @param id - 图片 id.
 * @param url - blob URL.
 * @returns 无返回值.
 */
export function registerLocalImageUrl(id: string, url: string): void {
    localImageUrlMap.set(id, url)
}

/**
 * resolveLocalImageUrl 查询图片 id 对应的 blob URL.
 * @param id - 图片 id.
 * @returns blob URL, 未注册时返回 undefined.
 */
export function resolveLocalImageUrl(id: string): string | undefined {
    return localImageUrlMap.get(id)
}

/**
 * clearLocalImageUrls 清空内存注册表并释放全部 blob URL.
 * @returns 无返回值.
 */
export function clearLocalImageUrls(): void {
    for (const url of localImageUrlMap.values()) {
        URL.revokeObjectURL(url)
    }
    localImageUrlMap.clear()
}

/**
 * extractLocalImageIds 提取 markdown 源中引用的全部本地图片 id.
 * @param markdownSrc - markdown 源文本.
 * @returns id 数组 (可能含重复, 由调用方按需去重).
 */
export function extractLocalImageIds(markdownSrc: string): string[] {
    if (!markdownSrc.includes(LOCAL_IMAGE_URL_PREFIX)) {
        return []
    }

    return Array.from(markdownSrc.matchAll(LOCAL_IMAGE_ID_REGEX), (matched) => matched[0])
}

/**
 * applyLocalImageRefs 将渲染后 html 中的本地图片引用替换为 blob URL.
 * 未注册的引用 (如刷新首帧注册表未就绪) 替换为透明占位, 避免破图图标; hydrate 完成后重渲染即可见.
 * @param html - sanitize 后的 html 字符串.
 * @returns 替换后的 html 字符串.
 */
export function applyLocalImageRefs(html: string): string {
    if (!html.includes(LOCAL_IMAGE_URL_PREFIX)) {
        return html
    }

    return html.replace(LOCAL_IMAGE_SRC_REGEX, (match, id: string) => {
        const url = localImageUrlMap.get(id)
        return url ? `src="${url}"` : `src="${TRANSPARENT_PIXEL_DATA_URL}" data-jpz-local-image="${id}"`
    })
}

/**
 * stripLocalImageRefs 从 markdown 源中移除全部本地图片引用 (纯函数).
 * 独占一行的引用连同整行移除, 行内引用仅移除图片标记, 并收敛因此产生的连续空行.
 * @param markdownSrc - markdown 源文本.
 * @returns 移除引用后的 markdown 文本.
 */
export function stripLocalImageRefs(markdownSrc: string): string {
    if (!markdownSrc.includes(LOCAL_IMAGE_URL_PREFIX)) {
        return markdownSrc
    }

    return markdownSrc
        .replace(LOCAL_IMAGE_WHOLE_LINE_REGEX, "")
        .replace(LOCAL_IMAGE_MARKDOWN_REGEX, "")
        .replace(/\n{3,}/g, "\n\n")
}

/**
 * hydrateLocalImagesForMarkdown 依据当前 markdown 内容重建本地图片注册表.
 * 幂等: 先释放上一轮 blob URL; 库中未被当前内容引用的记录会被删除 (加载时垃圾回收,
 * 防止撤销/清空后的残留图片无限膨胀; 编辑会话内不做回收, 不影响撤销恢复).
 * @param markdownSrc - 当前 markdown 内容 (通常为本地草稿).
 * @returns 成功注册的图片数量, 0 表示无可渲染的本地图片.
 */
export async function hydrateLocalImagesForMarkdown(markdownSrc: string): Promise<number> {
    const referencedIds = new Set(extractLocalImageIds(markdownSrc))
    clearLocalImageUrls()

    let records: LocalImageRecord[]
    try {
        records = await getAllLocalImages()
    } catch (error) {
        console.warn("读取本地图片库失败", error)
        return 0
    }

    // 按当前内容分成保留与待回收两组, 回收并发执行且单条失败不中断 (allSettled 吸收 rejected)
    const keptRecords: LocalImageRecord[] = []
    const removalRecords: LocalImageRecord[] = []
    for (const record of records) {
        if (referencedIds.has(record.id)) {
            keptRecords.push(record)
        } else {
            removalRecords.push(record)
        }
    }
    await Promise.allSettled(removalRecords.map((record) => deleteLocalImage(record.id)))

    for (const record of keptRecords) {
        localImageUrlMap.set(record.id, URL.createObjectURL(record.blob))
    }
    return keptRecords.length
}

/**
 * gcUnreferencedLocalImages 按给定内容即时回收未引用的本地图片 (会话内强制清理).
 * 与 hydrate 不同: 不重建注册表, 只删除未被引用的记录并释放其 blob URL;
 * 被撤销恢复的引用所对应的记录一旦回收, 该图片将不可恢复 (仅在存储超限/用户主动清理时调用).
 * @param markdownSrc - 作为引用依据的当前 markdown 内容.
 * @returns 回收的数量与字节数, 库不可用时返回零值.
 */
export async function gcUnreferencedLocalImages(markdownSrc: string): Promise<LocalImageCleanupResult> {
    const referencedIds = new Set(extractLocalImageIds(markdownSrc))

    let records: LocalImageRecord[]
    try {
        records = await getAllLocalImages()
    } catch (error) {
        console.warn("读取本地图片库失败", error)
        return { removedCount: 0, removedBytes: 0 }
    }

    const removalRecords = records.filter((record) => !referencedIds.has(record.id))
    await Promise.allSettled(removalRecords.map((record) => deleteLocalImage(record.id)))

    for (const record of removalRecords) {
        const url = localImageUrlMap.get(record.id)
        if (url) {
            URL.revokeObjectURL(url)
            localImageUrlMap.delete(record.id)
        }
    }

    return {
        removedCount: removalRecords.length,
        removedBytes: removalRecords.reduce((sum, record) => sum + (record.blob.size || 0), 0),
    }
}

/**
 * purgeAllLocalImages 清空本地图片库 (库记录 + 内存注册表, 全部释放).
 * 用于"清空全部"入口, 调用方需同步剥离文档中的本地图片引用, 否则预览将显示透明占位.
 * @returns 清空前的数量与字节数.
 */
export async function purgeAllLocalImages(): Promise<LocalImageCleanupResult> {
    let records: LocalImageRecord[] = []
    try {
        records = await getAllLocalImages()
    } catch (error) {
        console.warn("读取本地图片库失败", error)
    }

    try {
        await withStore("readwrite", (store) => store.clear())
    } catch (error) {
        console.warn("清空本地图片库失败", error)
    }

    clearLocalImageUrls()
    return {
        removedCount: records.length,
        removedBytes: records.reduce((sum, record) => sum + (record.blob.size || 0), 0),
    }
}

/**
 * createLocalImageUploadHandler 创建 /md 页的本地图片上传处理器.
 * 粘贴/拖拽图片 → 配额校验 (超限时先按当前内容强制回收未引用图片再复查) → 存 IndexedDB
 * + 注册 blob URL → 返回 md-img: 引用给编辑器插入.
 * @param getCurrentMarkdown - 可选的当前 markdown 内容 getter, 供超限时的会话内强制回收使用.
 * @returns ImageUploadHandler.
 */
export function createLocalImageUploadHandler(getCurrentMarkdown?: () => string): ImageUploadHandler {
    return async (file) => {
        try {
            let rejection = checkLocalImagePolicy(file.size, await getLocalImageUsage())

            // 超限时先按当前编辑内容做一次会话内强制回收 (撤销将无法恢复这些图片), 再复查配额
            if (rejection && getCurrentMarkdown) {
                await gcUnreferencedLocalImages(getCurrentMarkdown())
                rejection = checkLocalImagePolicy(file.size, await getLocalImageUsage())
            }

            if (rejection) {
                MessageUtil.warning(rejection, 6000)
                return { cancelled: true }
            }

            const id = await putLocalImage(file)
            registerLocalImageUrl(id, URL.createObjectURL(file))
            return { imageUrl: LOCAL_IMAGE_URL_PREFIX + id }
        } catch (error) {
            console.error("本地图片保存失败", error)
            const isQuotaError = (error as { name?: string } | null)?.name === "QuotaExceededError"
            MessageUtil.error(isQuotaError ? "浏览器存储空间不足, 请清理不再使用的图片后再粘贴" : "图片保存到本地失败, 请检查浏览器存储空间", 6000)
            return { cancelled: true }
        }
    }
}
