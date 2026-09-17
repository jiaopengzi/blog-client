# 甘特图 (gantt)

```mermaid
gantt
    title mermaid 支持开发计划 (260917)
    dateFormat YYYY-MM-DD
    axisFormat %m-%d
    excludes weekends

    section 渲染管线
    renderer 占位容器     :done, r1, 2026-09-17, 1d
    pkg 装配层            :done, r2, after r1, 1d
    预览集成              :active, r3, after r2, 2d

    section 复制与验收
    微信复制转图片        :r4, after r3, 1d
    单元测试              :r5, after r3, 1d
    浏览器验收            :milestone, r6, after r5, 0d
```
