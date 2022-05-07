const path = require('path')
const resolve = dir => path.join(__dirname, dir)

const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin; // 打包分析

const IS_PRODUCTION = ['production', 'prod'].includes(process.env.NODE_ENV); //判断是否是生产环境

module.exports = {
    publicPath: process.env.NODE_ENV === 'production' ? '/web/' : '/',
    outputDir: 'dist',
    assetsDir: 'static',
    productionSourceMap: false, // 生产环境是否要生成 sourceMap  
    filenameHashing: false, // 文件名哈希值
    lintOnSave: false, // 是否在保存的时候使用 `eslint-loader` 进行检查。
    devServer: {
        open: true, // npm run serve时是否直接打开浏览器
        host: 'localhost',
        port: 8080,
        https: false,  // 是否https
        // proxy: {
        //     '/api': {
        //         target: 'http://127.0.0.1:10001',
        //         changeOrigin: true, // 是否跨域
        //         ws: false,      // 是否支持websocket
        //         secure: false,  // 如果是https接口，需要配置这个参数
        //         pathRewrite: {  // 可以理解为一个重定向或者重新赋值的功能
        //             '^/api': '' // '^/api': '/'    这种接口配置出来     http://127.0.0.1:10001/login
        //         }               // '^/api': '/api'  这种接口配置出来     http://127.0.0.1:10001/api/login
        //     }
        // }
    },
    // 是否为 Babel 或 TypeScript 使用 thread-loader(线程加载器)。该选项在系统的 CPU 有多于一个内核时自动启用，仅作用于生产构建。
    parallel: require("os").cpus().length > 1,
    
    chainWebpack: config => {
        config.entry.app = ['./src/main.js']
        // 设置别名
        config.resolve.alias      
        .set('@', resolve('src'))
        .set('@/views', resolve('src/views'))
        // if(IS_PRODUCTION) {
        //     config.plugin("webpack-bundle-analyzer").use(BundleAnalyzerPlugin)
        // }
    },
}