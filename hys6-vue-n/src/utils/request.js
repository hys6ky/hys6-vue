import axios from "axios";
import store from "@/store";
import Vue from "vue";
import qs from "qs";

const service = axios.create({
  // baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000000, // request timeout
});

const cancelToken = axios.CancelToken; // 初始化取消请求的构造函数
let arr = []; // 区分是请求还是响应的头部
/**
 * @param {"请求体信息"} config
 * @param {"直接执行的cancel函数，执行即可取消请求"}
 */
const removePending = (config, f) => {
  // 当前请求存在队列中，取消第二次请求
  if (arr.indexOf(config.url) !== -1) {
    if (f) {
      // f为实例化的cancelToken函数
      arr = arr.filter((item) => item !== config.url);
      f();
    } else {
      arr.push(config.url);
    }
  }
};

// let loadingInstance = [];
//内存中正在请求的数量
let loadingNum = 0;

function startLoading() {
  if (loadingNum === 0) {
    store.dispatch("setLoadingState", true);
  }
  //请求数量加1
  loadingNum++;
}

function endLoading() {
  //请求数量减1
  loadingNum--;
  if (loadingNum <= 0) {
    store.dispatch("setLoadingState", false);
  }
}

// request interceptor
// 请求拦截器
service.interceptors.request.use(
  (config) => {
    //  打开loadding
    if (config.url.indexOf("login") === -1) {
      startLoading();
    }
    // 每次发送请求之前判断vuex中是否存在token, 如果请求时不存在用户的登陆信息则直接返回到登陆页面
    //如果不是登录, 则从仓库区去的登录时的用户token信息
    if (!config.url.endsWith("/login")) {
      let headerKey = store.getters.getHeaderKey;
      config.headers[headerKey] = sessionStorage.getItem(
        store.getters.getHeadervalue
      );
    }
    /**
     * 对数据进行序列化
     */
    config.paramsSerializer = function (params) {
      return qs.stringify(params, { arrayFormat: "repeat" });
    };
    /**
     * 这里对重复请求进行忽略
     */
    config.cancelToken = new cancelToken((c) => {
      removePending(config, c);
    });

    return config;
  },
  (error) => {
    endLoading();
    return Promise.error(error);
  }
);

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  (response) => {
    removePending(response.config);
    // loadingInstance = loadingInstance.filter(item => item != response.config.url)
    endLoading();
    // 对响应数据做些事，把loading动画关掉
    const res = response.data;
    /**
     * 这里是对请求错误的统一处理, 如果不是正常的Code值, 则直接提示数据返回中的message信息
     */
    if (res.code && res.code !== 999 && res.code !== 200) {
      Vue.prototype.$resetMessage.error(res.message);
      return res;
    }
    return res;
  },
  (error) => {
    endLoading();
    Vue.prototype.$resetMessage.error(error.message);
    // return Promise.reject(error);
  }
);

export default service;
