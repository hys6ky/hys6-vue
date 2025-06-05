const {defineConfig} = require("@vue/cli-service");
const path = require("path");
module.exports = defineConfig({
  publicPath: process.env.VUE_APP_PUBLIC_PATH,
  outputDir: "../frontend/S",
  assetsDir: "static",
  transpileDependencies: true,
  productionSourceMap: false,
  devServer: {
    port: 20119,
    // 设置本地运行的跨域权限
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    proxy: {
      "/hyren-gateway": {
        target: process.env.VUE_APP_GATEWAY, // 目标 API 地址
        changeOrigin: true, // 允许websockets跨域
        ws: true,
      },
    },
    client: {
      overlay: false
    }
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
