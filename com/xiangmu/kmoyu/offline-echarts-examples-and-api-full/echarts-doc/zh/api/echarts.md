{{ target: echarts }}
# echarts(Object)

全局 echarts 对象，在 script 标签引入 `echarts.js` 文件后获得，或者在 AMD 环境中通过 `require('echarts')` 获得。

## init(Function)
```js
(dom: HTMLDivElement|HTMLCanvasElement, theme?: Object|string, opts?: {
    devicePixelRatio?: number,
    renderer?: string,
    useDirtyRect?: boolean, // 从 `v5.0.0` 开始支持
    width?: number|string,
    height?: number|string,
    locale?: string
}) => ECharts
```
创建一个 ECharts 实例，返回 [echartsInstance](~echartsInstance)，不能在单个容器上初始化多个 ECharts 实例。

**参数**
+ `dom`

    实例容器，一般是一个具有高宽的`div`元素。

    **注：**如果`div`是隐藏的，ECharts 可能会获取不到`div`的高宽导致初始化失败，这时候可以明确指定`div`的`style.width`和`style.height`，或者在`div`显示后手动调用 [echartsInstance.resize](~echartsInstance.resize) 调整尺寸。

    ECharts 3 中支持直接使用`canvas`元素作为容器，这样绘制完图表可以直接将 canvas 作为图片应用到其它地方，例如在 WebGL 中作为贴图，这跟使用 [echartsInstance.getDataURL](~echartsInstance.getDataURL) 生成图片链接相比可以支持图表的实时刷新。

