export default {
  // 设置全局参数
  state: {
    loadingStatus: false,
  },
  // 数据的更改操作
  mutations: {
    SET_LOADING: (state, loadingStatus) => {
      state.loadingStatus = loadingStatus;
    },
  },
  // 返回数据的方法
  getters: {
    getloadingStatus(state) {
      return state.loadingStatus;
    },
  },
  // 异步调用定义
  actions: {
    setLoadingState({ commit }, loadingStatus) {
      commit("SET_LOADING", loadingStatus);
    },
  },
};
