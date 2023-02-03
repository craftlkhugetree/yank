1.hash模式http://www.test.com/#/就是 Hash URL，当#后面的哈希值发生变化时，可以通过hashchange事件来监听到 URL 的变化，从而进行跳转页面，并且无论哈希值如何变化，服务端接收到的 URL 请求永远是http://www.test.com。Hash 模式相对来说更简单，并且兼容性也更好。每一次改变#后的部分，都会在浏览器的访问历史中增加一个记录，使用"后退"按钮，就可以回到上一个位置。

2.history模式History模式是HTML5 新推出的功能，主要使用history.pushState和history.replaceState改变 URL。通过 History 模式改变 URL 同样不会引起页面的刷新，只会更新浏览器的历史记录。当用户做出浏览器动作时，比如点击后退按钮时会触发popState事件。


两种路由模式的区别：
1.Hash 模式只可以更改 # 后面的内容，History 模式可以通过 API 设置任意的同源 URL
2.History 模式可以通过 API 添加任意类型的数据到历史记录中，Hash 模式只能更改哈希值，也就是字符串
3.Hash模式下， 多次刷新为通一个页面的话，记录只添加一次
4.Hash 模式无需后端配置，并且兼容性好。History 模式在用户手动输入地址或者刷新页面的时候会发起 URL 请求，后端需要配置 index.html 页面用于匹配不到静态资源的时候

Hash 不依赖后端，简单方便。只是 URL 比较“不正常”。

Histroy 的 URL 正常了，但需要服务端配合把路由指向 index.html，否则刷新会 404。



# 路由的hash模式和history对比

hash模式：

hash模式是一种把前端路由的路径用 # 拼接在真实URL后面的模式。

原理是通过location.hash属性设置#后面的路径发生变化，并且浏览器并不会重新发起请求

只要hash地址发生改变，则会触发hashchange事件，我们在事件中设置地址对应的视图展示

hash模式的浏览器兼容性较好，就是看起来不够优雅

# history模式：

history模式用到了HTML5中的history API,允许开发者直接更新浏览器URL地址而不重新发起请求。

用到了history API：replaceState、pushState、back、forward和go这个5个方法。

但是历史记录改变以后，视图并不会更新，我们需要在地址改变（包括使用onpopstate事件监听历史记录的回退）后，重新设置视图

history兼容性不如hash模式，而且浏览器在刷新的时候会按照路径发送真实的资源请求，因此在线上部署基于historyAPI的单页面应用的时候，一定要后端配合支持才行（如果 URL 匹配不到任何静态资源，则应该返回同一个 index.html 页面）


我们的要跳转的网址是放在微信那一串的 URL 中，如果你之前做过微信登录就知道我说的是什么，大概类似这样
https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxd00cbfc8e872c336&redirect_uri=http://xxx.yuming.com/path/&response_type=code&scope=snsapi_userinfo&state=123&connect_redirect=1#wechat_redirect
复制代码其中我们要放的重点是 redirect_uri=http://xxx.yuming.com/path/ 如果你的路由模式是 mode: 'history'，那么你还需要后端支持设置处理刷新和空路由处理的 404 页面，由于种种原因，后端无法对此做支持时，我们就用 mode:'hash' 路由，hash 路由是有 /#/ 来分隔，但是微信内部是不认识你的 hash，上面的一长串链接跳转的过程中，你的 URL 会被送到微信处理之后给你返回，返回来的时候会变成 http://xxx.yuming.com/path/?code=xxxxx#/，可以看到这个时候你的 /#/ 不是紧跟着你的 path 了，至于为什么会这样，这里不详细讨论，这个时候我们需要修复一下这个 url.

# 修复 hash URL
// 如果你们是没有 path 的，就把你们的通用域名 例如 com 传进去
function fixHashUrlAndJump(pathname) {
  if (location.href.includes(`${pathname}/?code`)) {
    let href = location.href
    let url = href.substring(0, href.length - 2)
    let jingPosit = url.indexOf(`${pathname}/`) + pathname.length + 1
    let urlLeft = url.substring(0, jingPosit)
    let urlRight = url.substring(jingPosit, url.length)
    location.href = urlLeft + "#/" + urlRight
    return true
  } else {
    return false
  }
}