import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "@/assets/css/common.css"; //引入全局样式
import { resetMessage } from "@/utils/resetMessage";
import axios from "axios";
import "@/utils/demandComponent.js"; //element按需引入
Vue.prototype.$resetMessage = resetMessage;
Vue.prototype.$axios = axios;
Vue.config.productionTip = false;

Vue._watchers = Vue.prototype._watchers = [];  //v-charts组件出现（undefined (reading ‘map‘）bug解决方案

/** 获取代码项类型 */
import * as codeItems from '@/utils/codeitems'
Vue.prototype.$Code = codeItems;

/** base64加密 */
import Base64 from '@/utils/base64.js'
Vue.prototype.$Base64 = Base64;

/** 日期时间格式转换 */
import * as dateConversion from "@/utils/dateconversion.js";
Object.keys(dateConversion).forEach((key) => {
  // 注册自定义指令
  Vue.filter(key, dateConversion[key]);
});
Vue.prototype.$Date = dateConversion;

//导入charts并使用
import VCharts from 'v-charts'
Vue.use(VCharts);

/**
 * 加密方法
 */
import * as Secret from '@/utils/secret'
Vue.prototype.$Secret = Secret

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
import * as executeRequest from '@/utils/executeRequest';
Vue.prototype.$executeRequest = executeRequest;
/**
 * 防抖指令
 */
import "@/directives/debounce.js";

/**公用的提示消息框 */
import * as message from "@/utils/message.js";
Vue.prototype.$Msg = message;

/**公用的下载文件全局变量 */
import * as fileOperations from '@/utils/fileOperations.js'
Vue.prototype.$FileOperations = fileOperations;

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
    watch:{
      $route(to,from) {
        store.dispatch("setRequestPath", to.path);
      }
    }
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