+ `theme`

    应用的主题。可以是一个主题的配置对象，也可以是使用已经通过 [echarts.registerTheme](~echarts.registerTheme) 注册的主题名称。参见 [ECharts 中的样式简介](https://echarts.apache.org/zh/tutorial.html#ECharts%20%E4%B8%AD%E7%9A%84%E6%A0%B7%E5%BC%8F%E7%AE%80%E4%BB%8B)。

+ `opts`

    附加参数。有下面几个可选项：

    + `devicePixelRatio` 设备像素比，默认取浏览器的值`window.devicePixelRatio`。
    + `renderer` 渲染器，支持 `'canvas'` 或者 `'svg'`。参见 [使用 Canvas 或者 SVG 渲染](tutorial.html#%E4%BD%BF%E7%94%A8%20Canvas%20%E6%88%96%E8%80%85%20SVG%20%E6%B8%B2%E6%9F%93)。
    + `useDirtyRect` 是否开启脏矩形渲染，默认为`false`。参见 [ECharts 5 新特性](https://echarts.apache.org/zh/tutorial.html#ECharts%205%20%E6%96%B0%E7%89%B9%E6%80%A7)。
    + `width` 可显式指定实例宽度，单位为像素。如果传入值为 `null`/`undefined`/`'auto'`，则表示自动取 `dom`（实例容器）的宽度。
    + `height` 可显式指定实例高度，单位为像素。如果传入值为 `null`/`undefined`/`'auto'`，则表示自动取 `dom`（实例容器）的高度。
    + `locale` 使用的语言，内置 `'ZH'` 和 `'EN'` 两个语言，也可以使用 [echarts.registerLocale](~echarts.registerLocale) 方法注册新的语言包。目前支持的语言见 [src/i18n](https://github.com/apache/echarts/tree/release/src/i18n)。

    如果不指定主题，也需在传入`opts`前先传入`null`，如：
    ```js
    const chart = echarts.init(dom, null, {renderer: 'svg'});
    ```


## connect(Function)
```js
(group:string|Array)
```

多个图表实例实现联动。

**参数：**
+ `group`
    group 的 id，或者图表实例的数组。

**示例：**
```js
// 分别设置每个实例的 group id
chart1.group = 'group1';
chart2.group = 'group1';
echarts.connect('group1');
// 或者可以直接传入需要联动的实例数组
echarts.connect([chart1, chart2]);
```

## disconnect(Function)
```js
(group:string)
```
解除图表实例的联动，如果只需要移除单个实例，可以将通过将该图表实例 `group` 设为空。

**参数：**
+ `group`

    group 的 id。

## dispose(Function)
```js
(target: ECharts|HTMLDivElement|HTMLCanvasElement)
```
销毁实例，实例销毁后无法再被使用。

## getInstanceByDom(Function)
```js
(target: HTMLDivElement|HTMLCanvasElement) => ECharts
```
获取 dom 容器上的实例。

## use(Function)

> `5.0.1` 开始支持

使用组件，配合新的按需引入的接口使用。

注意：该方法必须在`echarts.init`之前使用。

```js
// 引入 echarts 核心模块，核心模块提供了 echarts 使用必须要的接口。
import * as echarts from 'echarts/core';
// 引入柱状图图表，图表后缀都为 Chart
import {
    BarChart
} from 'echarts/charts';
// 引入直角坐标系组件，组件后缀都为 Component
import {
    GridComponent
} from 'echarts/components';
// 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
import {
    CanvasRenderer
} from 'echarts/renderers';

// 注册必须的组件
echarts.use(
    [GridComponent, BarChart, CanvasRenderer]
);
```
更详细的使用方式见 [在打包环境中使用 ECharts](tutorial.html#在打包环境中使用%20ECharts) 一文

## registerMap(Function)
```js
(
    mapName: string,
    opt: {
        geoJSON: Object | string;
        specialAreas?: Object;
    }
)
| (
    mapName: string,
    opt: {
        svg: Object | string;
    }
)
| (
    mapName: string,
    geoJSON: Object | string,
    specialAreas?: Object
)
```
注册可用的地图，只在 [geo](option.html#geo) 组件或者 [map](option.html#series-map) 图表类型中使用。

使用方法见 [option.geo](option.html#geo.map)。

**参数：**
+ `mapName`

    地图名称，在 [geo](option.html#geo) 组件或者 [map](option.html#series-map) 图表类型中设置的 `map` 对应的就是该值。

+ `opt`

    + `geoJSON`

        可选。GeoJson 格式的数据，具体格式见 [https://geojson.org/](https://geojson.org/)。可以是 JSON 字符串，也可以是解析得到的对象。这个参数也可以写为 `geoJson`，效果相同。

    + `svg`

        > 从 `v5.1.0` 开始支持

        可选。SVG 格式的数据。可以是字符串，也可以是解析得到的 SVG DOM 对象。更多信息参见 [SVG 底图](tutorial.html#%E5%9C%B0%E7%90%86%E5%9D%90%E6%A0%87%E7%B3%BB%E5%92%8C%E5%9C%B0%E5%9B%BE%E7%B3%BB%E5%88%97%E7%9A%84%20SVG%20%E5%BA%95%E5%9B%BE)。

    + `specialAreas`

        可选。将地图中的部分区域缩放到合适的位置，可以使得整个地图的显示更加好看。

        只在 `geoJSON` 中生效，`svg` 中不生效。

        **示例 [USA Population Estimates](${galleryEditorPath}map-usa)：**
        ```js
        echarts.registerMap('USA', usaJson, {
            // 把阿拉斯加移到美国主大陆左下方
            Alaska: {
                // 左上角经度
                left: -131,
                // 左上角纬度
                top: 25,
                // 经度横跨的范围
                width: 15
            },
            // 夏威夷
            Hawaii: {
                left: -110,
                top: 28,
                width: 5
            },
            // 波多黎各
            'Puerto Rico': {
                left: -76,
                top: 26,
                width: 2
            }
        });
        ```


## getMap(Function)
```js
(mapName: string) => Object
```
获取已注册的地图，返回的对象类型如下

```js
{
    // 地图的 geoJSON 数据
    geoJSON: Object,
    // 地图的特殊区域，见 registerMap
    specialAreas: Object
}
```

注：
+ `geoJSON` 也可写为 `geoJson`，二者引用的是相同的内容。
+ 对于 `registerMap` 所注册的 SVG ，暂并不支持从此方法中返回。


## registerTheme(Function)
```js
(themeName: string, theme: Object)
```

注册主题，用于[初始化实例](~echarts.init)的时候指定。

## registerLocale(Function)

> 从 `5.0.0` 开始支持

```js
(locale: string, localeCfg: Object)
```

注册语言包，用于[初始化实例](~echarts.init)的时候指定。语言包格式见 [src/i18n/langEN.ts](https://github.com/apache/echarts/blob/release/src/i18n/langEN.ts)

{{ use: echarts-graphic }}



