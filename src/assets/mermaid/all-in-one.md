# 全图型汇总 (all-in-one)

> 长文档验收: 多图表批量渲染性能、滚动、目录、复制链路。

## 流程图

```mermaid
flowchart LR
    A[Hard] -->|Text| B(Round)
    B --> C{Decision}
    C -->|One| D[Result 1]
    C -->|Two| E[Result 2]
```

## 时序图

```mermaid
sequenceDiagram
    participant U as 用户
    participant B as 浏览器
    U->>B: 打开文章
    B-->>U: 直出源码占位
    Note over B: 水合后渲染 SVG
    B-->>U: 展示图表
```

## 类图

```mermaid
classDiagram
    class A {
        +String name
    }
    class B {
        +run() void
    }
    A <|-- B
```

## 状态图

```mermaid
stateDiagram-v2
    [*] --> Active
    Active --> Inactive: pause
    Inactive --> Active: resume
    Active --> [*]
```

## ER 图

```mermaid
erDiagram
    USER ||--o{ POST : writes
```

## 甘特图

```mermaid
gantt
    title 计划
    dateFormat YYYY-MM-DD
    section 阶段一
    任务甲 :a1, 2026-09-17, 3d
    section 阶段二
    任务乙 :a2, after a1, 2d
```

## 饼图

```mermaid
pie showData
    title 内容构成
    "文字" : 60
    "图表" : 40
```

## 用户旅程

```mermaid
journey
    title 旅程
    section 开始
      第一步: 5: 用户
      第二步: 4: 用户
```

## 思维导图

```mermaid
mindmap
  root((根))
    分支一
      叶子甲
      叶子乙
    分支二
      叶子丙
```

## 时间线

```mermaid
timeline
    title 时间线
    2026 : 事件甲
    2026 : 事件乙
```

## Git 图

```mermaid
gitGraph
    commit id: "init"
    branch dev
    commit
    checkout main
    merge dev
```

## 桑基图

```mermaid
sankey-beta
    a,b,5
    a,c,3
    b,d,4
    c,d,2
```

## 象限图

```mermaid
quadrantChart
    title 象限
    x-axis 低 --> 高
    y-axis 低 --> 高
    方案一: [0.3, 0.7]
    方案二: [0.7, 0.3]
```

## XY 图表

```mermaid
xychart-beta
    title "trend"
    x-axis [jan, feb, mar]
    y-axis "count" 0 --> 100
    bar [30, 60, 90]
```

## 错误降级 (应显示源码与错误信息)

```mermaid
flowchart LR
    A[未闭合 -->
```
