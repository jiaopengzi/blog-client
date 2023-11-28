/**
 * @Author       : jiaopengzi
 * @Date         : 2023-11-26 14:14:49
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-11-26 14:14:53
 * @FilePath     : \blog-client\src\pkg\highlight.js\language\dax copy.ts
 * @Description  :
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved.
 */
/**
 * @Author       : jiaopengzi
 * @Date         : 2023-11-26 13:27:10
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-11-26 14:06:43
 * @FilePath     : \blog-client\src\pkg\highlight.js\language\dax.ts
 * @Description  : DAX 语法高亮
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved.
 */

const DAX = {
  name: 'DAX',
  contains: [
    {
      className: 'keyword',
      beginKeywords: 'VAR RETURN',
    },
    {
      className: 'function',
      begin: '\\b(?:CALCULATE|SUM|USERELATIONSHIP|SUMX|RELATED)\\b',
    },
    // 添加其他规则，例如字符串、数字等
    {
      className: 'string',
      begin: '"',
      end: '"',
    },
    {
      className: 'number',
      begin: '\\b\\d+',
      relevance: 0,
    },
  ],
  keywords: {
    keyword: 'VAR RETURN',
    built_in: 'CALCULATE SUM USERELATIONSHIP SUMX RELATED',
  },
}

export default DAX
