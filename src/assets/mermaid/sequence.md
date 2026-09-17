# 时序图 (sequenceDiagram)

```mermaid
sequenceDiagram
    autonumber
    actor U as 用户
    participant B as 浏览器
    participant S as Nuxt 服务端
    participant A as 后端 API

    U->>B: 打开文章页 /p/:id
    B->>S: SSR 请求
    S->>A: 拉取文章详情
    A-->>S: 返回 JSON
    S-->>B: 直出 HTML (含 mermaid 源码占位)
    Note over B: 水合后惰性加载 mermaid chunk
    B->>B: 渲染图表为 SVG
    B-->>U: 展示完整图表

    loop 主题切换
        U->>B: 切换明暗主题
        B->>B: 重渲染全部图表
    end
```

激活与备用流:

```mermaid
sequenceDiagram
    participant C as 客户端
    participant R as 刷新管理器

    C->>+R: 401 触发刷新
    R->>R: 防抖合并并发刷新
    alt 刷新成功
        R-->>-C: 重放挂起请求
    else 刷新失败
        R-->>-C: 广播登出
    end
```
