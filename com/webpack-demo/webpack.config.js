const HtmlWebpackPlugin = require('html-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const webpack = require('webpack');

const path = require('path');

module.exports = {
  mode: 'development',
  // 多个文件混入一个bundle时，准确打印出错位置。但是vue的configureWebpack:{devtool: "source-map"}虽然消灭了 webpack-internal，但是却无法准确定位错误。
  devtool: 'inline-source-map',
  // 以下配置告知 webpack-dev-server，将 dist 目录下的文件 serve 到 localhost:8080 下。
  devServer: {
    static: './dist',
  },
  optimization: {
    // 一个 HTML 页面上使用多个入口时，被多次调用的文件所含变量在每个调用中都是独立的，不会相互影响，设置single后就是同一个变量了。
    // runtimeChunk生成一个runtime...js，与被懒加载的文件息息相关。将 runtime 代码拆分为一个单独的 chunk。将其设置为 single 来为所有 chunk 创建一个 runtime bundle。
    /**如果入口文件m在头部import文件a，修改a时m文件名变化，但是runtime不变，且构建后没有a文件。 若m懒加载a，修改a或a的webpackChunkName时runtime变化，runtime与m无关，且构建后有a。
     * 以上a都不是入口文件，修改a，那么m名称是不变的，增强了缓存时长。
     * 若a是entry，入口文件m头部import文件a，那么修改a或m都不会影响runtime。 若是懒加载，则修改m不影响runtime，但修改a就会改变runtime名称。
     */
    runtimeChunk: 'single',
    //   因为每个 module.id 会默认地基于解析顺序(resolve order)进行增量。也就是说，当解析顺序发生变化，ID 也会随之改变。简要概括：vendor bundle 会随着自身的 module.id 的变化，而发生变化。
    moduleIds: 'deterministic',
    // 生成chunk有三种方式，entry、动态加载、splitChunks抽取共有代码。chunk是webpack打包过程中依赖捆绑的术语。bundle可以理解为对chunk编译/压缩打包等处理后输出的最终结果。
    /**chunk和bundle一般是1对1的关系，实际上，它也可以是1对多的关系。
        很好理解，假设入口点为entry1和entry2，它们都引用了a和b模块，打包出来的除了与entry1和entry2一一对应的entry1.bundle.js和entry2.bundle.js，
        还有一个default~entry1~entry2.bundle.js（包含了a和b，也就是一组chunk）。
    */
    splitChunks: {
      // 移除重复的依赖模块。需要注意的是，插件将 lodash 分离到单独的 chunk，并且将其从 main bundle 中移除。
      chunks: 'all',
      // 利用 client 的长效缓存机制，命中缓存来消除请求，并减少向 server 获取资源，同时还能保证 client 代码和 server 代码版本一致。 
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  },
  entry: {
    index: './src/index.js',
    // print: './src/print.js',
  },
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
    // 调整 webpack 配置文件，以确保 middleware(中间件) 功能能够正确启用：
    publicPath: '/',
  },
  plugins: [
    // 在dist中建立自己的index.html，并且挂载所有entry
    new HtmlWebpackPlugin({
      title: 'Output Management',
    }),
    new BundleAnalyzerPlugin(), // 使用默认配置
    // shimming预置依赖，_join按需不管用，lodash还是全都加载了。直接在代码里用require才是按需。
    new webpack.ProvidePlugin({
    //   _: 'lodash',
    //   _join: ['lodash', 'join'],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
    ],
  },
};
