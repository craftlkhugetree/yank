window.__EC_DOC_option_gl_xAxis3D = {
  "show": {
    "desc": "<p>Whether to display the x-axis.</p>\n"
  },
  "name": {
    "desc": "<p>The name of the axis.</p>\n"
  },
  "grid3DIndex": {
    "desc": "<p>The index of the <a href=\"#grid3D\">grid3D</a> component used by the axis. The default is to use the first <a href=\"#grid3D\">grid3D</a> component.</p>\n"
  },
  "nameTextStyle": {
    "desc": "<p>Text style of axis name.</p>\n"
  },
  "nameTextStyle.color": {
    "desc": "<p>Color of axis name uses <a href=\"#xAxis3D.axisLine.lineStyle.color\">axisLine.lineStyle.color</a> by default.</p>\n"
  },
  "nameTextStyle.borderWidth": {
    "desc": "<p>The border width of the text.</p>\n"
  },
  "nameTextStyle.borderColor": {
    "desc": "<p>The border color of the text.</p>\n"
  },
  "nameTextStyle.fontFamily": {
    "desc": "<p>The font family of the text.</p>\n"
  },
  "nameTextStyle.fontSize": {
    "desc": "<p>The font size of the text.</p>\n"
  },
  "nameTextStyle.fontWeight": {
    "desc": "<p>The font thick weight of the text.</p>\n<p><strong>Optional:</strong></p>\n<ul>\n<li><code class=\"codespan\">&#39;normal&#39;</code></li>\n<li><code class=\"codespan\">&#39;bold&#39;</code></li>\n<li><code class=\"codespan\">&#39;bolder&#39;</code></li>\n<li><code class=\"codespan\">&#39;lighter&#39;</code></li>\n<li>100 | 200 | 300 | 400...</li>\n</ul>\n"
  },
  "nameGap": {
    "desc": "<p>The gap between the axis name and axis line. Note the distance is in 3D space, not the screen pixel value.</p>\n"
  },
  "type": {
    "desc": "<p>The type of the axis.</p>\n<p>Optional:</p>\n<ul>\n<li><p><code class=\"codespan\">&#39;value&#39;</code>\n  The value axis. Suitable for continuous data.</p>\n</li>\n<li><p><code class=\"codespan\">&#39;category&#39;</code>\n  The category axis. Suitable for the discrete category data. For this type, the category data must be set through <a href=\"#xAxis3D.data\">data</a>.</p>\n</li>\n<li><p><code class=\"codespan\">&#39;time&#39;</code>\n  The timeline. Suitable for the continuous timing data. The time axis has a time format compared to the value axis, and the scale calculation is also different. For example, the scale of the month, week, day, and hour ranges can be determined according to the range of the span.</p>\n</li>\n<li><p><code class=\"codespan\">&#39;log&#39;</code>\n  Logarithmic axis. Suitable for the logarithmic data.</p>\n</li>\n</ul>\n"
  },
  "min": {
    "desc": "<p>The minimum value of axis.</p>\n<p>It can be set to a special value <code class=\"codespan\">&#39;dataMin&#39;</code> so that the minimum value on this axis is set to be the minimum label.</p>\n<p>It will be automatically computed to make sure the axis tick is equally distributed when not set.</p>\n<p>In the category axis, it can also be set as the ordinal number. For example, if a category axis has <code class=\"codespan\">data: [&#39;categoryA&#39;, &#39;categoryB&#39;, &#39;categoryC&#39;]</code>, and the ordinal <code class=\"codespan\">2</code> represents <code class=\"codespan\">&#39;categoryC&#39;</code>. Moreover, it can be set as a negative number, like <code class=\"codespan\">-3</code>.</p>\n"
  },
  "max": {
    "desc": "<p>The maximum value of the axis.</p>\n<p>It can be set to a special value <code class=\"codespan\">&#39;dataMax&#39;</code> so that the minimum value on this axis is set to be the maximum label.</p>\n<p>It will be automatically computed to make sure the axis tick is equally distributed when not set.</p>\n<p>In the category axis, it can also be set as the ordinal number. For example, if a category axis has <code class=\"codespan\">data: [&#39;categoryA&#39;, &#39;categoryB&#39;, &#39;categoryC&#39;]</code>, and the ordinal <code class=\"codespan\">2</code> represents <code class=\"codespan\">&#39;categoryC&#39;</code>. Moreover, it can be set as a negative number, like <code class=\"codespan\">-3</code>.</p>\n"
  },
  "scale": {
    "desc": "<p>It is available only in numerical axis, i.e., <a href=\"#xAxis3D.type\">type</a>: &#39;value&#39;.</p>\n<p>It specifies whether not to contain zero position of axis compulsively. When it is set to be <code class=\"codespan\">true</code>, the axis may not contain zero position, which is useful in the scatter chart for both value axes.</p>\n<p>This configuration item is unavailable when the <a href=\"#xAxis3D.min\">min</a> and <a href=\"#xAxis3D.max\">max</a> are set.</p>\n"
  },
  "splitNumber": {
    "desc": "<p>The number of segments that the axis is split into. Note that this number serves only as a recommendation, and the true segments may be adjusted based on readability.</p>\n<p>This is unavailable for the category axis.</p>\n"
  },
  "minInterval": {
    "desc": "<p>Minimum gap between split lines.</p>\n<p>For example, it can be set to be <code class=\"codespan\">1</code> to make sure the axis label is shown as an integer.</p>\n<pre><code class=\"lang-js\">{\n    minInterval: 1\n}\n</code></pre>\n<p>It is available only for axis of <a href=\"#xAxis3D.type\">type</a> &#39;value&#39; or &#39;time&#39;.</p>\n"
  },
  "interval": {
    "desc": "<p>Compulsively set segmentation interval for axis.</p>\n<p>As <a href=\"#xAxis3D.splitNumber\">splitNumber</a> is a recommendation value, the calculated tick may not be the same as expected. In this case, interval should be used along with <a href=\"#xAxis3D.min\">min</a> and <a href=\"#xAxis3D.max\">max</a> to compulsively set tickings. But in most cases, we do not suggest using this, out automatic calculation is enough for most situations.</p>\n<p>This is unavailable for category axis. Timestamp should be passed for <a href=\"#xAxis3D.type\">type</a>: &#39;time&#39; axis. Logged value should be passed for <a href=\"#xAxis3D.type\">type</a>: &#39;log&#39; axis.</p>\n"
  },
  "logBase": {
    "desc": "<p>Base of logarithm, which is valid only for numeric axes with <a href=\"#xAxis3D.type\">type</a>: &#39;log&#39;.</p>\n"
  },
  "data": {
    "desc": "<p>Category data, available in <a href=\"#xAxis3D.type\">type</a>: &#39;category&#39; axis.</p>\n<p>If <a href=\"#xAxis3D.type\">type</a> is specified as <code class=\"codespan\">&#39;category&#39;</code>, but <code class=\"codespan\">axis.data</code> is not specified, <code class=\"codespan\">axis.data</code> will be auto collected from <a href=\"#series.data\">series.data</a>. It brings convenience, but we should notice that <code class=\"codespan\">axis.data</code> provides then value range of the <code class=\"codespan\">&#39;category&#39;</code> axis. If  it is auto collected from <a href=\"#series.data\">series.data</a>, Only the values appearing in <a href=\"#series.data\">series.data</a> can be collected. For example, if <a href=\"#series.data\">series.data</a> is empty, nothing will be collected.</p>\n<p>Example:</p>\n<pre><code class=\"lang-js\">// Name list of all categories\ndata: [&#39;Monday&#39;, &#39;Tuesday&#39;, &#39;Wednesday&#39;, &#39;Thursday&#39;, &#39;Friday&#39;, &#39;Saturday&#39;, &#39;Sunday&#39;]\n// Each item could also be a specific configuration item.\n// In this case, `value` is used as the category name.\ndata: [{\n    value: &#39;Monday&#39;,\n    // Highlight Monday\n    textStyle: {\n        fontSize: 20,\n        color: &#39;red&#39;\n    }\n}, &#39;Tuesday&#39;, &#39;Wednesday&#39;, &#39;Thursday&#39;, &#39;Friday&#39;, &#39;Saturday&#39;, &#39;Sunday&#39;]\n</code></pre>\n"
  },
  "data.value": {
    "desc": "<p>Name of a category.</p>\n"
  },
  "data.textStyle": {
    "desc": "<p>Text style of the category.</p>\n"
  },
  "data.textStyle.color": {
    "desc": "<p>The Color of the text.</p>\n"
  },
  "data.textStyle.borderWidth": {
    "desc": "<p>The border width of the text.</p>\n"
  },
  "data.textStyle.borderColor": {
    "desc": "<p>The border color of the text.</p>\n"
  },
  "data.textStyle.fontFamily": {
    "desc": "<p>The font family of the text.</p>\n"
  },
  "data.textStyle.fontSize": {
    "desc": "<p>The font size of the text.</p>\n"
  },
  "data.textStyle.fontWeight": {
    "desc": "<p>The font thick weight of the text.</p>\n<p><strong>Optional:</strong></p>\n<ul>\n<li><code class=\"codespan\">&#39;normal&#39;</code></li>\n<li><code class=\"codespan\">&#39;bold&#39;</code></li>\n<li><code class=\"codespan\">&#39;bolder&#39;</code></li>\n<li><code class=\"codespan\">&#39;lighter&#39;</code></li>\n<li>100 | 200 | 300 | 400...</li>\n</ul>\n<p>The display interval of </p>\n"
  },
  "axisLine": {
    "desc": "<p>Settings related to axis line.</p>\n"
  },
  "axisLine.show": {
    "desc": "<p>Set this to be <code class=\"codespan\">false</code> to prevent the axis line from showing.</p>\n"
  },
  "axisLine.interval": {
    "desc": "<p>axis scale label is valid in the category axis. </p>\n<p>By default, <code class=\"codespan\">interval</code> is automatically calculated to ensure a good display.</p>\n<p>It can be set to 0 to force all labels to be displayed.</p>\n<p>If the value is <code class=\"codespan\">1</code>, it means &quot;displays a label every other label&quot;. If the value is <code class=\"codespan\">2</code>, it means &quot;displays a label between two labels&quot;, and so on.</p>\n<p>The interval data can be represented by a numerical value or by a callback function. The format of the callback function is as follows:</p>\n<pre><code class=\"lang-js\">(index:number, value: string) =&gt; boolean\n</code></pre>\n<p>The first parameter is the index of the class, the second value is the name of the class, and if it is skipped, it returns <code class=\"codespan\">false</code>.</p>\n"
  },
  "axisLine.lineStyle.color": {
    "desc": "<p>The color of the line. </p>\n<p>In addition to color strings, RGBA values represented by arrays are supported, for example:</p>\n<pre><code class=\"lang-js\">// pure white\n[1, 1, 1, 1]\n</code></pre>\n<p>When using an array representation, each channel can set a value greater than 1 to represent the color value of HDR.</p>\n"
  },
  "axisLine.lineStyle.opacity": {
    "desc": "<p>The opacity of the line.</p>\n"
  },
  "axisLine.lineStyle.width": {
    "desc": "<p>The width of the line.</p>\n"
  },
  "axisLabel": {
    "desc": "<p>Settings related to axis label.</p>\n"
  },
  "axisLabel.show": {
    "desc": "<p>Set this to be <code class=\"codespan\">false</code> to prevent the axis label from appearing.</p>\n"
  },
  "axisLabel.margin": {
    "desc": "<p>The margin between the axis label and the axis line.</p>\n<p><strong>Note：</strong> This distance is three-dimensional space, not screen space.</p>\n"
  },
  "axisLabel.interval": {
    "desc": "<p>axis scale label is valid in the category axis. </p>\n<p>By default, <code class=\"codespan\">interval</code> is automatically calculated to ensure a good display.</p>\n<p>It can be set to 0 to force all labels to be displayed.</p>\n<p>If the value is <code class=\"codespan\">1</code>, it means &quot;displays a label every other label&quot;. If the value is <code class=\"codespan\">2</code>, it means &quot;displays a label between two labels&quot;, and so on.</p>\n<p>The interval data can be represented by a numerical value or by a callback function. The format of the callback function is as follows:</p>\n<pre><code class=\"lang-js\">(index:number, value: string) =&gt; boolean\n</code></pre>\n<p>The first parameter is the index of the class, the second value is the name of the class, and if it is skipped, it returns <code class=\"codespan\">false</code>.</p>\n"
  },
  "axisLabel.textStyle.color": {
    "desc": "<p>Color of axis label is set to be <a href=\"#.axisLine.lineStyle.color\">axisLine.lineStyle.color</a> by default. Callback function is supported, in the following format:</p>\n<pre><code class=\"lang-js\">(val: string) =&gt; Color\n</code></pre>\n<p>Parameter is the text of label, and return value is the color. See the following example:</p>\n<pre><code class=\"lang-js\">textStyle: {\n    color: function (value, index) {\n        return value &gt;= 0 ? &#39;green&#39; : &#39;red&#39;;\n    }\n}\n</code></pre>\n"
  },
  "axisLabel.textStyle.borderWidth": {
    "desc": "<p>The border width of the text.</p>\n"
  },
  "axisLabel.textStyle.borderColor": {
    "desc": "<p>The border color of the text.</p>\n"
  },
  "axisLabel.textStyle.fontFamily": {
    "desc": "<p>The font family of the text.</p>\n"
  },
  "axisLabel.textStyle.fontSize": {
    "desc": "<p>The font size of the text.</p>\n"
  },
  "axisLabel.textStyle.fontWeight": {
    "desc": "<p>The font thick weight of the text.</p>\n<p><strong>Optional:</strong></p>\n<ul>\n<li><code class=\"codespan\">&#39;normal&#39;</code></li>\n<li><code class=\"codespan\">&#39;bold&#39;</code></li>\n<li><code class=\"codespan\">&#39;bolder&#39;</code></li>\n<li><code class=\"codespan\">&#39;lighter&#39;</code></li>\n<li>100 | 200 | 300 | 400...</li>\n</ul>\n\n"
  },
  "axisTick": {
    "desc": "<p>Settings related to axis tick.</p>\n"
  },
  "axisTick.show": {
    "desc": "<p>Set this to be <code class=\"codespan\">false</code> to prevent the axis tick from showing.</p>\n"
  },
  "axisTick.interval": {
    "desc": "<p>axis scale label is valid in the category axis.  Defaults to the same as <a href=\"#.axisLabel.interval\">axisLabel.interval</a>. </p>\n<p>By default, <code class=\"codespan\">interval</code> is automatically calculated to ensure a good display.</p>\n<p>It can be set to 0 to force all labels to be displayed.</p>\n<p>If the value is <code class=\"codespan\">1</code>, it means &quot;displays a label every other label&quot;. If the value is <code class=\"codespan\">2</code>, it means &quot;displays a label between two labels&quot;, and so on.</p>\n<p>The interval data can be represented by a numerical value or by a callback function. The format of the callback function is as follows:</p>\n<pre><code class=\"lang-js\">(index:number, value: string) =&gt; boolean\n</code></pre>\n<p>The first parameter is the index of the class, the second value is the name of the class, and if it is skipped, it returns <code class=\"codespan\">false</code>.</p>\n"
  },
  "axisTick.length": {
    "desc": "<p>The length of the axis tick.</p>\n"
  },
  "axisTick.lineStyle.color": {
    "desc": "<p>Color of axis label is set to be <a href=\"#.axisLine.lineStyle.color\">axisLine.lineStyle.color</a> by default.</p>\n"
  },
  "axisTick.lineStyle.opacity": {
    "desc": "<p>The opacity of the line.</p>\n"
  },
  "axisTick.lineStyle.width": {
    "desc": "<p>The width of the line.</p>\n\n"
  },
  "splitLine": {
    "desc": "<p>Settings related to axis line.</p>\n"
  },
  "splitLine.show": {
    "desc": "<p>Set this to be <code class=\"codespan\">false</code> to prevent the axis line from showing.</p>\n"
  },
  "splitLine.interval": {
    "desc": "<p>axis scale label is valid in the category axis. </p>\n<p>By default, <code class=\"codespan\">interval</code> is automatically calculated to ensure a good display.</p>\n<p>It can be set to 0 to force all labels to be displayed.</p>\n<p>If the value is <code class=\"codespan\">1</code>, it means &quot;displays a label every other label&quot;. If the value is <code class=\"codespan\">2</code>, it means &quot;displays a label between two labels&quot;, and so on.</p>\n<p>The interval data can be represented by a numerical value or by a callback function. The format of the callback function is as follows:</p>\n<pre><code class=\"lang-js\">(index:number, value: string) =&gt; boolean\n</code></pre>\n<p>The first parameter is the index of the class, the second value is the name of the class, and if it is skipped, it returns <code class=\"codespan\">false</code>.</p>\n"
  },
  "splitLine.lineStyle.color": {
    "desc": "<p>The color of the line. </p>\n<p>In addition to color strings, RGBA values represented by arrays are supported, for example:</p>\n<pre><code class=\"lang-js\">// pure white\n[1, 1, 1, 1]\n</code></pre>\n<p>When using an array representation, each channel can set a value greater than 1 to represent the color value of HDR.</p>\n"
  },
  "splitLine.lineStyle.opacity": {
    "desc": "<p>The opacity of the line.</p>\n"
  },
  "splitLine.lineStyle.width": {
    "desc": "<p>The width of the line.</p>\n"
  },
  "splitArea": {
    "desc": "<p>Split area of axis in <a href=\"#grid\">grid</a> area.</p>\n"
  },
  "splitArea.show": {
    "desc": "<p>Set this to be <code class=\"codespan\">true</code> to show the splitArea.</p>\n"
  },
  "splitArea.interval": {
    "desc": "<p>Axis splitArea is valid in the category axis.  Defaults to the same as <a href=\"#.axisLabel.interval\">axisLabel.interval</a>. </p>\n<p>By default, <code class=\"codespan\">interval</code> is automatically calculated to ensure a good display.</p>\n<p>It can be set to 0 to force all labels to be displayed.</p>\n<p>If the value is <code class=\"codespan\">1</code>, it means &quot;displays a label every other label&quot;. If the value is <code class=\"codespan\">2</code>, it means &quot;displays a label between two labels&quot;, and so on.</p>\n<p>The interval data can be represented by a numerical value or by a callback function. The format of the callback function is as follows:</p>\n<pre><code class=\"lang-js\">(index:number, value: string) =&gt; boolean\n</code></pre>\n<p>The first parameter is the index of the class, the second value is the name of the class, and if it is skipped, it returns <code class=\"codespan\">false</code>.</p>\n"
  },
  "splitArea.areaStyle": {
    "desc": "<p>Split area style.</p>\n"
  },
  "splitArea.areaStyle.color": {
    "desc": "<p>Color of the split area.\nThe split area color could also be set in color array, which the split lines would take as their colors in turns. Dark and light colors in turns are used by default.</p>\n"
  },
  "axisPointer": {
    "desc": "<p>Configurations for axis pointer.</p>\n"
  },
  "axisPointer.show": {
    "desc": "<p>Whether to display the axisPointer. Set this to be <code class=\"codespan\">true</code> to show the splitArea.</p>\n"
  },
  "axisPointer.lineStyle.color": {
    "desc": "<p>The color of the line. </p>\n<p>In addition to color strings, RGBA values represented by arrays are supported, for example:</p>\n<pre><code class=\"lang-js\">// pure white\n[1, 1, 1, 1]\n</code></pre>\n<p>When using an array representation, each channel can set a value greater than 1 to represent the color value of HDR.</p>\n"
  },
  "axisPointer.lineStyle.opacity": {
    "desc": "<p>The opacity of the line.</p>\n"
  },
  "axisPointer.lineStyle.width": {
    "desc": "<p>The width of the line.</p>\n"
  },
  "axisPointer.label": {
    "desc": "<p>The label of axisPointer.</p>\n"
  },
  "axisPointer.label.show": {
    "desc": "<p>Whether to display the label of axisPointer. Value axes are displayed by default, while category axes are not.</p>\n"
  },
  "axisPointer.label.formatter": {
    "desc": "<p>The formatter of the label. . The first parameter to the function is the value of the current axis. The second parameter to the function is an array of values for all axes.</p>\n<pre><code class=\"lang-js\">(value: number, valueAll: Array) =&gt; string\n</code></pre>\n"
  },
  "axisPointer.label.margin": {
    "desc": "<p>Distance between label and axis.\nLike the scale label, this distance is a 3D space rather than a screen pixel.</p>\n"
  },
  "axisPointer.label.textStyle.color": {
    "desc": "<p>The Color of the text.</p>\n"
  },
  "axisPointer.label.textStyle.borderWidth": {
    "desc": "<p>The border width of the text.</p>\n"
  },
  "axisPointer.label.textStyle.borderColor": {
    "desc": "<p>The border color of the text.</p>\n"
  },
  "axisPointer.label.textStyle.fontFamily": {
    "desc": "<p>The font family of the text.</p>\n"
  },
  "axisPointer.label.textStyle.fontSize": {
    "desc": "<p>The font size of the text.</p>\n"
  },
  "axisPointer.label.textStyle.fontWeight": {
    "desc": "<p>The font thick weight of the text.</p>\n<p><strong>Optional:</strong></p>\n<ul>\n<li><code class=\"codespan\">&#39;normal&#39;</code></li>\n<li><code class=\"codespan\">&#39;bold&#39;</code></li>\n<li><code class=\"codespan\">&#39;bolder&#39;</code></li>\n<li><code class=\"codespan\">&#39;lighter&#39;</code></li>\n<li>100 | 200 | 300 | 400...</li>\n</ul>\n"
  }
}