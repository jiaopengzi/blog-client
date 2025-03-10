/**
 * @FilePath     : \blog-client\src\utils\img.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 图片工具类
 */

/**
 * @description: 从 html 中提取图片链接
 * @param input  html 字符串
 * @return       图片链接数组
 */
export function extractImageUrlsFromHtml(input: string): string[] {
    const regex = /<img[^>]*src="([^"]*)"[^>]*>/g
    const matches = input.match(regex) || []
    return matches.map((match) => {
        const urlMatch = /<img[^>]*src="([^"]*)"[^>]*>/.exec(match)
        return urlMatch ? urlMatch[1] : ""
    })
}

/** 
 * @description:    循环移动数组元素，将item移动到数组头部 为了实现图片预览功能保证当前图片在第一位
 * @param srcList   原始数组
 * @param item      要移动的元素
 * @return          移动完成后的数组 
 *
例子：
const srcList=["A","B","C","D"]
function(srcList,item)
当 x=A 返回 ["A","B","C","D"]
当 x=B 返回 ["B","C","D","A"]
当 x=C 返回 ["C","D","A","B"]
当 x=D 返回 ["D","A","B","C"]     
 */
export function shiftArray(srcList: string[] | undefined, item: string): string[] {
    if (!srcList) {
        return []
    }
    const index = srcList.indexOf(item)

    if (index === -1) {
        // 如果item不在数组中，返回原数组
        return srcList
    }

    return [...srcList.slice(index), ...srcList.slice(0, index)]
}
