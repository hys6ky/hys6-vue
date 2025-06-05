export default {
  // 设置全局参数
  state: {
    path: false,
  },
  // 数据的更改操作
  mutations: {
    SET_ROUTER_REQUEST_PATH: (state, path) => {
      state.path = path;
    },
  },
  // 返回数据的方法
  getters: {
    getModelNameAndFuncName(state) {
      return state.path;
    },
  },
  // 异步调用定义
  actions: {
    setRequestPath({ commit }, path) {
      commit("SET_ROUTER_REQUEST_PATH", path);
    },
  },
};
