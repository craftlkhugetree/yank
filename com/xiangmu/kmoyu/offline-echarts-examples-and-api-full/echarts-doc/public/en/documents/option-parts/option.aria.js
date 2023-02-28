window.__EC_DOC_option_aria = {
  "enabled": {
    "desc": "<p>Whether or not aria is turned on. If not, the <code class=\"codespan\">label</code> or <code class=\"codespan\">decal</code> effect is not applied.</p>\n"
  },
  "label": {
    "desc": "<p>If <a href=\"#aria.enabled\">aria.enabled</a> is set to <code class=\"codespan\">true</code>, <code class=\"codespan\">label</code> is enabled by default. When enabled, the description of the chart will be automatically and intelligently generated based on the chart, data, title, etc. Users can also modify the description through the configuration item.</p>\n<p><strong>Example:</strong></p>\n<pre><code class=\"lang-js\">option = {\n    aria: {\n        // The following lines can be omitted because label.enabled defaults to true.\n        // label: {\n        // enabled: true\n        // },\n        enabled: true\n    },\n    title: {\n        text: &#39;User access sources for a site&#39;,\n        x: &#39;center&#39;\n    },\n    series: [\n        {\n            name: &#39;access source&#39;,\n            type: &#39;pie&#39;,\n            data: [\n                { value: 335, name: &#39;Direct Access&#39; },\n                { value: 310, name: &#39;Email Marketing&#39; },\n                { value: 234, name: &#39;Affiliate Ads&#39; },\n                { value: 135, name: &#39;Video Ads&#39; },\n                { value: 1548, name: &#39;Search Engine&#39; }\n            ]\n        }\n    ]\n};\n</code></pre>\n<iframe  data-src=\"http://localhost:8086/echarts-website/examples/en/view.html?c=doc-example/aria-pie&edit=1&reset=1\" width=\"700\" height=\"300\"></iframe>\n\n\n<p>On the generated chart DOM, there is an <code class=\"codespan\">aria-label</code> attribute that allows the blind to understand the chart with the help of a reading device. Its value is.</p>\n<blockquote>\n<p>This is a chart of &quot;Source of user access to a site.&quot; The chart type is a pie chart that indicates the source of the visit. The data is - direct access data is 335, mail marketing data is 310, union ad data is 234, video ad data is 135, search engine data is 1548.</p>\n</blockquote>\n<p>The basic process for generating the description is that if <a href=\"#aria.enabled\">aria.enabled</a> is set to <code class=\"codespan\">true</code> (not the default) and <a href=\"#aria.label.enabled\">aria.label.enabled</a> is set to <code class=\"codespan\">true</code> (the default), then the accessibility description is generated. Otherwise it is not generated. If <a href=\"#aria.label.description\">aria.label.description</a> is defined, it is used as the full description of the chart, otherwise the description is generated according to the template stitching. We provide a default algorithm for generating descriptions, and only if the generated descriptions are not quite right, you need to modify these templates, or even override them completely with <code class=\"codespan\">aria.label.description</code>.</p>\n<p>When using the template, whether <a href=\"#title.text\">title.text</a> is used along with <a href=\"option.html#aria.label.general.withTitle\" target=\"_blank\">aria.label.general.withTitle</a> while <a href=\"option.html#aria.label.general.withoutTitle\" target=\"_blank\">aria.label.general.withoutTitle</a> is used if there is no title text. <code class=\"codespan\">aria.general.withTitle</code> supports a template <code class=\"codespan\">&#39;{title}&#39;</code>, which will be replaced with chart title. This means, if <code class=\"codespan\">aria.general.withTitle</code> is set to be <code class=\"codespan\">&#39;The chart title is {title}.&#39;</code> and the chart title is <code class=\"codespan\">Price Distribution</code>, it will be interpreted into <code class=\"codespan\">&#39;The chart title is Price Distribution.&#39;</code></p>\n<p>After generating the title, the description of the series (<a href=\"option.html#aria.label.series\" target=\"_blank\">aria.label.series</a>) and the description of the data for each series (<a href=\"option.html#aria.label.data\" target=\"_blank\">aria.label.data</a>) are generated in turn. The following is an example of a template. Likewise, each template may include template variables to replace actual values.</p>\n<p>The complete description generation process is:</p>\n<p><img width=\"800\" height=\"auto\" src=\"documents/asset/img/echarts-aria.jpg\"></p>\n"
  },
  "label.enabled": {
    "desc": "<p>Whether or not to enable label generation for accessibility. When enabled, the attribute <code class=\"codespan\">aria-label</code> will be generated.</p>\n"
  },
  "label.description": {
    "desc": "<p>By default, an algorithm is used to automatically generate a chart description, but if you want to fully customize it, you can set this value to a description. If it is set to <code class=\"codespan\">&#39;This is a chart showing price changes&#39;</code>, then the value of the <code class=\"codespan\">aria-label</code> attribute of the chart DOM is this string.</p>\n<p>This configuration item is often used to display text that specifies a general description of the chart, when displaying individual data does not show the contents of the chart. For example, if the chart is a map with a large number of scattered points, the default algorithm can only show the locations of the data points and cannot convey the author&#39;s intent as a whole. In this case, you can specify <code class=\"codespan\">description</code> as what the author wants to say.</p>\n"
  },
  "label.general": {
    "desc": "<p>For the overall description of the chart.</p>\n"
  },
  "label.general.withTitle": {
    "desc": "<p>If the chart exists <a href=\"#title.text\">title.text</a>, then <code class=\"codespan\">withTitle</code> is used. This includes the template variable.</p>\n<ul>\n<li><code class=\"codespan\">{title}</code>: will be replaced with <a href=\"#title.text\">title.text</a> of the chart.</li>\n</ul>\n"
  },
  "label.general.withoutTitle": {
    "desc": "<p>If the chart does not have <a href=\"#title.text\">title.text</a>, then <code class=\"codespan\">withoutTitle</code> is used.</p>\n"
  },
  "label.series": {
    "desc": "<p>series-related configuration items.</p>\n"
  },
  "label.series.maxCount": {
    "desc": "<p>The maximum number of series in the description.</p>\n"
  },
  "label.series.single": {
    "desc": "<p>The description used when the chart contains only one series.</p>\n"
  },
  "label.series.single.prefix": {
    "desc": "<p>Holistic descriptions for all series are shown before each series description. This includes template variables.</p>\n<ul>\n<li><code class=\"codespan\">{seriesCount}</code>: will be replaced with the number of series, where it is always 1.</li>\n</ul>\n"
  },
  "label.series.single.withName": {
    "desc": "<p>This description is used if the series has the <code class=\"codespan\">name</code> attribute. This includes the template variable.</p>\n<ul>\n<li><code class=\"codespan\">{seriesName}</code>: will be replaced with <code class=\"codespan\">name</code> of the series.</li>\n<li><code class=\"codespan\">{seriesType}</code>: the name of the type that will be replaced with the series, e.g. <code class=\"codespan\">&#39;Bar chart&#39;</code>, <code class=\"codespan\">&#39;Line chart&#39;</code>, etc.</li>\n</ul>\n"
  },
  "label.series.single.withoutName": {
    "desc": "<p>This description is used if the series has no <code class=\"codespan\">name</code> attribute. This includes the template variable.</p>\n<ul>\n<li><code class=\"codespan\">{seriesType}</code>: the name of the type that will be replaced with the series, e.g. <code class=\"codespan\">&#39;Bar chart&#39;</code>, <code class=\"codespan\">&#39;Line chart&#39;</code>, etc.</li>\n</ul>\n"
  },
  "label.series.multiple": {
    "desc": "<p>Description to use when the chart contains only multiple series.</p>\n"
  },
  "label.series.multiple.prefix": {
    "desc": "<p>A holistic description for all series is displayed before each series description. This includes the template variable.</p>\n<ul>\n<li><code class=\"codespan\">{seriesCount}</code>: will be replaced with the number of series.</li>\n</ul>\n"
  },
  "label.series.multiple.withName": {
    "desc": "<p>This description is used if the series has the <code class=\"codespan\">name</code> attribute. This includes the template variable.</p>\n<ul>\n<li><code class=\"codespan\">{seriesName}</code>: will be replaced with <code class=\"codespan\">name</code> of the series.</li>\n<li><code class=\"codespan\">{seriesType}</code>: the name of the type that will be replaced with the series, e.g. <code class=\"codespan\">&#39;Bar chart&#39;</code>, <code class=\"codespan\">&#39;Line chart&#39;</code>, etc.</li>\n</ul>\n"
  },
  "label.series.multiple.withoutName": {
    "desc": "<p>This description is used if the series has no <code class=\"codespan\">name</code> attribute. This includes the template variable.</p>\n<ul>\n<li><code class=\"codespan\">{seriesType}</code>: the name of the type that will be replaced with the name of the series, e.g. <code class=\"codespan\">&#39;Bar chart&#39;</code>, <code class=\"codespan\">&#39;Line chart&#39;</code>, etc.</li>\n</ul>\n"
  },
  "label.series.multiple.separator": {
    "desc": "<p>The separator between the series and the description of the series.</p>\n"
  },
  "label.series.multiple.separator.middle": {
    "desc": "<p>Except for the separator after the last series.</p>\n"
  },
  "label.series.multiple.separator.end": {
    "desc": "<p>Delimiter after the last series.</p>\n"
  },
  "label.data": {
    "desc": "<p>Data-related configuration items.</p>\n"
  },
  "label.data.maxCount": {
    "desc": "<p>The maximum number of data occurrences per series in the description.</p>\n"
  },
  "label.data.allData": {
    "desc": "<p>Description to be used when all data is displayed. This item <strong>doesn&#39;t</strong> make all the data displayed. It can be achieved by setting <a href=\"#aria.data.maxCount\">aria.data.maxCount</a> to <code class=\"codespan\">Number.MAX_VALUE</code>.</p>\n"
  },
  "label.data.partialData": {
    "desc": "<p>Descriptions used when only partial data is displayed. This includes template variables.</p>\n<ul>\n<li><code class=\"codespan\">{displayCnt}</code>: the number of data that will be replaced with the number of displays.</li>\n</ul>\n"
  },
  "label.data.withName": {
    "desc": "<p>This description is used if the data has the <code class=\"codespan\">name</code> attribute. This includes the template variable.</p>\n<ul>\n<li><code class=\"codespan\">{name}</code>: <code class=\"codespan\">name</code> that will be replaced with the data.</li>\n<li><code class=\"codespan\">{value}</code>: the value that will be replaced with the data.</li>\n</ul>\n"
  },
  "label.data.withoutName": {
    "desc": "<p>This description is used if the data does not have the <code class=\"codespan\">name</code> attribute. This includes the template variable.</p>\n<ul>\n<li><code class=\"codespan\">{value}</code>: the value that will be replaced with the data.</li>\n</ul>\n"
  },
  "label.data.separator": {
    "desc": "<p>The separator between data and data description.</p>\n"
  },
  "label.data.separator.middle": {
    "desc": "<p>The delimiter of the data except the last one.</p>\n"
  },
  "label.data.separator.end": {
    "desc": "<p>The delimiter after the last data.</p>\n<p>Note that usually the last series is followed by the series <code class=\"codespan\">separator.end</code>, so <code class=\"codespan\">data.separator.end</code> is an empty string in most cases.</p>\n"
  },
  "decal": {
    "desc": "<p>Decal patterns are added to series data as an additional hint other than colors to help differentiate the data. It is easy to enabled the default decal patterns by enabling it:</p>\n<pre><code>aria: {\n    enabled: true,\n    decal: {\n        show: true\n    }\n}\n</code></pre><iframe  data-src=\"http://localhost:8086/echarts-website/examples/en/view.html?c=doc-example/aria-decal-simple&edit=1&reset=1\" width=\"700\" height=\"300\"></iframe>\n\n\n<p>Most series types are supported, including: <code class=\"codespan\">&#39;line&#39;</code>, <code class=\"codespan\">&#39;bar&#39;</code>, <code class=\"codespan\">&#39;pie&#39;</code>, <code class=\"codespan\">&#39;radar&#39;</code>, <code class=\"codespan\">&#39;treemap&#39;</code>, <code class=\"codespan\">&#39;sunburst&#39;</code>, <code class=\"codespan\">&#39;boxplot&#39;</code>, <code class=\"codespan\">&#39;sankey&#39;</code>, <code class=\"codespan\">&#39;funnel&#39;</code>, <code class=\"codespan\">&#39;gauge&#39;</code>, <code class=\"codespan\">&#39;pictorialBar&#39;</code>, <code class=\"codespan\">&#39;themeRiver&#39;</code>, <code class=\"codespan\">&#39;custom&#39;</code> and so on. Among them, some series have no filling color by default (such as <code class=\"codespan\">&#39;line&#39;</code>, <code class=\"codespan\">&#39;radar&#39;</code>, <code class=\"codespan\">&#39;boxplot&#39;</code>), which take effect only if the <code class=\"codespan\">&#39;areaStyle&#39;</code> is set.</p>\n"
  },
  "decal.show": {
    "desc": "<p>Whether or not to display the decal pattern is not shown by default. If you want to display the applique, you need to make sure <a href=\"#aria.enabled\">aria.enabled</a> and <code class=\"codespan\">aria.decal.show</code> are both <code class=\"codespan\">true</code>.</p>\n"
  },
  "decal.decals": {
    "desc": "<p>The style of the decal pattern. If it is an <code class=\"codespan\">Object</code> type, it means all data will have the same style, if it is an array, then each item in the array will have one style and the data will be looped through the array in order.</p>\n"
  },
  "decal.decals.symbol": {
    "desc": "<p>The symbol type of the decal. If it is in the type of <code class=\"codespan\">string[]</code>, it means the symbols are used one by one.</p>\n<p>Icon types provided by ECharts includes</p>\n<p><code class=\"codespan\">&#39;circle&#39;</code>, <code class=\"codespan\">&#39;rect&#39;</code>, <code class=\"codespan\">&#39;roundRect&#39;</code>, <code class=\"codespan\">&#39;triangle&#39;</code>, <code class=\"codespan\">&#39;diamond&#39;</code>, <code class=\"codespan\">&#39;pin&#39;</code>, <code class=\"codespan\">&#39;arrow&#39;</code>, <code class=\"codespan\">&#39;none&#39;</code></p>\n<p>It can be set to an image with <code class=\"codespan\">&#39;image://url&#39;</code> , in which URL is the link to an image, or <code class=\"codespan\">dataURI</code> of an image.</p>\n<p>An image URL example:</p>\n<pre><code>&#39;image://http://xxx.xxx.xxx/a/b.png&#39;\n</code></pre><p>A <code class=\"codespan\">dataURI</code> example:</p>\n<pre><code>&#39;image://data:image/gif;base64,R0lGODlhEAAQAMQAAORHHOVSKudfOulrSOp3WOyDZu6QdvCchPGolfO0o/XBs/fNwfjZ0frl3/zy7////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAkAABAALAAAAAAQABAAAAVVICSOZGlCQAosJ6mu7fiyZeKqNKToQGDsM8hBADgUXoGAiqhSvp5QAnQKGIgUhwFUYLCVDFCrKUE1lBavAViFIDlTImbKC5Gm2hB0SlBCBMQiB0UjIQA7&#39;\n</code></pre><p>Icons can be set to arbitrary vector path via <code class=\"codespan\">&#39;path://&#39;</code> in ECharts. As compared with a raster image, vector paths prevent jagging and blurring when scaled, and have better control over changing colors. The size of the vector icon will be adapted automatically. Refer to <a href=\"http://www.w3.org/TR/SVG/paths.html#PathData\" target=\"_blank\">SVG PathData</a> for more information about the format of the path. You may export vector paths from tools like Adobe </p>\n<p>For example:</p>\n<pre><code>&#39;path://M30.9,53.2C16.8,53.2,5.3,41.7,5.3,27.6S16.8,2,30.9,2C45,2,56.4,13.5,56.4,27.6S45,53.2,30.9,53.2z M30.9,3.5C17.6,3.5,6.8,14.4,6.8,27.6c0,13.3,10.8,24.1,24.101,24.1C44.2,51.7,55,40.9,55,27.6C54.9,14.4,44.1,3.5,30.9,3.5z M36.9,35.8c0,0.601-0.4,1-0.9,1h-1.3c-0.5,0-0.9-0.399-0.9-1V19.5c0-0.6,0.4-1,0.9-1H36c0.5,0,0.9,0.4,0.9,1V35.8z M27.8,35.8 c0,0.601-0.4,1-0.9,1h-1.3c-0.5,0-0.9-0.399-0.9-1V19.5c0-0.6,0.4-1,0.9-1H27c0.5,0,0.9,0.4,0.9,1L27.8,35.8L27.8,35.8z&#39;\n</code></pre>"
  },
  "decal.decals.symbolSize": {
    "desc": "<p>Range of values: <code class=\"codespan\">0</code> to <code class=\"codespan\">1</code>, representing the size of symbol relative to decal.</p>\n"
  },
  "decal.decals.symbolKeepAspect": {
    "desc": "<p>Whether or not to keep the aspect ratio of the pattern.</p>\n"
  },
  "decal.decals.color": {
    "desc": "<p>For the color of the decal pattern, it is recommended to use a translucent color, which can be superimposed on the color of the series itself.</p>\n"
  },
  "decal.decals.backgroundColor": {
    "desc": "<p>The background color of the decal will be over the color of the series itself, under the decal pattern.</p>\n"
  },
  "decal.decals.dashArrayX": {
    "desc": "<p>The basic pattern of the decal pattern is an infinite loop in the form of <code class=\"codespan\">Pattern - Blank - Pattern - Blank - Pattern - Blank</code> both horizontally and vertically, respectively. By setting the length of each pattern and blank, complex pattern effects can be achieved.</p>\n<p><code class=\"codespan\">dashArrayX</code> controls the horizontal pattern pattern. When its value is of type <code class=\"codespan\">number</code> or <code class=\"codespan\">number[]</code>, it is similar to <a href=\"https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke-dasharray\" target=\"_blank\">SVG stroke-dasharray</a>.</p>\n<ul>\n<li><p>If it is of type <code class=\"codespan\">number</code>, it means that the pattern and the blank space are of this value respectively. For example, <code class=\"codespan\">5</code> means the pattern with width 5 is displayed first, then 5 pixels empty, then the pattern with width 5 is displayed...</p>\n</li>\n<li><p>In the case of <code class=\"codespan\">number[]</code> type, it means that the pattern and empty space are loops of an array of values. For example: <code class=\"codespan\">[5, 10, 2, 6]</code> means the pattern is 5 pixels wide, then 10 pixels empty, then the pattern is 2 pixels wide, then 6 pixels empty, then the pattern is 5 pixels wide...</p>\n</li>\n<li><p>If of type <code class=\"codespan\">(number | number[])[]</code>, it means that each row is a loop with an array of values for the pattern and blank space. For example: <code class=\"codespan\">[10, [2, 5]]</code> means that the first line will be 10 pixels by 10 pixels and empty space, the second line will be 2 pixels by 2 pixels and empty space, and the third line will be 10 pixels by 10 pixels and empty space...</p>\n</li>\n</ul>\n<p>This interface can be better understood with the following examples.</p>\n<iframe  data-src=\"http://localhost:8086/echarts-website/examples/en/view.html?c=doc-example/aria-decal&edit=1&reset=1\" width=\"700\" height=\"300\"></iframe>\n\n\n"
  },
  "decal.decals.dashArrayY": {
    "desc": "<p>The basic pattern of the decal pattern is an infinite loop in the form of <code class=\"codespan\">Pattern - Blank - Pattern - Blank - Pattern - Blank</code> both horizontally and vertically, respectively. By setting the length of each pattern and blank, complex pattern effects can be achieved.</p>\n<p><code class=\"codespan\">dashArrayY</code> controls the horizontal pattern pattern. Similar to <a href=\"https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke-dasharray\" target=\"_blank\">SVG stroke-dasharray</a>.</p>\n<ul>\n<li><p>If it is a <code class=\"codespan\">number</code> type, it means the pattern and the blank are each of this value. For example, <code class=\"codespan\">5</code> means that the pattern with a height of 5 is displayed first, then 5 pixels empty, then the pattern with a height of 5 is displayed...</p>\n</li>\n<li><p>In the case of <code class=\"codespan\">number[]</code> type, it means that the pattern and empty space are loops of sequential array values. For example: <code class=\"codespan\">[5, 10, 2, 6]</code> means the pattern is 5 pixels high, then 10 pixels empty, then the pattern is 2 pixels high, then 6 pixels empty, then the pattern is 5 pixels high...</p>\n</li>\n</ul>\n<p>This interface can be better understood with the following examples.</p>\n<iframe  data-src=\"http://localhost:8086/echarts-website/examples/en/view.html?c=doc-example/aria-decal&edit=1&reset=1\" width=\"700\" height=\"300\"></iframe>\n\n\n"
  },
  "decal.decals.rotation": {
    "desc": "<p>The overall rotation angle (in radians) of the pattern, in the range from `-Math.</p>\n"
  },
  "decal.decals.maxTileWidth": {
    "desc": "<p>The upper limit of the width of the generated pattern before it is duplicated. Usually this value is not necessary, but you can try to increase it if you notice discontinuous seams in the pattern when it repeats.</p>\n"
  },
  "decal.decals.maxTileHeight": {
    "desc": "<p>The upper limit of the height of the generated pattern before it repeats. This value is usually not necessary to set, but you can try to increase it if you find that the pattern has discontinuous seams when it is repeated.</p>\n"
  }
}