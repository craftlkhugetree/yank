一种手法是：通过快排一些网站上排位然后JS劫持流量到主站做排名。
那肯定你们会问，为什么这么大费周章，而不直接去快排主站。

因为主站不能被K，而快排站无所谓，说明一下，百度蜘蛛现在是不能识别JS代码的，一旦惩罚，主站不会被牵连。

而快排站与主站做的行业和关键词都一致，一旦跳转，主站的流量来源都会是行业关键词，想法很好。

最后奉上JS代码：
document.writeln("<script language = javascript>");
document.writeln("document.write(\"<frameset rows='100%,*' frameborder='NO' border='0' framespacing='0'>\");");
document.writeln("document.write(\"<frame name='main' src='http://www.你的网址.com' scrolling=yes>\");");
document.writeln('document.write("</frameset>");');
document.writeln("\x3c/script>");

\x3C是一个转义序列被解释为<字符。

1.<frameset>元素：定义一个框架集，它被用来组织多个窗口。每个窗口都是一个独立的html界面。
2.<frameset>有两个参数，cols和rows。cols：列的数目和尺寸。rows：行的数目和尺寸。 要特别注意的：<frameset>中只能用一个参数。要么是 rows，要么是 cols，不能同时定义。
3.<frameset></frameset>和<body></body>不能一起使用，即不能出现在同一个html页面中。
4.用<frameset>标签前要将前言中的"DTD"改为"Frameset DTD"。
————————————————