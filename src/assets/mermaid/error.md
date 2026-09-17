# 错误语法降级验收 (error)

以下代码块包含非法 mermaid 语法, 预期不抛异常, 容器进入 error 状态:
展示错误信息与源码降级, 其余图表不受影响。

```mermaid
flowchart LR
    A[节点 --> 缺少目标
    B{未闭合的判断
```

正确图表应正常渲染 (验证单图失败不影响后续渲染):

```mermaid
flowchart LR
    X[正常节点] --> Y[正常目标]
```
