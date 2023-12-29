# 159\_模型\_Power BI 地理分析之形状地图


> [!NOTE]
> Highlights information that users should take into account, even when skimming.


我是行内代码`code` `caculate` `sum` `sumx` 


Ⅱ、市场占有结论语句度量值：Map_Area_Count ；L1-L3分别代表省份、地市、区县。

```dax
Map_Area_Count_L1 =
VAR Table_ID =
    VALUES ( 'D01_省份表'[F_02_省ID] )
VAR Table_All =
    ADDCOLUMNS ( Table_ID, "@value", [0001_销售金额] )
VAR Table_Sale = FILTER( Table_All ,[@value] <> BLANK())
VAR FZ =
    COUNTROWS ( Table_Sale )
VAR FM =
    COUNTROWS ( 'D01_省份表' )
VAR Format_1 =
    FORMAT ( DIVIDE ( FZ, FM, BLANK () ), "#0,0.0%" )
RETURN
    "省级市场共计：" & FM & "个，已开拓：" & FZ & "个；占比：" & Format_1
```

## tasklist
- [x] Write the press release
- [x] Update the website
- [ ] Contact the media

**声明以下地图元==素仅供==学习交流所用，如需地图公开使用请提前做好报审工作。**

## 一、背景 {#custom-id}

## 下标
H~2~O
## 上标
X^2^
## 行内公式
katex: $c = \sqrt{a^2 + b^2}$
## 块级公式
$$c = \sqrt{a^2 + b^2}$$

## 引用
> blockquote1
> blockquote2
> blockquote3
He said, -- "A 'simple' sentence. . ." --- unknown

jiaopengzi@outlook.com

当企业的体量达到一定体量的时候，保持稳定的增长是非常重要的事情。本案例展示如何用 Power BI 的形状地图来寻求业务的增长。

我们先来看结论：

- 省级市场共计：34 个，已开拓：34 个；占比：100.0%。

- 地市级市场共计：370 个，已开拓：214 个；占比：57.8%。

- 区县级市场共计：2875 个，已开拓：356 个；占比：12.4%。

其实从这个三条结论来看，市场层级越下沉，其实我们的空白市场越多；当然要业务能支撑这样的规模才行。

通过三张图，就让各大区领着各自团队回去开会，制定一个空白市场开发的计划及相应的配套预算。

Power BI 公共 web 效果：https://demo.jiaopengzi.com/pbi/159-full.html

![159-1](https://image.jiaopengzi.com/wp-content/uploads/2022/07/159-1.png)

![159-2](https://image.jiaopengzi.com/wp-content/uploads/2022/07/159-2.png)

![159-3](https://image.jiaopengzi.com/wp-content/uploads/2022/07/159-3.png)

## 二、模型设计

### 1、地图数据

要分析从 省份>地市>区县 三个层级的地理业务数据，首先要准备的是 省份、地市、区县 三个层级的地理数据。

数据获取可以从阿里云的 DataV.GeoAtlas（https://datav.aliyun.com/portal/school/atlas/area_selector） 获取。

![159-4](https://image.jiaopengzi.com/wp-content/uploads/2022/07/159-4.png)

简单的数据获取直接从这里获取即可，但是我们需要的 省份、地市、区县 三级的数据，那么我们就是用 Python 获取这部分数据。

数据拿到以后还要做相应的清洗，清洗不必要的字段信息；这里获取的数据是 GeoJSON 格式；但是 Power BI 的形状地图（https://docs.microsoft.com/zh-cn/power-bi/visuals/desktop-shape-map）需要使用的是 TopoJSON 格式数据。

GeoJSON 转换为 TopoJSON 我们使用开源的工具 mapshaper (https://github.com/mbloch/mapshaper) 转换即可。数量不是特别多的话可以使用可视化的方式转换将 GeoJson 格式数据导入到 https://mapshaper.org/ 导出即可。


这样可满足合并和拆分的地图数据的需求。

| #   | L0-全国 | L1-省份 | L2-地市 | L3-区县 | 文件夹   | 文件命名规则          |
| --- | ------- | ------- | ------- | ------- | -------- | --------------------- |
| 1   | √       | √       |         |         | country  | L0_L1_country         |
| 2   | √       | √       | √       |         | country  | L0_L2_country         |
| 3   | √       | √       | √       | √       | country  | L0_L3_country         |
| 4   |         | √       | √       |         | province | L1_L2_province_adcode |
| 5   |         | √       | √       | √       | province | L1_L3_province_adcode |
| 6   |         |         | √       | √       | city     | L2_L3_city_adcode     |
