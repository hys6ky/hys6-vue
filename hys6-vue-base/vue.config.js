const { defineConfig } = require("@vue/cli-service");
const path = require("path");
module.exports = defineConfig({
  publicPath: "/",
  outputDir: "../frontend",
  assetsDir: "static",
  transpileDependencies: true,
  productionSourceMap: false,
  pages: {
    index: {
      entry: "src/main.js", //入口文件
      title: "海云数服",
    },
  },
  devServer: {
    port: 20100,
    proxy: {
      "/hyren-gateway": {
        target: process.env.VUE_APP_GATEWAY, // 目标 API 地址
        changeOrigin: true, // 允许websockets跨域
        ws: true,
      },
      "/G/interfaceService": {
        target: "http://172.168.0.90:20007", // 目标 API 地址
        changeOrigin: true, // 允许websockets跨域
        ws: true,
      },
    },
    client: {
      overlay: false,
    },
  },
  pluginOptions: {
    "style-resources-loader": {
      preProcessor: "less",
      patterns: [
        // 全局less变量存储路径
        path.resolve(__dirname, "./src/assets/css/base.less"),
      ],
    },
  },
});
