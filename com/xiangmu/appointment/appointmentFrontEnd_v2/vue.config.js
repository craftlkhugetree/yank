
const path = require('path');
const resolve = dir => {
  return path.join(__dirname, dir);
};

module.exports = {
  publicPath: process.env.NODE_ENV === "production" ? "./" : "./",
  outputDir: 'dist',
  assetsDir: 'static',
  filenameHashing: true, // false 来关闭文件名哈希
  lintOnSave: false, // 关闭eslint
  // 打包时不生成.map文件
  productionSourceMap: false,
  devServer: {
    open: true,
    // host: '172.20.2.222', //本机ip
    host: 'localhost',
    port: 8080,
    // proxy: {
    //   '/': {
    //     target: ' http://160.255.0.67:8888', //seat环境
    //     secure: true,  // https接口为true
    //     changeOrigin: true
    //   },
    // }
  },
  // webpack相关配置
  chainWebpack: (config) => {
    config.entry.app = ['./src/main.js']
    config.resolve.alias.set('@', resolve('src'))
  },
  // 第三方插件配置
  pluginOptions: {

  }
}

