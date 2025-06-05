import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "@/assets/css/common.css"; //引入全局样式
import { resetMessage } from "@/utils/resetMessage";
import axios from "axios";
import "./utils/demandComponent.js"; //element按需引入
Vue.prototype.$resetMessage = resetMessage;
Vue.prototype.$axios = axios;
Vue.config.productionTip = false;

/** 日期时间格式转换 */
import * as dateconversion from "@/utils/dateconversion.js";
Object.keys(dateconversion).forEach((key) => {
  // 注册自定义指令
  Vue.filter(key, dateconversion[key]);
});
Vue.prototype.$dateconversion = dateconversion;

// 引入echarts
import * as echarts from "echarts";
Vue.prototype.$echarts = echarts;

/**验证引入 */
import filterRule from "@/utils/filter_rules";
Vue.use(filterRule);

/**
 * 批量注入全局组件
 */
import byui from "@/components/global/reg";
Vue.use(byui);

/**
 * 配置全局请求接口的封装
 */
import * as _executeRequest from "@/utils/executeRequest";
Vue.prototype.$executeRequest = _executeRequest;
/**
 * 防抖指令
 */
import "@/directives/debounce.js";

/**公用的提示消息框 */
import * as message from "@/utils/message.js";
Vue.prototype.$Msg = message;

let app;
/**
 * 挂载函数
 */
function mount() {
  app = new Vue({
    el: "#indexapp",
    store,
    router,
    render: function (h) {
      return h(App);
    },
  });
}

/**
 * 卸载函数
 */
function unmount() {
  app.$destroy();
  app.$el.innerHTML = "";
  app = null;
}

/**微前端环境下，注册mount和unmount方法 */
if (window.__MICRO_APP_ENVIRONMENT__)
  window[`micro-app-${window.__MICRO_APP_NAME__}`] = { mount, unmount };
else mount();

// // 监听卸载操作
// window.addEventListener("unmount", function () {
//   app.$destroy();
// });
