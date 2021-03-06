const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require("path");
const resolve = (dir) => {
  return path.join(__dirname, dir);
};

module.exports = {
  publicPath: process.env.NODE_ENV === "production" ? "/lres2022/mobile/" : "/",
  outputDir: "dist",
  assetsDir: "static",
  // assetsSubDirectory: "static",
  filenameHashing: true, // false 来关闭文件名哈希
  lintOnSave: false, // 关闭eslint
  // 打包时不生成.map文件
  productionSourceMap: false,
  devServer: {
    open: true,
    // host: '172.20.2.153', //本机ip
    host: "localhost",
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
    config.entry.app = ["./src/main.js"];
    config.resolve.alias.set("@", resolve("src"));
    // copy custom static assets
    config.plugin("copy").use(
      new CopyWebpackPlugin([
        {
          from: path.resolve(__dirname, "./static"),
          to: "static",
          ignore: [".*"],
        },
        {
          from: path.resolve(__dirname, "./public"),
          to: "",
          ignore: [""],
        },
      ])
    );
  },
  // 第三方插件配置
  pluginOptions: {},
};
