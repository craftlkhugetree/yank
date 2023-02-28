const path = require('path');
const resolve = dir => {
  return path.join(__dirname, dir);
};

module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? './' : './',
  outputDir: 'dist',
  assetsDir: 'static',
  filenameHashing: true, // false 来关闭文件名哈希
  lintOnSave: false, // 关闭eslint
  // 打包时不生成.map文件
  productionSourceMap: false,
  devServer: {
    open: true,
    // host: '0.0.0.0', //本机ip
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
  chainWebpack: config => {
    config.entry.app = ['./src/main.js'];
    config.resolve.alias.set('@', resolve('src'));
  },
  // 第三方插件配置
  pluginOptions: {},
  css: {
    loaderOptions: {
      sass: {
        prependData: `
          @import "./src/assets/css/global.scss";
          `,
      },
      // postcss: {
      //   plugins: [
      //     require('postcss-pxtorem')({
      //       //这里是配置项，详见官方文档
      //       rootValue: 108, //换算基数（分辨率÷10）
      //       unitPrecision: 3, //允许REM单位增长到的十进制数字,小数点后保留的位数。
      //       propList: ['*'],
      //       exclude: /(node_module)/, //默认false，可以（reg）利用正则表达式排除某些文件夹的方法，例如/(node_module)/ 。如果想把前端UI框架内的px也转换成rem，请把此属性设为默认值
      //       selectorBlackList: [], //要忽略并保留为px的选择器
      //       mediaQuery: false, //（布尔值）允许在媒体查询中转换px。
      //       minPixelValue: 1, //设置要替换的最小像素值
      //     }),
      //   ],
      // },
    },
  },
};
