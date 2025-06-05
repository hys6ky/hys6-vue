const { defineConfig } = require("@vue/cli-service");
const path = require("path");
module.exports = defineConfig({
  publicPath: process.env.VUE_APP_PUBLIC_PATH,
  outputDir: "../frontend/V",
  assetsDir: "static",
  transpileDependencies: true,
  productionSourceMap: false,
  devServer: {
    port: 20122,
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
  chainWebpack(config) {
    config.optimization.minimizer("terser").tap((args) => {
      args[0].terserOptions.compress.drop_console = true;
      return args;
    });
    //限制静态资源图片最小范围，超过100kb此范围必须转换为base64，避免打包后assets静态图片无法出现
    // 配置图片的 loader
    config.module
      .rule("images")
      .test(/\.(png|jpe?g|gif|webp)(\?.*)?$/)
      .set("parser", {
        dataUrlCondition: {
          maxSize: 10000 * 1024, // 100kb
        },
      });
  },
});
