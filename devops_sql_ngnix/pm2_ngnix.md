nginx -s stop
nginx -s reload

跳转有两种情况：一种页面刷新，一种页面不刷新。
1、push不会刷新页面，只会更改浏览器上的url路由变更，不管是react-router还是vue-router都是运用html的api实现，叫做history.pushState()。
2、会刷新页面，它相当于a标签。

1、假设现在在浏览器上的url为 172.1.2.3:7000/tour/home ，此时刷新页面时候会去根据浏览器上的url去服务器（nginx）上面请求对应的静态资源，nginx根据location / 的匹配规则在dist文件夹里没有找到对应的静态文件"home"，所以返回404，合理。

2、此时通过配置try_files来重定向返回index.html文件，也就是回去首页“ / ”,注意，此时你的页面已经刷新过了，此时react-router或者vue-router路由发挥作用，会根据当前的url地址来对应匹配上组件，所以此时url即对应组件，页面重新加载完成，完事。

# 针对publicPath放到index.html上的静态文件而不是路由，并且顺序要在 / 上方，接口的前缀在interceptor文件
        location ~* /tour/.*\.(js|css|png|jpg|jpeg)$ {
            # alias /abc/test.html;
            # rewrite ^/(.*)$ /test/;
            rewrite "^/tour/(.*)$" /$1 break; 
        }


location / {
            root   html;
            index  index.html index.htm;
# 防止404，每次匹配url路径时候找不到对应静态资源时候跳转到index.html文件，然后才是根据vue路由匹配，匹配不到才走*标注的路由。
            try_files $uri $uri/ /tour/index.html;  
# $uri 是请求文件的路径, $uri/ 是请求目录的路径, 当try_files 找不到文件时，内部会将这次请求重定向到最后一个参数，所以最后一个参数必须存在。
}



#!/usr/bin/env bash
# publish
tar -czvf tour.tar.gz .
# mkdir -p 递归创建目录，即便其中目录不存在
mkdir -p /work/api/tour
rm -rf /work/api/tour/*
cp -rf tour.tar.gz /work/api/tour
cd /work/api/tour && tar -xvf tour.tar.gz && 
         npm --registry=https://registry.npm.taobao.org install && pm2 stop pm2.json && pm2 start pm2.json


pm2 start pm2.json
pm2 logs   pm2 log id
pm2 monit
pm2 list
pm2 show name|id
pm2 restart js|name|id
pm2 stop all


# 当上面的路由都不匹配时：
app.use("*",(req,res)=>{  //不是以'/api'开头的路由全部返回"hello world"
  res.send("hello world");
})



tail -n 20 -f access.log