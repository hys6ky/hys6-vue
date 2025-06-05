import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "@/assets/css/common.css"; //引入全局样式
import "./micro";
import { resetMessage } from "@/utils/resetMessage";
import axios from "axios";
import "./utils/demandComponent.js"; //element按需引入

Vue.config.productionTip = false;
Vue.prototype.$resetMessage = resetMessage;
Vue.prototype.$axios = axios;

/**
 * 获取外部配置文件
 */
Vue.prototype.getConfig = function () {
  this.$axios.get("./static/json/gatewayServiceConfig.json").then((res) => {
    if (res && res.data) {
      store.dispatch("setGatewayServiceName", res.data);
    }
  });
};
/**
 * 加密方法
 */
import * as __secret from "@/utils/secret";
Vue.prototype.$Secret = __secret;
/**
 * 防抖指令
 */
import "@/directives/debounce.js";

/**公用的提示消息框 */
import * as message from "@/utils/message.js";
Vue.prototype.$Msg = message;

/**
 * 配置全请求接口的封装
 */
import * as _executeRequest from "@/utils/executeRequest";
Vue.prototype.$executeRequest = _executeRequest;
const whiteList = ["/G/dashboard/preview"]; // 不重定向白名单
new Vue({
  router,
  store,
  render: (h) => h(App),
  watch: {
    $route: "getPath",
  },
  methods: {
    getPath(event) {
      resetMessage.close();
      /**
       * 当请求根之外的地址时,检查是否有用户登陆信息, 没有重定向到登陆页面
       */
      if (event.path !== "/") {
        if (
          !store.getters.getToken &&
          !sessionStorage.getItem("headervalue") &&
          !whiteList.includes(event.path)
        ) {
          router.push("/");
        } else {
          const pathList = event.path.split("/");
          if (pathList.length > 2 && pathList[1] === "app") {
            store.dispatch(
              "setRequestPath",
              `/${pathList[pathList.length - 1]}`
            );
          } else {
            store.dispatch("setRequestPath", event.path);
          }
        }
      }
    },
  },
}).$mount("#app");
